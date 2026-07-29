<?php

namespace Tests\Feature;

use App\Integrations\Salesforce\SalesforceMetadataClient;
use App\Integrations\Salesforce\SalesforceMetadataPackage;
use App\Models\Organization;
use App\Models\SalesforceConnection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SalesforceMetadataClientTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_builds_a_versioned_metadata_zip(): void
    {
        $path = (new SalesforceMetadataPackage)->build();

        try {
            $zip = new \ZipArchive;
            $this->assertTrue($zip->open($path));
            $this->assertNotFalse($zip->locateName('package.xml'));
            $this->assertNotFalse($zip->locateName('objects/Authora_Authorization__c.object-meta.xml'));
            $this->assertNotFalse($zip->locateName('objects/Authora_Evidence__c.object-meta.xml'));
            $this->assertNotFalse($zip->locateName('permissionsets/Authora_User.permissionset-meta.xml'));
            $this->assertNotFalse($zip->locateName('applications/Authora_Health.app-meta.xml'));
            $this->assertNotFalse($zip->locateName('tabs/Authora_Operations_Home.tab-meta.xml'));
            $this->assertNotFalse($zip->locateName('flexipages/Authora_Operations_Home.flexipage-meta.xml'));
            $this->assertStringContainsString('<version>66.0</version>', $zip->getFromName('package.xml'));
            $zip->close();
        } finally {
            @unlink($path);
        }
    }

    public function test_it_starts_and_reads_a_metadata_deployment(): void
    {
        $connection = $this->connection();
        Http::fakeSequence()
            ->push($this->soap('<result><done>false</done><id>0Af-authora</id><state>Queued</state></result>'))
            ->push($this->soap('<result><done>true</done><id>0Af-authora</id><status>Succeeded</status><success>true</success><numberComponentsTotal>5</numberComponentsTotal><numberComponentsDeployed>5</numberComponentsDeployed><numberComponentErrors>0</numberComponentErrors></result>'));

        $path = (new SalesforceMetadataPackage)->build();

        try {
            $client = new SalesforceMetadataClient($connection);
            $this->assertSame('0Af-authora', $client->deploy($path));
            $status = $client->status('0Af-authora');
        } finally {
            @unlink($path);
        }

        $this->assertTrue($status['done']);
        $this->assertTrue($status['success']);
        $this->assertSame('Succeeded', $status['status']);
        $this->assertSame(5, $status['number_components_deployed']);

        Http::assertSent(fn ($request) => str_contains($request->url(), '/services/Soap/m/66.0/00D-authora'));
    }

    private function connection(): SalesforceConnection
    {
        $organization = Organization::create([
            'public_id' => fake()->uuid(),
            'name' => 'Metadata Test Health',
            'slug' => fake()->unique()->slug(),
        ]);

        return SalesforceConnection::create([
            'organization_id' => $organization->id,
            'salesforce_org_id' => '00D-authora',
            'instance_url' => 'https://authora.my.salesforce.com',
            'api_version' => 'v66.0',
            'access_token' => 'access-secret',
            'refresh_token' => 'refresh-secret',
            'status' => 'connected',
        ]);
    }

    private function soap(string $result): string
    {
        return <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body><response>{$result}</response></soapenv:Body>
</soapenv:Envelope>
XML;
    }
}
