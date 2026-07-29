<?php

namespace App\Integrations\Salesforce;

use App\Models\SalesforceConnection;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use RuntimeException;

final class SalesforceClient
{
    public function __construct(
        private readonly SalesforceConnection $connection,
        private readonly SalesforceTokenManager $tokens = new SalesforceTokenManager,
    ) {}

    public function get(string $path, array $query = []): Response
    {
        return $this->send('get', $path, $query);
    }

    public function post(string $path, array $payload = []): Response
    {
        return $this->send('post', $path, $payload);
    }

    public function patch(string $path, array $payload = []): Response
    {
        return $this->send('patch', $path, $payload);
    }

    public function delete(string $path, array $query = []): Response
    {
        return $this->send('delete', $path, $query);
    }

    public function composite(array $requests, bool $allOrNone = true): array
    {
        return $this->post('composite', [
            'allOrNone' => $allOrNone,
            'compositeRequest' => $requests,
        ])->json();
    }

    public function createRecord(string $object, array $attributes): array
    {
        return $this->post('sobjects/'.rawurlencode($object), $attributes)->json();
    }

    public function updateRecord(string $object, string $recordId, array $attributes): void
    {
        $this->patch('sobjects/'.rawurlencode($object).'/'.rawurlencode($recordId), $attributes);
    }

    public function limits(): array
    {
        return $this->get('limits')->json();
    }

    public function resources(): array
    {
        return $this->get('')->json();
    }

    public function sobjects(): array
    {
        return $this->get('sobjects')->json();
    }

    public function describe(string $object): array
    {
        return $this->get('sobjects/'.rawurlencode($object).'/describe')->json();
    }

    public function query(string $soql): array
    {
        return $this->get('query', ['q' => $soql])->json();
    }

    private function send(string $method, string $path, array $data): Response
    {
        $response = $this->request()->{$method}($this->url($path), $data);

        if ($response->status() === 401) {
            $this->tokens->refresh($this->connection);
            $response = $this->request()->{$method}($this->url($path), $data);
        }

        if ($response->failed()) {
            $this->connection->update([
                'status' => $response->status() === 401 ? 'reauthorization_required' : 'error',
                'last_error' => 'Salesforce API request failed with status '.$response->status().'.',
            ]);
        }

        return $response->throw();
    }

    private function request(): PendingRequest
    {
        return Http::acceptJson()
            ->withToken($this->connection->access_token)
            ->withHeaders(['Sforce-Call-Options' => 'client=AuthoraHealth'])
            ->timeout((int) config('services.salesforce.request_timeout', 25))
            ->retry(2, 300, throw: false);
    }

    private function url(string $path): string
    {
        return sprintf(
            '%s/services/data/%s/%s',
            $this->trustedInstanceUrl(),
            config('services.salesforce.api_version'),
            ltrim($path, '/'),
        );
    }

    private function trustedInstanceUrl(): string
    {
        $url = rtrim((string) $this->connection->instance_url, '/');
        $host = parse_url($url, PHP_URL_HOST);

        if (! is_string($host) || ! str_ends_with(strtolower($host), '.salesforce.com')) {
            throw new RuntimeException('The Salesforce instance URL is not trusted.');
        }

        return $url;
    }
}
