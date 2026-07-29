<?php

namespace Tests\Feature;

use App\Models\AiProviderCredential;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class WorkspaceApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_returns_tenant_scoped_operational_data(): void
    {
        [$user] = $this->tenant();

        $this->actingAs($user)->getJson('/api/dashboard')
            ->assertOk()
            ->assertJsonPath('metrics.open', 0)
            ->assertJsonPath('cases', [])
            ->assertJsonPath('integrations.salesforce', null);
    }

    public function test_user_can_update_profile_and_organization_settings(): void
    {
        [$user, $organization] = $this->tenant();

        $this->actingAs($user)->putJson('/api/settings/profile', [
            'name' => 'Morgan Reed',
            'email' => 'morgan@authora.test',
            'organization_name' => 'Northstar Health',
            'timezone' => 'America/Chicago',
        ])->assertOk();

        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'Morgan Reed']);
        $this->assertDatabaseHas('organizations', [
            'id' => $organization->id,
            'name' => 'Northstar Health',
            'timezone' => 'America/Chicago',
        ]);
    }

    public function test_admin_can_store_ai_key_encrypted_through_settings_api(): void
    {
        [$user, $organization] = $this->tenant();
        $apiKey = 'sk-project-workspace-settings-secret';

        $this->actingAs($user)->putJson('/api/settings/ai', ['api_key' => $apiKey])
            ->assertOk();

        $credential = AiProviderCredential::firstOrFail();
        $this->assertSame($apiKey, $credential->api_key);
        $this->assertNotSame($apiKey, DB::table('ai_provider_credentials')->value('api_key'));

        $this->actingAs($user)->getJson('/api/settings')
            ->assertOk()
            ->assertJsonPath('ai.configured', true)
            ->assertJsonMissing(['api_key' => $apiKey])
            ->assertJsonPath('organization.name', $organization->name);
    }

    private function tenant(): array
    {
        $organization = Organization::create([
            'public_id' => fake()->uuid(),
            'name' => 'Authora Test Health',
            'slug' => fake()->unique()->slug(),
        ]);
        $user = User::factory()->create([
            'organization_id' => $organization->id,
            'role' => 'organization_admin',
        ]);

        return [$user, $organization];
    }
}
