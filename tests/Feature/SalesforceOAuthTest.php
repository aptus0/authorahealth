<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
}
