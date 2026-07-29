<?php

namespace App\Http\Controllers;

use App\Integrations\OpenAI\OpenAiClient;
use App\Models\AiProviderCredential;
use App\Models\AuditEvent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class AiSettingsController extends Controller
{
    public function edit(Request $request): Response
    {
        $credential = AiProviderCredential::where('organization_id', $request->user()->organization_id)->first();

        return Inertia::render('Settings/AI', [
            'credential' => $credential ? [
                'provider' => $credential->provider,
                'model' => $credential->model,
                'status' => $credential->status,
                'configured' => true,
                'last_validated_at' => $credential->last_validated_at?->toIso8601String(),
                'last_error' => $credential->last_error,
                'key_hint' => '••••••••'.substr((string) $credential->api_key, -4),
            ] : null,
            'recommendedModel' => 'gpt-5.6',
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        abort_unless($request->user()->role === 'organization_admin', 403);

        $validated = $request->validate([
            'api_key' => ['required', 'string', 'starts_with:sk-', 'min:20', 'max:255'],
            'model' => ['required', 'string', 'in:gpt-5.6'],
        ]);

        $credential = AiProviderCredential::updateOrCreate(
            ['organization_id' => $request->user()->organization_id],
            [
                'provider' => 'openai',
                'api_key' => $validated['api_key'],
                'model' => $validated['model'],
                'status' => 'configured',
                'last_validated_at' => null,
                'last_error' => null,
            ],
        );

        $this->audit($request, 'ai.provider.configured', $credential);

        return back()->with('success', 'OpenAI provider settings saved securely.');
    }

    public function test(Request $request): RedirectResponse
    {
        abort_unless($request->user()->role === 'organization_admin', 403);
        $credential = AiProviderCredential::where('organization_id', $request->user()->organization_id)->firstOrFail();

        try {
            (new OpenAiClient($credential))->respond(
                'Return exactly: Authora AI connection verified.',
                'Connection test without patient or clinical data.',
            );
        } catch (Throwable $exception) {
            return back()->with('error', $exception->getMessage());
        }

        $this->audit($request, 'ai.provider.validated', $credential);

        return back()->with('success', 'OpenAI connection verified.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        abort_unless($request->user()->role === 'organization_admin', 403);
        AiProviderCredential::where('organization_id', $request->user()->organization_id)->delete();

        AuditEvent::create([
            'organization_id' => $request->user()->organization_id,
            'actor_id' => $request->user()->id,
            'event' => 'ai.provider.removed',
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'OpenAI credentials removed.');
    }

    private function audit(Request $request, string $event, AiProviderCredential $credential): void
    {
        AuditEvent::create([
            'organization_id' => $request->user()->organization_id,
            'actor_id' => $request->user()->id,
            'event' => $event,
            'auditable_type' => $credential::class,
            'auditable_id' => $credential->id,
            'ip_address' => $request->ip(),
            'context' => ['provider' => $credential->provider, 'model' => $credential->model],
        ]);
    }
}
