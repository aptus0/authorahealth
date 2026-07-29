<?php

namespace Tests\Feature;

use App\Jobs\ProvisionSalesforceOrg;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class SalesforceOAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_tenant_can_start_salesforce_oauth_flow(): void
    {
        config([
            'services.salesforce.client_id' => 'client-id',
            'services.salesforce.client_secret' => 'client-secret',
            'services.salesforce.login_url' => 'https://login.salesforce.com',
        ]);

        $organization = Organization::create([
            'public_id' => fake()->uuid(),
            'name' => 'Northstar Orthopedics',
            'slug' => 'northstar-orthopedics',
        ]);
        $user = User::factory()->create(['organization_id' => $organization->id]);

        $response = $this->actingAs($user)->get(route('integrations.salesforce.redirect'));

        $response->assertRedirectContains('https://login.salesforce.com/services/oauth2/authorize');
        $response->assertSessionHas('salesforce_oauth_state');
    }

    public function test_successful_oauth_callback_queues_automatic_org_setup(): void
    {
        Queue::fake();
        config([
            'services.salesforce.client_id' => 'client-id',
            'services.salesforce.client_secret' => 'client-secret',
            'services.salesforce.login_url' => 'https://login.salesforce.com',
        ]);
        Http::fake([
            'https://login.salesforce.com/services/oauth2/token' => Http::response([
                'access_token' => 'access-secret',
                'refresh_token' => 'refresh-secret',
                'instance_url' => 'https://authora.my.salesforce.com',
                'id' => 'https://login.salesforce.com/id/00D-authora/005-authora',
                'token_type' => 'Bearer',
                'scope' => 'api refresh_token',
            ]),
            'https://login.salesforce.com/id/00D-authora/005-authora' => Http::response([
                'organization_id' => '00D-authora',
                'user_id' => '005-authora',
            ]),
        ]);
        $organization = Organization::create([
            'public_id' => fake()->uuid(),
            'name' => 'Automatic Setup Health',
            'slug' => 'automatic-setup-health',
        ]);
        $user = User::factory()->create(['organization_id' => $organization->id]);

        $this->actingAs($user)
            ->withSession(['salesforce_oauth_state' => 'secure-state'])
            ->get(route('integrations.salesforce.callback', [
                'code' => 'authorization-code',
                'state' => 'secure-state',
            ]))
            ->assertRedirect();

        $this->assertDatabaseHas('salesforce_connections', [
            'organization_id' => $organization->id,
            'provisioning_status' => 'queued',
        ]);
        Queue::assertPushed(ProvisionSalesforceOrg::class);
    }
}
