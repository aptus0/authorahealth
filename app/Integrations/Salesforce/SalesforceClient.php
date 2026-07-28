<?php

namespace App\Integrations\Salesforce;

use App\Models\SalesforceConnection;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use RuntimeException;

final class SalesforceClient
{
    public function __construct(private readonly SalesforceConnection $connection) {}

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

        if ($response->status() === 401 && $this->connection->refresh_token) {
            $this->refreshAccessToken();
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
            ->timeout(20)
            ->retry(2, 250, throw: false);
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

    private function refreshAccessToken(): void
    {
        $response = Http::asForm()->post(
            rtrim(config('services.salesforce.login_url'), '/').'/services/oauth2/token',
            [
                'grant_type' => 'refresh_token',
                'client_id' => config('services.salesforce.client_id'),
                'client_secret' => config('services.salesforce.client_secret'),
                'refresh_token' => $this->connection->refresh_token,
            ],
        );

        if ($response->failed()) {
            $this->connection->update(['status' => 'error', 'last_error' => 'Salesforce token refresh failed.']);
            throw new RuntimeException('Unable to refresh the Salesforce access token.');
        }

        $this->connection->update([
            'access_token' => $response->json('access_token'),
            'instance_url' => $response->json('instance_url', $this->connection->instance_url),
            'refresh_token' => $response->json('refresh_token', $this->connection->refresh_token),
            'status' => 'connected',
            'last_error' => null,
        ]);
    }
}
