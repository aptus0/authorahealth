<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Integrations\Salesforce\SalesforceOrgAssessment;
use App\Integrations\Salesforce\SalesforcePackagePlan;
use App\Jobs\ProvisionSalesforceOrg;
use App\Models\AuditEvent;
use App\Models\SalesforceConnection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SalesforceIntegrationController extends Controller
{
    public function show(Request $request, SalesforcePackagePlan $plan): JsonResponse
    {
        $connection = $this->connection($request, false);

        return response()->json([
            'configured' => filled(config('services.salesforce.client_id')),
            'connection' => $connection ? $this->payload($connection) : null,
            'package' => $plan->manifest(),
        ]);
    }

    public function assess(Request $request, SalesforceOrgAssessment $assessment): JsonResponse
    {
        $connection = $this->connection($request);
        $result = $assessment->assess($connection);
        $connection->update([
            'assessment' => $result,
            'assessed_at' => now(),
            'last_synced_at' => now(),
            'status' => 'connected',
            'last_error' => null,
        ]);

        AuditEvent::create([
            'organization_id' => $request->user()->organization_id,
            'actor_id' => $request->user()->id,
            'event' => 'salesforce.assessed',
            'auditable_type' => $connection::class,
            'auditable_id' => $connection->id,
            'context' => ['capabilities' => $result['capabilities']],
        ]);

        return response()->json(['assessment' => $result]);
    }

    public function install(Request $request): JsonResponse
    {
        abort_unless($request->user()->role === 'organization_admin', 403, 'Organization administrator access is required.');
        $connection = $this->connection($request);
        abort_if(in_array($connection->provisioning_status, ['queued', 'assessing', 'validating', 'packaging', 'deploying'], true), 409, 'Provisioning is already in progress.');

        $validated = $request->validate([
            'package_version' => ['nullable', 'string', 'in:0.2.0'],
            'confirm' => ['nullable', 'boolean'],
        ]);

        abort_if(
            array_key_exists('confirm', $validated) && $validated['confirm'] !== true,
            422,
            'Explicit metadata installation confirmation is required.',
        );

        $connection->update([
            'provisioning_status' => 'queued',
            'deployment_id' => null,
            'deployment_result' => null,
            'deployment_started_at' => null,
            'deployment_checked_at' => null,
            'provisioning_progress' => 15,
            'provisioning_step' => 'Salesforce org assessment and validation queued.',
            'last_error' => null,
        ]);
        ProvisionSalesforceOrg::dispatch($connection->id, $request->user()->id);

        return response()->json(['connection' => $this->payload($connection->fresh())], 202);
    }

    public function deployment(Request $request): JsonResponse
    {
        return response()->json([
            'connection' => $this->payload($this->connection($request)),
            'poll_after_seconds' => (int) config('services.salesforce.deployment_poll_seconds', 10),
        ]);
    }

    private function connection(Request $request, bool $required = true): ?SalesforceConnection
    {
        $query = SalesforceConnection::where('organization_id', $request->user()->organization_id);

        return $required ? $query->firstOrFail() : $query->first();
    }

    private function payload(SalesforceConnection $connection): array
    {
        return $connection->only([
            'salesforce_org_id', 'instance_url', 'status', 'connected_at', 'last_synced_at',
            'last_error', 'provisioning_status', 'deployment_id', 'provisioning_progress',
            'provisioning_step', 'provisioned_at',
            'api_version', 'environment', 'assessment', 'assessed_at',
            'deployment_result', 'deployment_started_at', 'deployment_checked_at',
        ]);
    }
}
