<?php

namespace App\Integrations\Salesforce;

final class SalesforcePackagePlan
{
    public function manifest(): array
    {
        return [
            'version' => '0.1.0',
            'components' => [
                ['type' => 'CustomObject', 'name' => 'Authora_Authorization__c'],
                ['type' => 'CustomObject', 'name' => 'Authora_Installation__c'],
                ['type' => 'CustomField', 'name' => 'Authora_Authorization__c.Authora_Case_Id__c'],
                ['type' => 'CustomField', 'name' => 'Authora_Authorization__c.Service_Date__c'],
                ['type' => 'CustomField', 'name' => 'Authora_Authorization__c.Status__c'],
                ['type' => 'ValidationRule', 'name' => 'Authora_Authorization__c.Service_Date_Required_When_Ready'],
                ['type' => 'PermissionSet', 'name' => 'Authora_User'],
                ['type' => 'Flow', 'name' => 'Authora_Authorization_Readiness'],
            ],
            'rollback_on_error' => true,
            'requires_admin_confirmation' => true,
        ];
    }
}
