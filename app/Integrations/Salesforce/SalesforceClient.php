<?php

namespace App\Integrations\Salesforce;

use App\Models\SalesforceConnection;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use RuntimeException;

final class SalesforceClient
{
    public function __construct(private readonly SalesforceConnection $connection)
    {
    }

    public function get(string $path, array $query = []): Response
    {
        $response = $this->request()->get($this->url($path), $query);

        if ($response->status() === 401 && $this->connection->refresh_token) {
            $this->refreshAccessToken();
            $response = $this->request()->get($this->url($path), $query);
        }

        return $response->throw();
    }

    public function limits(): array
    {
        return $this->get('limits')->json();
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
            rtrim((string) $this->connection->instance_url, '/'),
            config('services.salesforce.api_version'),
            ltrim($path, '/'),
        );
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
