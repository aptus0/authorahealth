<?php

namespace App\Jobs;

use App\Integrations\Salesforce\SalesforceClient;
use App\Models\AuditEvent;
use App\Models\SalesforceConnection;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

class ProvisionSalesforceOrg implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(public readonly int $connectionId, public readonly ?int $actorId = null)
    {
        $this->onQueue('integrations');
    }

    public function handle(): void
    {
        $connection = SalesforceConnection::findOrFail($this->connectionId);
        $connection->update(['provisioning_status' => 'validating', 'provisioning_progress' => 25, 'provisioning_step' => 'Validating Salesforce API access.']);

        (new SalesforceClient($connection))->limits();

        // The package is prepared locally. A production Metadata API transport will
        // replace this explicit approval boundary after connected-org validation.
        $connection->update([
            'provisioning_status' => 'awaiting_metadata_deploy',
            'provisioning_progress' => 40,
            'provisioning_step' => 'Connection validated; metadata deployment approval is required.',
            'last_error' => null,
        ]);

        AuditEvent::create([
            'organization_id' => $connection->organization_id,
            'actor_id' => $this->actorId,
            'event' => 'salesforce.provisioning.validated',
            'auditable_type' => $connection::class,
            'auditable_id' => $connection->id,
            'context' => ['package_version' => '0.1.0'],
        ]);
    }

    public function failed(?Throwable $exception): void
    {
        SalesforceConnection::whereKey($this->connectionId)->update([
            'provisioning_status' => 'failed',
            'provisioning_step' => 'Salesforce validation failed.',
            'last_error' => $exception?->getMessage() ?: 'Salesforce provisioning failed.',
        ]);
    }
}
