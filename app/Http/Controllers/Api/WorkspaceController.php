<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiProviderCredential;
use App\Models\AuthorizationCase;
use App\Models\SalesforceConnection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class WorkspaceController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $organizationId = $request->user()->organization_id;
        $base = AuthorizationCase::query()->where('organization_id', $organizationId);

        return response()->json([
            'metrics' => [
                'open' => (clone $base)->whereNotIn('status', ['approved', 'cancelled'])->count(),
                'due_today' => (clone $base)->whereDate('due_at', today())->count(),
                'approved' => (clone $base)->where('status', 'approved')->count(),
                'ready' => (clone $base)->where('status', 'ready')->count(),
                'revenue_at_risk' => (float) (clone $base)
                    ->whereIn('status', ['documentation_required', 'denied'])
                    ->sum('estimated_revenue'),
            ],
            'cases' => (clone $base)
                ->with(['patient:id,first_name,last_name', 'payer:id,name'])
                ->orderByRaw('due_at IS NULL, due_at')
                ->limit(8)
                ->get()
                ->map(fn (AuthorizationCase $case) => [
                    'id' => $case->public_id,
                    'number' => $case->case_number,
                    'patient' => trim($case->patient->first_name.' '.$case->patient->last_name),
                    'service' => $case->procedure_code ?: 'Not specified',
                    'payer' => $case->payer?->name ?: 'Not assigned',
                    'status' => $case->status,
                    'priority' => $case->priority,
                    'due' => $case->due_at?->toDateString(),
                ]),
            'integrations' => [
                'salesforce' => SalesforceConnection::where('organization_id', $organizationId)
                    ->first(['status', 'provisioning_status', 'provisioning_progress', 'provisioning_step']),
                'ai' => AiProviderCredential::where('organization_id', $organizationId)
                    ->first(['status', 'model', 'last_validated_at']),
            ],
        ]);
    }

    public function settings(Request $request): JsonResponse
    {
        $user = $request->user()->loadMissing('organization.subscription');
        $credential = AiProviderCredential::where('organization_id', $user->organization_id)->first();

        return response()->json([
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'organization' => [
                'name' => $user->organization->name,
                'timezone' => $user->organization->timezone,
                'plan' => $user->organization->subscription?->plan,
                'status' => $user->organization->subscription?->status,
            ],
            'ai' => $credential ? [
                'configured' => true,
                'model' => $credential->model,
                'status' => $credential->status,
                'key_hint' => '••••••••'.substr((string) $credential->api_key, -4),
                'last_validated_at' => $credential->last_validated_at?->toIso8601String(),
                'last_error' => $credential->last_error,
            ] : ['configured' => false, 'model' => 'gpt-5.6', 'status' => 'not_configured'],
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$request->user()->id],
            'organization_name' => ['required', 'string', 'max:255'],
            'timezone' => ['required', 'timezone'],
        ]);

        $request->user()->update(['name' => $data['name'], 'email' => $data['email']]);
        $request->user()->organization->update([
            'name' => $data['organization_name'],
            'timezone' => $data['timezone'],
        ]);

        return response()->json(['message' => 'Profile settings updated.']);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $request->user()->update(['password' => Hash::make($data['password'])]);

        return response()->json(['message' => 'Password updated.']);
    }

    public function updateAi(Request $request): JsonResponse
    {
        abort_unless($request->user()->role === 'organization_admin', 403);
        $data = $request->validate([
            'api_key' => ['required', 'string', 'starts_with:sk-', 'min:20', 'max:255'],
        ]);

        AiProviderCredential::updateOrCreate(
            ['organization_id' => $request->user()->organization_id],
            [
                'provider' => 'openai',
                'api_key' => $data['api_key'],
                'model' => 'gpt-5.6',
                'status' => 'configured',
                'last_validated_at' => null,
                'last_error' => null,
            ],
        );

        return response()->json(['message' => 'AI provider key encrypted and saved.']);
    }

    public function removeAi(Request $request): JsonResponse
    {
        abort_unless($request->user()->role === 'organization_admin', 403);
        AiProviderCredential::where('organization_id', $request->user()->organization_id)->delete();

        return response()->json([], 204);
    }
}
