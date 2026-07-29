<?php

namespace App\Integrations\OpenAI;

use App\Models\AiProviderCredential;
use App\Models\AuthorizationCase;

final class AuthorizationReadinessAssistant
{
    public function analyze(AuthorizationCase $case, AiProviderCredential $credential): string
    {
        $case->loadMissing('payer:id,name');

        $payload = [
            'case_number' => $case->case_number,
            'status' => $case->status,
            'priority' => $case->priority,
            'service_date_present' => $case->service_date !== null,
            'due_at_present' => $case->due_at !== null,
            'procedure_code' => $case->procedure_code,
            'diagnosis_code_present' => filled($case->diagnosis_code),
            'payer' => $case->payer?->name,
            'payer_reference_present' => filled($case->payer_reference),
        ];

        return (new OpenAiClient($credential))->respond(
            'You are an authorization operations assistant. Review only the supplied non-PHI operational metadata. '.
            'Do not make clinical decisions, determine medical necessity, or claim payer approval. '.
            'Return a concise readiness summary with: readiness, missing operational data, risks, and recommended human next actions.',
            json_encode($payload, JSON_THROW_ON_ERROR),
        );
    }
}
