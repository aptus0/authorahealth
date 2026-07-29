<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SalesforceIdentityTest extends TestCase
{
    use RefreshDatabase;

    public function test_unconfigured_salesforce_sign_in_returns_to_login_with_a_helpful_state(): void
    {
        config([
            'app.frontend_url' => 'https://authora-health.test',
            'services.salesforce.client_id' => null,
            'services.salesforce.client_secret' => null,
        ]);

        $this->get(route('auth.salesforce.redirect'))
            ->assertRedirect('https://authora-health.test/login?salesforce=not-configured');
    }
}
