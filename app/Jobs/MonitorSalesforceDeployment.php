<?php

namespace App\Jobs;

use App\Integrations\Salesforce\SalesforceMetadataClient;
use App\Models\AuditEvent;
use App\Models\SalesforceConnection;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use RuntimeException;

class MonitorSalesforceDeployment implements ShouldQueue
{
    use Queueable;

    public int $tries = 5;

    public function __construct(
        public readonly int $connectionId,
        public readonly ?int $actorId = null,
        public readonly int $check = 1,
    ) {
        $this->onQueue('integrations');
    }

    public function handle(): void
    {
        $connection = SalesforceConnection::findOrFail($this->connectionId);

        if (! $connection->deployment_id || $connection->provisioning_status !== 'deploying') {
            return;
        }

        $result = (new SalesforceMetadataClient($connection))->status($connection->deployment_id);
        $total = max(1, (int) $result['number_components_total']);
        $deployed = min($total, (int) $result['number_components_deployed']);
        $progress = min(94, 55 + (int) floor(($deployed / $total) * 39));

        $connection->update([
            'deployment_result' => $result,
            'deployment_checked_at' => now(),
            'provisioning_progress' => $progress,
            'provisioning_step' => $result['done']
                ? 'Salesforce metadata deployment completed; validating result.'
                : 'Salesforce is deploying the Authora metadata package.',
        ]);

        if (! $result['done']) {
            if ($this->check >= (int) config('services.salesforce.deployment_max_checks', 60)) {
                throw new RuntimeException('Salesforce metadata deployment monitoring timed out.');
            }

            self::dispatch($connection->id, $this->actorId, $this->check + 1)
                ->delay(now()->addSeconds((int) config('services.salesforce.deployment_poll_seconds', 10)));

            return;
        }

        if (! $result['success']) {
            $connection->update([
                'provisioning_status' => 'failed',
                'provisioning_progress' => 100,
                'provisioning_step' => 'Salesforce metadata deployment failed.',
                'last_error' => $result['error_message'] ?: 'Salesforce rejected one or more metadata components.',
            ]);

            $this->audit($connection, 'salesforce.provisioning.failed', $result);

            return;
        }

        $connection->update([
            'provisioning_status' => 'completed',
            'provisioning_progress' => 100,
            'provisioning_step' => 'Authora Salesforce foundation installed successfully.',
            'provisioned_at' => now(),
            'status' => 'connected',
            'last_error' => null,
        ]);

        $this->audit($connection, 'salesforce.provisioning.completed', $result);
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
