<?php

namespace Tests\Feature;

use App\Models\AiProviderCredential;
use App\Models\AuthorizationCase;
use App\Models\Organization;
use App\Models\Patient;
use App\Models\Payer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AiIntegrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_store_an_encrypted_provider_key_without_exposing_it(): void
    {
        [$user] = $this->tenant();
        $apiKey = 'sk-project-authora-secret-key-value';

        $this->actingAs($user)->put('/settings/ai', [
            'api_key' => $apiKey,
            'model' => 'gpt-5.6',
        ])->assertRedirect();

        $credential = AiProviderCredential::firstOrFail();

        $this->assertSame($apiKey, $credential->api_key);
        $this->assertNotSame($apiKey, DB::table('ai_provider_credentials')->value('api_key'));
        $this->assertArrayNotHasKey('api_key', $credential->toArray());
    }

    public function test_non_admin_cannot_change_ai_credentials(): void
    {
        [$user] = $this->tenant();
        $user->update(['role' => 'operator']);

        $this->actingAs($user)->put('/settings/ai', [
            'api_key' => 'sk-project-authora-secret-key-value',
            'model' => 'gpt-5.6',
        ])->assertForbidden();
    }

    public function test_readiness_analysis_sends_only_operational_non_phi_metadata(): void
    {
        [$user, $organization] = $this->tenant();
        $case = $this->authorization($organization);
        AiProviderCredential::create([
            'organization_id' => $organization->id,
            'provider' => 'openai',
            'api_key' => 'sk-project-authora-secret-key-value',
            'model' => 'gpt-5.6',
            'status' => 'configured',
        ]);
        Http::fake([
            'https://api.openai.com/v1/responses' => Http::response([
                'output' => [[
                    'content' => [['type' => 'output_text', 'text' => 'Ready after human review.']],
                ]],
            ]),
        ]);

        $this->actingAs($user)
            ->postJson("/api/ai/authorizations/{$case->public_id}/readiness")
            ->assertOk()
            ->assertJsonPath('phi_sent', false)
            ->assertJsonPath('advisory_only', true);

        Http::assertSent(function ($request): bool {
            $body = $request->data();
            $input = (string) ($body['input'] ?? '');

            return ($body['model'] ?? null) === 'gpt-5.6'
                && ($body['store'] ?? null) === false
                && ! str_contains($input, 'Private')
                && ! str_contains($input, 'Patient')
                && ! str_contains($input, 'clinical note secret');
        });
    }

    public function test_tenant_cannot_analyze_another_tenants_case(): void
    {
        [$user, $organization] = $this->tenant('first');
        [, $otherOrganization] = $this->tenant('second');
        $otherCase = $this->authorization($otherOrganization);
        AiProviderCredential::create([
            'organization_id' => $organization->id,
            'provider' => 'openai',
            'api_key' => 'sk-project-authora-secret-key-value',
            'model' => 'gpt-5.6',
            'status' => 'configured',
        ]);

        $this->actingAs($user)
            ->postJson("/api/ai/authorizations/{$otherCase->public_id}/readiness")
            ->assertNotFound();
    }

    private function tenant(?string $suffix = null): array
    {
        $suffix ??= fake()->unique()->slug();
        $organization = Organization::create([
            'public_id' => fake()->uuid(),
            'name' => "Authora {$suffix}",
            'slug' => "authora-{$suffix}",
        ]);
        $user = User::factory()->create([
            'organization_id' => $organization->id,
            'role' => 'organization_admin',
        ]);

        return [$user, $organization];
    }

    private function authorization(Organization $organization): AuthorizationCase
    {
        $patient = Patient::create([
            'organization_id' => $organization->id,
            'public_id' => fake()->uuid(),
            'medical_record_number' => 'MRN-'.fake()->unique()->numerify('#####'),
            'first_name' => 'Private',
            'last_name' => 'Patient',
            'date_of_birth' => '1985-01-01',
        ]);
        $payer = Payer::create([
            'organization_id' => $organization->id,
            'public_id' => fake()->uuid(),
            'name' => 'Health Plan',
        ]);

        return AuthorizationCase::create([
            'organization_id' => $organization->id,
            'public_id' => fake()->uuid(),
            'case_number' => 'AUTH-'.fake()->unique()->numerify('#####'),
            'patient_id' => $patient->id,
            'payer_id' => $payer->id,
            'status' => 'draft',
            'priority' => 'urgent',
            'service_date' => now()->addWeek()->toDateString(),
            'procedure_code' => 'CPT-123',
            'diagnosis_code' => 'DX-PRIVATE',
            'notes' => 'clinical note secret',
        ]);
    }
}
