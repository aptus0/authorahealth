# Authora Health Salesforce DX

This Salesforce DX project contains the curated metadata installed for each
connected Authora Health tenant: custom authorization and evidence objects,
validation rules, a record-triggered Flow, permission set, Lightning App,
App Builder pages, layouts, and navigation tabs.

## Validate against a sandbox

```bash
sf org login web --alias authora-sandbox --instance-url https://test.salesforce.com
sf project deploy start --source-dir force-app --target-org authora-sandbox --dry-run
```

## Deploy manually

```bash
sf project deploy start --source-dir force-app --target-org authora-sandbox
```

The Authora web application uses the same reviewed metadata source to build a
Metadata API deployment package after OAuth. Automatic deployment remains
disabled until `SALESFORCE_METADATA_DEPLOY_ENABLED=true` is explicitly set.
