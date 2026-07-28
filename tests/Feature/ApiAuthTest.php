<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\Subscription;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_csrf_endpoint_initializes_a_stateful_session(): void
    {
        $response = $this->withHeaders([
            'Origin' => 'https://authora-health.test',
            'Referer' => 'https://authora-health.test/login',
        ])->getJson('/api/auth/csrf');

        $response->assertOk()->assertJsonStructure(['token']);
        $this->assertNotEmpty($response->json('token'));
    }

    public function test_api_registration_creates_a_tenant_trial_and_authenticated_session(): void
    {
        $response = $this->withHeaders([
            'Origin' => 'https://authora-health.test',
            'Referer' => 'https://authora-health.test/register',
        ])->postJson('/api/auth/register', [
            'organization_name' => 'Northstar Orthopedics',
            'name' => 'Morgan Reed',
            'email' => 'morgan@northstar.test',
            'password' => 'secure-password',
            'password_confirmation' => 'secure-password',
        ]);

        $response->assertCreated()->assertJsonPath('user.organization.name', 'Northstar Orthopedics');
        $this->assertAuthenticated();
        $this->assertDatabaseCount(Organization::class, 1);
        $this->assertDatabaseHas(Subscription::class, ['plan' => 'trial', 'status' => 'trialing']);
    }
}
