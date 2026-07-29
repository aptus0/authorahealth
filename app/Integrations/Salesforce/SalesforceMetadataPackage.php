<?php

namespace App\Integrations\Salesforce;

use RuntimeException;
use ZipArchive;

final class SalesforceMetadataPackage
{
    public function build(): string
    {
        $path = tempnam(sys_get_temp_dir(), 'authora-metadata-');

        if ($path === false) {
            throw new RuntimeException('Unable to create the Salesforce metadata package.');
        }

        $zip = new ZipArchive;

        if ($zip->open($path, ZipArchive::OVERWRITE) !== true) {
            throw new RuntimeException('Unable to open the Salesforce metadata package.');
        }

        foreach ($this->files() as $name => $contents) {
            $zip->addFromString($name, $contents);
        }

        $zip->close();

        return $path;
    }

    /**
     * @return array<string, string>
     */
    private function files(): array
    {
        $files = [
            'package.xml' => $this->packageXml(),
            'objects/Authora_Authorization__c.object-meta.xml' => $this->authorizationObject(),
            'objects/Authora_Evidence__c.object-meta.xml' => $this->evidenceObject(),
            'objects/Authora_Installation__c.object-meta.xml' => $this->installationObject(),
            'permissionsets/Authora_User.permissionset-meta.xml' => $this->permissionSet(),
            'flows/Authora_Authorization_Readiness.flow-meta.xml' => $this->flow(),
            ...$this->additionalMetadataFiles(),
        ];

        return array_map(
            fn (string $contents): string => str_replace('66.0', $this->apiVersion(), $contents),
            $files,
        );
    }

    private function packageXml(): string
    {
        return $this->xml(<<<'XML'
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <types>
        <members>Authora_Operations_Home</members>
        <members>Authora_Authorization__c</members>
        <members>Authora_Evidence__c</members>
        <members>Authora_Installation__c</members>
        <name>CustomObject</name>
    </types>
    <types>
        <members>Authora_Authorization__c-Authora Authorization Layout</members>
        <name>Layout</name>
    </types>
    <types>
        <members>Authora_Authorization__c</members>
        <members>Authora_Evidence__c</members>
        <members>Authora_Installation__c</members>
        <name>CustomTab</name>
    </types>
    <types>
        <members>Authora_Health</members>
        <name>CustomApplication</name>
    </types>
    <types>
        <members>Authora_Authorization_Record_Page</members>
        <members>Authora_Operations_Home</members>
        <name>FlexiPage</name>
    </types>
    <types>
        <members>Authora_User</members>
        <name>PermissionSet</name>
    </types>
    <types>
        <members>Authora_Authorization_Readiness</members>
        <name>Flow</name>
    </types>
    <version>66.0</version>
</Package>
XML);
    }

    private function authorizationObject(): string
    {
        return $this->xml(<<<'XML'
<CustomObject xmlns="http://soap.sforce.com/2006/04/metadata">
    <label>Authora Authorization</label>
    <pluralLabel>Authora Authorizations</pluralLabel>
    <nameField>
        <displayFormat>AUTH-{000000}</displayFormat>
        <label>Authorization Number</label>
        <type>AutoNumber</type>
    </nameField>
    <deploymentStatus>Deployed</deploymentStatus>
    <sharingModel>ReadWrite</sharingModel>
    <fields>
        <fullName>Authora_Case_Id__c</fullName>
        <externalId>true</externalId>
        <label>Authora Case ID</label>
        <length>64</length>
        <required>true</required>
        <type>Text</type>
        <unique>true</unique>
    </fields>
    <fields>
        <fullName>Service_Date__c</fullName>
        <label>Service Date</label>
        <required>false</required>
        <type>Date</type>
    </fields>
    <fields>
        <fullName>Status__c</fullName>
        <label>Status</label>
        <required>true</required>
        <type>Picklist</type>
        <valueSet>
            <restricted>true</restricted>
            <valueSetDefinition>
                <sorted>false</sorted>
                <value><fullName>Draft</fullName><default>true</default><label>Draft</label></value>
                <value><fullName>Ready</fullName><default>false</default><label>Ready</label></value>
                <value><fullName>Submitted</fullName><default>false</default><label>Submitted</label></value>
                <value><fullName>Resolved</fullName><default>false</default><label>Resolved</label></value>
            </valueSetDefinition>
        </valueSet>
    </fields>
    <validationRules>
        <fullName>Service_Date_Required_When_Ready</fullName>
        <active>true</active>
        <errorConditionFormula>AND(ISPICKVAL(Status__c, "Ready"), ISBLANK(Service_Date__c))</errorConditionFormula>
        <errorMessage>Service Date is required before an authorization is ready.</errorMessage>
    </validationRules>
</CustomObject>
XML);
    }

    private function installationObject(): string
    {
        return $this->xml(<<<'XML'
<CustomObject xmlns="http://soap.sforce.com/2006/04/metadata">
    <label>Authora Installation</label>
    <pluralLabel>Authora Installations</pluralLabel>
    <nameField><label>Installation Name</label><type>Text</type></nameField>
    <deploymentStatus>Deployed</deploymentStatus>
    <sharingModel>ReadWrite</sharingModel>
    <fields>
        <fullName>Package_Version__c</fullName>
        <label>Package Version</label>
        <length>32</length>
        <required>true</required>
        <type>Text</type>
    </fields>
    <fields>
        <fullName>Provisioning_Status__c</fullName>
        <label>Provisioning Status</label>
        <length>80</length>
        <required>true</required>
        <type>Text</type>
    </fields>
</CustomObject>
XML);
    }

    private function evidenceObject(): string
    {
        return $this->xml(<<<'XML'
<CustomObject xmlns="http://soap.sforce.com/2006/04/metadata">
    <label>Authora Evidence</label>
    <pluralLabel>Authora Evidence</pluralLabel>
    <nameField><displayFormat>EVD-{000000}</displayFormat><label>Evidence Number</label><type>AutoNumber</type></nameField>
    <deploymentStatus>Deployed</deploymentStatus><sharingModel>ReadWrite</sharingModel>
    <fields>
        <fullName>Authorization__c</fullName><label>Authorization</label>
        <referenceTo>Authora_Authorization__c</referenceTo><relationshipLabel>Evidence</relationshipLabel>
        <relationshipName>Evidence</relationshipName><required>true</required><type>MasterDetail</type>
    </fields>
    <fields>
        <fullName>Evidence_Type__c</fullName><label>Evidence Type</label><required>true</required><type>Picklist</type>
        <valueSet><restricted>true</restricted><valueSetDefinition><sorted>false</sorted>
            <value><fullName>Clinical Note</fullName><default>false</default><label>Clinical Note</label></value>
            <value><fullName>Test Result</fullName><default>false</default><label>Test Result</label></value>
            <value><fullName>Coverage Document</fullName><default>false</default><label>Coverage Document</label></value>
            <value><fullName>Other</fullName><default>true</default><label>Other</label></value>
        </valueSetDefinition></valueSet>
    </fields>
    <fields><fullName>Verified__c</fullName><defaultValue>false</defaultValue><label>Verified</label><type>Checkbox</type></fields>
</CustomObject>
XML);
    }

    private function permissionSet(): string
    {
        return $this->xml(<<<'XML'
<PermissionSet xmlns="http://soap.sforce.com/2006/04/metadata">
    <label>Authora User</label>
    <hasActivationRequired>false</hasActivationRequired>
    <objectPermissions>
        <allowCreate>true</allowCreate><allowDelete>false</allowDelete><allowEdit>true</allowEdit>
        <allowRead>true</allowRead><modifyAllRecords>false</modifyAllRecords>
        <object>Authora_Authorization__c</object><viewAllRecords>false</viewAllRecords>
    </objectPermissions>
    <objectPermissions>
        <allowCreate>false</allowCreate><allowDelete>false</allowDelete><allowEdit>false</allowEdit>
        <allowRead>true</allowRead><modifyAllRecords>false</modifyAllRecords>
        <object>Authora_Installation__c</object><viewAllRecords>false</viewAllRecords>
    </objectPermissions>
</PermissionSet>
XML);
    }

    private function flow(): string
    {
        return $this->xml(<<<'XML'
<Flow xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>66.0</apiVersion>
    <interviewLabel>Authora Authorization Readiness {!$Flow.CurrentDateTime}</interviewLabel>
    <label>Authora Authorization Readiness</label>
    <processType>AutoLaunchedFlow</processType>
    <status>Draft</status>
</Flow>
XML);
    }

    private function xml(string $body): string
    {
        return '<?xml version="1.0" encoding="UTF-8"?>'."\n".$body."\n";
    }

    private function apiVersion(): string
    {
        return ltrim((string) config('services.salesforce.api_version', 'v66.0'), 'v');
    }

    /**
     * @return array<string, string>
     */
    private function additionalMetadataFiles(): array
    {
        $root = base_path('salesforce/force-app/main/default');

        if (! is_dir($root)) {
            return [];
        }

        $files = [];
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator(
            $root,
            \FilesystemIterator::SKIP_DOTS,
        ));

        foreach ($iterator as $file) {
            if (! $file->isFile()) {
                continue;
            }

            $relative = str_replace(DIRECTORY_SEPARATOR, '/', substr($file->getPathname(), strlen($root) + 1));
            $directory = explode('/', $relative)[0] ?? '';

            if (! in_array($directory, ['applications', 'flexipages', 'layouts', 'tabs'], true)) {
                continue;
            }
            $contents = file_get_contents($file->getPathname());

            if ($contents !== false) {
                $files[$relative] = $contents;
            }
        }

        return $files;
    }
}
