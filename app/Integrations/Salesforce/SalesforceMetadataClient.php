<?php

namespace App\Integrations\Salesforce;

use App\Models\SalesforceConnection;
use DOMDocument;
use DOMXPath;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use RuntimeException;

final class SalesforceMetadataClient
{
    public function __construct(
        private readonly SalesforceConnection $connection,
        private readonly SalesforceTokenManager $tokens = new SalesforceTokenManager,
    ) {}

    public function deploy(string $zipPath): string
    {
        $contents = file_get_contents($zipPath);

        if ($contents === false) {
            throw new RuntimeException('Unable to read the Salesforce metadata package.');
        }

        $result = $this->call('deploy', sprintf(
            '<met:deploy><met:ZipFile>%s</met:ZipFile><met:DeployOptions>'.
            '<met:allowMissingFiles>false</met:allowMissingFiles>'.
            '<met:autoUpdatePackage>false</met:autoUpdatePackage>'.
            '<met:checkOnly>false</met:checkOnly>'.
            '<met:ignoreWarnings>false</met:ignoreWarnings>'.
            '<met:performRetrieve>false</met:performRetrieve>'.
            '<met:purgeOnDelete>false</met:purgeOnDelete>'.
            '<met:rollbackOnError>true</met:rollbackOnError>'.
            '<met:singlePackage>true</met:singlePackage>'.
            '</met:DeployOptions></met:deploy>',
            base64_encode($contents),
        ));

        return $this->requiredValue($result, 'id');
    }

    public function status(string $deploymentId): array
    {
        $result = $this->call('checkDeployStatus', sprintf(
            '<met:checkDeployStatus><met:asyncProcessId>%s</met:asyncProcessId>'.
            '<met:includeDetails>true</met:includeDetails></met:checkDeployStatus>',
            htmlspecialchars($deploymentId, ENT_XML1),
        ));

        return [
            'id' => $this->value($result, 'id') ?? $deploymentId,
            'done' => $this->value($result, 'done') === 'true',
            'success' => $this->value($result, 'success') === 'true',
            'status' => $this->value($result, 'status') ?? 'Unknown',
            'number_components_total' => (int) ($this->value($result, 'numberComponentsTotal') ?? 0),
            'number_components_deployed' => (int) ($this->value($result, 'numberComponentsDeployed') ?? 0),
            'number_component_errors' => (int) ($this->value($result, 'numberComponentErrors') ?? 0),
            'error_status_code' => $this->value($result, 'errorStatusCode'),
            'error_message' => $this->value($result, 'errorMessage'),
        ];
    }

    private function call(string $action, string $body): DOMXPath
    {
        $response = $this->request($action, $body);

        if ($response->status() === 401) {
            $this->tokens->refresh($this->connection);
            $response = $this->request($action, $body);
        }

        if ($response->failed()) {
            throw new RuntimeException("Salesforce Metadata API {$action} request failed.");
        }

        $document = new DOMDocument;

        if (! @$document->loadXML($response->body(), LIBXML_NONET)) {
            throw new RuntimeException('Salesforce Metadata API returned invalid XML.');
        }

        $xpath = new DOMXPath($document);
        $fault = $xpath->query('//*[local-name()="Fault"]/*[local-name()="faultstring"]')->item(0)?->textContent;

        if (is_string($fault) && $fault !== '') {
            throw new RuntimeException('Salesforce Metadata API fault: '.$fault);
        }

        return $xpath;
    }

    private function request(string $action, string $body): Response
    {
        return Http::withHeaders([
            'Content-Type' => 'text/xml; charset=UTF-8',
            'SOAPAction' => $action,
        ])->timeout((int) config('services.salesforce.request_timeout', 25))
            ->withBody($this->envelope($body), 'text/xml')
            ->post($this->endpoint());
    }

    private function envelope(string $body): string
    {
        $token = htmlspecialchars((string) $this->connection->access_token, ENT_XML1);

        return <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:met="http://soap.sforce.com/2006/04/metadata">
  <soapenv:Header><met:SessionHeader><met:sessionId>{$token}</met:sessionId></met:SessionHeader></soapenv:Header>
  <soapenv:Body>{$body}</soapenv:Body>
</soapenv:Envelope>
XML;
    }

    private function endpoint(): string
    {
        $url = rtrim((string) $this->connection->instance_url, '/');
        $host = parse_url($url, PHP_URL_HOST);

        if (! is_string($host) || ! str_ends_with(strtolower($host), '.salesforce.com')) {
            throw new RuntimeException('The Salesforce instance URL is not trusted.');
        }

        $version = ltrim((string) ($this->connection->api_version ?: config('services.salesforce.api_version')), 'v');

        return sprintf('%s/services/Soap/m/%s/%s', $url, $version, rawurlencode((string) $this->connection->salesforce_org_id));
    }

    private function requiredValue(DOMXPath $xpath, string $name): string
    {
        return $this->value($xpath, $name) ?? throw new RuntimeException("Salesforce Metadata API response is missing {$name}.");
    }

    private function value(DOMXPath $xpath, string $name): ?string
    {
        $value = $xpath->query(sprintf('//*[local-name()="result"]/*[local-name()="%s"]', $name))->item(0)?->textContent;

        return is_string($value) && $value !== '' ? $value : null;
    }
}
