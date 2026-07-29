<?php

namespace App\Http\Controllers;

use App\Integrations\Salesforce\SalesforceClient;
use App\Integrations\Salesforce\SalesforcePackagePlan;
use App\Jobs\ProvisionSalesforceOrg;
use App\Models\AuditEvent;
use App\Models\SalesforceConnection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SalesforceOAuthController extends Controller
{
    public function index(Request $request, SalesforcePackagePlan $plan): Response
    {
        $connection = SalesforceConnection::where('organization_id', $request->user()->organization_id)->first();

        return Inertia::render('Settings/Integrations/Salesforce', [
            'configured' => filled(config('services.salesforce.client_id')) && filled(config('services.salesforce.client_secret')),
            'connection' => $connection ? [
                'status' => $connection->status,
                'instance_url' => $connection->instance_url,
                'salesforce_org_id' => $connection->salesforce_org_id,
                'connected_at' => $connection->connected_at?->toIso8601String(),
                'last_synced_at' => $connection->last_synced_at?->toIso8601String(),
                'last_error' => $connection->last_error,
                'provisioning_status' => $connection->provisioning_status,
                'provisioning_progress' => $connection->provisioning_progress,
                'provisioning_step' => $connection->provisioning_step,
                'provisioned_at' => $connection->provisioned_at?->toIso8601String(),
                'api_version' => $connection->api_version,
                'environment' => $connection->environment,
                'assessment' => $connection->assessment,
                'assessed_at' => $connection->assessed_at?->toIso8601String(),
                'deployment_result' => $connection->deployment_result,
            ] : null,
            'package' => $plan->manifest(),
            'metadataDeploymentEnabled' => (bool) config('services.salesforce.metadata_deploy_enabled'),
        ]);
    }

    public function redirect(Request $request): RedirectResponse
    {
        abort_unless(filled(config('services.salesforce.client_id')), 503, 'Salesforce integration is not configured.');

        $state = Str::random(64);
        $request->session()->put('salesforce_oauth_state', $state);

        $query = http_build_query([
            'response_type' => 'code',
            'client_id' => config('services.salesforce.client_id'),
            'redirect_uri' => route('integrations.salesforce.callback'),
            'scope' => config('services.salesforce.scopes'),
            'state' => $state,
            'prompt' => 'login consent',
        ]);

        return redirect()->away(rtrim(config('services.salesforce.login_url'), '/').'/services/oauth2/authorize?'.$query);
    }

    public function callback(Request $request): RedirectResponse
    {
        $request->validate(['code' => ['required', 'string'], 'state' => ['required', 'string']]);
        abort_unless(hash_equals((string) $request->session()->pull('salesforce_oauth_state'), $request->string('state')->toString()), 419);

        $token = Http::asForm()->post(
            rtrim(config('services.salesforce.login_url'), '/').'/services/oauth2/token',
            [
                'grant_type' => 'authorization_code',
                'code' => $request->string('code')->toString(),
                'client_id' => config('services.salesforce.client_id'),
                'client_secret' => config('services.salesforce.client_secret'),
                'redirect_uri' => route('integrations.salesforce.callback'),
            ],
        )->throw()->json();

        $identity = isset($token['id'])
            ? Http::withToken($token['access_token'])->get($token['id'])->throw()->json()
            : [];

        $connection = SalesforceConnection::updateOrCreate(
            ['organization_id' => $request->user()->organization_id],
            [
                'salesforce_org_id' => $identity['organization_id'] ?? null,
                'salesforce_user_id' => $identity['user_id'] ?? null,
                'instance_url' => $token['instance_url'],
                'api_version' => config('services.salesforce.api_version'),
                'environment' => str_contains((string) config('services.salesforce.login_url'), 'test.salesforce.com') ? 'sandbox' : 'production',
                'access_token' => $token['access_token'],
                'refresh_token' => $token['refresh_token'] ?? null,
                'token_type' => $token['token_type'] ?? 'Bearer',
                'scopes' => explode(' ', $token['scope'] ?? config('services.salesforce.scopes')),
                'status' => 'connected',
                'provisioning_status' => 'ready_to_install',
                'provisioning_progress' => 10,
                'provisioning_step' => 'Connection verified; metadata installation is ready.',
                'connected_at' => now(),
                'last_error' => null,
                'assessment' => null,
                'assessed_at' => null,
                'deployment_id' => null,
                'deployment_result' => null,
                'deployment_started_at' => null,
                'deployment_checked_at' => null,
            ],
        );

        AuditEvent::create([
            'organization_id' => $request->user()->organization_id,
            'actor_id' => $request->user()->id,
            'event' => 'salesforce.connected',
            'auditable_type' => $connection::class,
            'auditable_id' => $connection->id,
            'ip_address' => $request->ip(),
        ]);

        $connection->update([
            'provisioning_status' => 'queued',
            'provisioning_progress' => 15,
            'provisioning_step' => 'Connection verified; automatic org setup queued.',
        ]);
        ProvisionSalesforceOrg::dispatch($connection->id, $request->user()->id);

        return redirect()->away(rtrim((string) config('app.frontend_url'), '/').'/dashboard/integrations?connected=1');
    }

    public function test(Request $request): RedirectResponse
    {
        $connection = SalesforceConnection::where('organization_id', $request->user()->organization_id)->firstOrFail();
        (new SalesforceClient($connection))->limits();
        $connection->update(['last_synced_at' => now(), 'status' => 'connected', 'last_error' => null]);

        return back()->with('success', 'Salesforce connection is healthy.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        SalesforceConnection::where('organization_id', $request->user()->organization_id)->delete();

        AuditEvent::create([
            'organization_id' => $request->user()->organization_id,
            'actor_id' => $request->user()->id,
            'event' => 'salesforce.disconnected',
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Salesforce disconnected.');
    }
}
