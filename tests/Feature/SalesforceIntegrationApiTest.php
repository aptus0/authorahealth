<?php

namespace Tests\Feature;

use App\Jobs\ProvisionSalesforceOrg;
use App\Models\Organization;
use App\Models\SalesforceConnection;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class SalesforceIntegrationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_tenant_can_read_sanitized_salesforce_connection_and_package_plan(): void
    {
        [$user, $connection] = $this->connectedUser();

        $response = $this->actingAs($user)->getJson('/api/salesforce');

        $response->assertOk()
            ->assertJsonPath('connection.salesforce_org_id', '00D-authora')
            ->assertJsonPath('package.version', '0.2.0')
            ->assertJsonMissing(['access_token' => 'access-secret'])
            ->assertJsonMissing(['refresh_token' => 'refresh-secret']);
    }

    public function test_assessment_uses_live_salesforce_resources_without_exposing_tokens(): void
    {
        [$user] = $this->connectedUser();
        Http::fake([
            'https://authora.my.salesforce.com/services/data/v66.0/limits' => Http::response([
                'DailyApiRequests' => ['Remaining' => 14950, 'Max' => 15000],
            ]),
            'https://authora.my.salesforce.com/services/data/v66.0/sobjects' => Http::response([
                'sobjects' => [
                    ['name' => 'Account'],
                    ['name' => 'Contact'],
                    ['name' => 'Case'],
                    ['name' => 'HealthCloudGA__EhrPatient__c'],
                ],
            ]),
        ]);

        $response = $this->actingAs($user)->postJson('/api/salesforce/assess');

        $response->assertOk()
            ->assertJsonPath('assessment.capabilities.case', true)
            ->assertJsonPath('assessment.capabilities.health_cloud', true)
            ->assertJsonPath('assessment.api_usage.daily_remaining', 14950);

        $this->assertDatabaseHas('salesforce_connections', [
            'organization_id' => $user->organization_id,
            'status' => 'connected',
        ]);
    }

    public function test_organization_admin_can_queue_provisioning_validation(): void
    {
        Queue::fake();
        [$user, $connection] = $this->connectedUser();

        $response = $this->actingAs($user)->postJson('/api/salesforce/install');

        $response->assertAccepted()->assertJsonPath('connection.provisioning_status', 'queued');
        $this->assertDatabaseHas('salesforce_connections', [
            'id' => $connection->id,
            'provisioning_status' => 'queued',
            'provisioning_progress' => 15,
        ]);
        Queue::assertPushed(ProvisionSalesforceOrg::class, fn ($job) => $job->connectionId === $connection->id);
    }

    public function test_deployment_endpoint_returns_sanitized_operational_state(): void
    {
        [$user, $connection] = $this->connectedUser();
        $connection->update([
            'provisioning_status' => 'deploying',
            'deployment_id' => '0Af-authora',
            'deployment_result' => ['status' => 'InProgress', 'done' => false, 'success' => false],
        ]);

        $this->actingAs($user)->getJson('/api/salesforce/deployment')
            ->assertOk()
            ->assertJsonPath('connection.deployment_id', '0Af-authora')
            ->assertJsonPath('connection.deployment_result.status', 'InProgress')
            ->assertJsonMissing(['access_token' => 'access-secret']);
    }

    public function test_non_admin_cannot_start_salesforce_installation(): void
    {
        [$user] = $this->connectedUser();
        $user->update(['role' => 'operator']);

        $this->actingAs($user)->postJson('/api/salesforce/install')->assertForbidden();
    }

    private function connectedUser(): array
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
        $connection = SalesforceConnection::create([
            'organization_id' => $organization->id,
            'salesforce_org_id' => '00D-authora',
            'salesforce_user_id' => '005-authora',
            'instance_url' => 'https://authora.my.salesforce.com',
            'access_token' => 'access-secret',
            'refresh_token' => 'refresh-secret',
            'status' => 'connected',
            'provisioning_status' => 'ready_to_install',
            'provisioning_progress' => 10,
        ]);

        return [$user, $connection];
    }
}
