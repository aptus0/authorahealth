<?php

namespace App\Integrations\Salesforce;

use App\Models\SalesforceConnection;
use Illuminate\Support\Arr;

final class SalesforceOrgAssessment
{
    public function assess(SalesforceConnection $connection): array
    {
        $client = new SalesforceClient($connection);
        $limits = $client->limits();
        $catalog = collect(Arr::get($client->sobjects(), 'sobjects', []));
        $names = $catalog->pluck('name');

        return [
            'organization_id' => $connection->salesforce_org_id,
            'api_version' => config('services.salesforce.api_version'),
            'capabilities' => [
                'account' => $names->contains('Account'),
                'contact' => $names->contains('Contact'),
                'case' => $names->contains('Case'),
                'health_cloud' => $names->contains(fn (string $name) => str_starts_with($name, 'HealthCloudGA__')),
                'authora_installed' => $names->contains('Authora_Authorization__c'),
            ],
            'api_usage' => [
                'daily_remaining' => Arr::get($limits, 'DailyApiRequests.Remaining'),
                'daily_max' => Arr::get($limits, 'DailyApiRequests.Max'),
            ],
            'assessed_at' => now()->toIso8601String(),
        ];
    }
}
