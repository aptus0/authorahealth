<?php

namespace Tests\Feature;

use App\Models\AuthorizationCase;
use App\Models\Organization;
use App\Models\Patient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenantIsolationTest extends TestCase
{
    use RefreshDatabase;

    public function test_authorization_queries_can_be_scoped_to_an_organization(): void
    {
        $organizations = collect(['first', 'second'])->map(fn (string $slug) => Organization::create([
            'public_id' => fake()->uuid(),
            'name' => ucfirst($slug).' Clinic',
            'slug' => $slug,
        ]));

        foreach ($organizations as $index => $organization) {
            $patient = Patient::create([
                'organization_id' => $organization->id,
                'public_id' => fake()->uuid(),
                'medical_record_number' => 'MRN-'.$index,
                'first_name' => 'Patient',
                'last_name' => (string) $index,
                'date_of_birth' => '1990-01-01',
            ]);

            AuthorizationCase::create([
                'organization_id' => $organization->id,
                'public_id' => fake()->uuid(),
                'case_number' => 'AUTH-'.$index,
                'patient_id' => $patient->id,
            ]);
        }

        $first = $organizations->first();
        $this->assertSame(1, AuthorizationCase::where('organization_id', $first->id)->count());
        $this->assertSame('AUTH-0', AuthorizationCase::where('organization_id', $first->id)->first()->case_number);
    }
}
