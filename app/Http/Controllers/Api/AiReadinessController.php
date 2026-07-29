<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Integrations\OpenAI\AuthorizationReadinessAssistant;
use App\Models\AiProviderCredential;
use App\Models\AuditEvent;
use App\Models\AuthorizationCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiReadinessController extends Controller
{
    public function __invoke(Request $request, string $case, AuthorizationReadinessAssistant $assistant): JsonResponse
    {
        $authorization = AuthorizationCase::where('organization_id', $request->user()->organization_id)
            ->where('public_id', $case)
            ->firstOrFail();
        $credential = AiProviderCredential::where('organization_id', $request->user()->organization_id)->firstOrFail();

        $analysis = $assistant->analyze($authorization, $credential);

        AuditEvent::create([
            'organization_id' => $request->user()->organization_id,
            'actor_id' => $request->user()->id,
            'event' => 'ai.authorization.readiness_generated',
            'auditable_type' => $authorization::class,
            'auditable_id' => $authorization->id,
            'context' => ['model' => $credential->model, 'phi_sent' => false],
        ]);

        return response()->json([
            'analysis' => $analysis,
            'advisory_only' => true,
            'phi_sent' => false,
        ]);
    }
}
