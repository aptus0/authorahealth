<?php

namespace App\Integrations\Salesforce;

use App\Models\SalesforceConnection;
use Illuminate\Support\Facades\Http;
use RuntimeException;

final class SalesforceTokenManager
{
    public function refresh(SalesforceConnection $connection): void
    {
        if (! $connection->refresh_token) {
            $this->requireReauthorization($connection, 'Salesforce refresh token is unavailable.');
        }

        $response = Http::asForm()
            ->acceptJson()
            ->timeout((int) config('services.salesforce.request_timeout', 25))
            ->post(rtrim((string) config('services.salesforce.login_url'), '/').'/services/oauth2/token', [
                'grant_type' => 'refresh_token',
                'client_id' => config('services.salesforce.client_id'),
                'client_secret' => config('services.salesforce.client_secret'),
                'refresh_token' => $connection->refresh_token,
            ]);

        if ($response->failed() || ! is_string($response->json('access_token'))) {
            $this->requireReauthorization($connection, 'Salesforce token refresh failed.');
        }

        $connection->update([
            'access_token' => $response->json('access_token'),
            'instance_url' => $response->json('instance_url', $connection->instance_url),
            'refresh_token' => $response->json('refresh_token', $connection->refresh_token),
            'status' => 'connected',
            'last_error' => null,
        ]);

        $connection->refresh();
    }

    private function requireReauthorization(SalesforceConnection $connection, string $message): never
    {
        $connection->update([
            'status' => 'reauthorization_required',
            'last_error' => $message,
        ]);

        throw new RuntimeException($message);
    }
}
