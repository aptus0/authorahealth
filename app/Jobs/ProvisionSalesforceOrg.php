<?php

namespace App\Jobs;

use App\Integrations\Salesforce\SalesforceClient;
use App\Integrations\Salesforce\SalesforceMetadataClient;
use App\Integrations\Salesforce\SalesforceMetadataPackage;
use App\Integrations\Salesforce\SalesforceOrgAssessment;
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

    public function handle(
        SalesforceOrgAssessment $assessment,
        SalesforceMetadataPackage $package,
    ): void {
        $connection = SalesforceConnection::findOrFail($this->connectionId);
        $connection->update([
            'provisioning_status' => 'assessing',
            'provisioning_progress' => 20,
            'provisioning_step' => 'Assessing Salesforce org capabilities and API capacity.',
        ]);

        $result = $assessment->assess($connection);
        $connection->update([
            'assessment' => $result,
            'assessed_at' => now(),
            'last_synced_at' => now(),
            'provisioning_status' => 'validating',
            'provisioning_progress' => 35,
            'provisioning_step' => 'Org assessment complete; validating installation policy.',
        ]);

        (new SalesforceClient($connection))->limits();

        if (! config('services.salesforce.metadata_deploy_enabled')) {
            $connection->update([
                'provisioning_status' => 'awaiting_metadata_deploy',
                'provisioning_progress' => 40,
                'provisioning_step' => 'Package validated; enable Metadata API deployment to install.',
                'last_error' => null,
            ]);

            $this->audit($connection, 'salesforce.provisioning.validated', [
                'package_version' => '0.2.0',
                'deployment_enabled' => false,
            ]);

            return;
        }

        $connection->update([
            'provisioning_status' => 'packaging',
            'provisioning_progress' => 45,
            'provisioning_step' => 'Building the versioned Salesforce metadata package.',
        ]);

        $zipPath = $package->build();

        try {
            $deploymentId = (new SalesforceMetadataClient($connection))->deploy($zipPath);
        } finally {
            @unlink($zipPath);
        }

        $connection->update([
            'provisioning_status' => 'deploying',
            'deployment_id' => $deploymentId,
            'deployment_result' => ['status' => 'Pending', 'done' => false, 'success' => false],
            'deployment_started_at' => now(),
            'deployment_checked_at' => null,
            'provisioning_progress' => 55,
            'provisioning_step' => 'Salesforce metadata deployment is running.',
            'last_error' => null,
        ]);

        $this->audit($connection, 'salesforce.provisioning.started', [
            'package_version' => '0.2.0',
            'deployment_id' => $deploymentId,
        ]);

        MonitorSalesforceDeployment::dispatch($connection->id, $this->actorId)
            ->delay(now()->addSeconds((int) config('services.salesforce.deployment_poll_seconds', 10)));
    }

    public function failed(?Throwable $exception): void
    {
        SalesforceConnection::whereKey($this->connectionId)->update([
            'provisioning_status' => 'failed',
            'provisioning_step' => 'Salesforce validation failed.',
            'last_error' => $exception?->getMessage() ?: 'Salesforce provisioning failed.',
        ]);
    }

    private function audit(SalesforceConnection $connection, string $event, array $context): void
    {
        AuditEvent::create([
            'organization_id' => $connection->organization_id,
            'actor_id' => $this->actorId,
            'event' => $event,
            'auditable_type' => $connection::class,
            'auditable_id' => $connection->id,
            'context' => $context,
        ]);
    }
}
