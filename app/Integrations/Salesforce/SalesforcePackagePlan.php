<?php

namespace App\Integrations\Salesforce;

final class SalesforcePackagePlan
{
    public function manifest(): array
    {
        return [
            'version' => '0.2.0',
            'components' => [
                ['type' => 'CustomObject', 'name' => 'Authora_Authorization__c'],
                ['type' => 'CustomObject', 'name' => 'Authora_Installation__c'],
                ['type' => 'CustomObject', 'name' => 'Authora_Evidence__c'],
                ['type' => 'CustomField', 'name' => 'Authora_Authorization__c.Authora_Case_Id__c'],
                ['type' => 'CustomField', 'name' => 'Authora_Authorization__c.Service_Date__c'],
                ['type' => 'CustomField', 'name' => 'Authora_Authorization__c.Status__c'],
                ['type' => 'CustomField', 'name' => 'Authora_Installation__c.Package_Version__c'],
                ['type' => 'CustomField', 'name' => 'Authora_Installation__c.Provisioning_Status__c'],
                ['type' => 'ValidationRule', 'name' => 'Authora_Authorization__c.Service_Date_Required_When_Ready'],
                ['type' => 'PermissionSet', 'name' => 'Authora_User'],
                ['type' => 'Flow', 'name' => 'Authora_Authorization_Readiness'],
                ['type' => 'CustomTab', 'name' => 'Authora_Authorization__c'],
                ['type' => 'CustomTab', 'name' => 'Authora_Evidence__c'],
                ['type' => 'CustomTab', 'name' => 'Authora_Installation__c'],
                ['type' => 'CustomApplication', 'name' => 'Authora_Health'],
                ['type' => 'FlexiPage', 'name' => 'Authora_Operations_Home'],
                ['type' => 'FlexiPage', 'name' => 'Authora_Authorization_Record_Page'],
                ['type' => 'Layout', 'name' => 'Authora_Authorization__c-Authora Authorization Layout'],
            ],
            'rollback_on_error' => true,
            'requires_admin_confirmation' => true,
            'deployment_transport' => 'Salesforce Metadata API',
        ];
    }
}
