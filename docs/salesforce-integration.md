# Salesforce integration

Authora Health connects one Salesforce org to each tenant through OAuth 2.0 and keeps all credentials encrypted by the application model.

## Runtime services

- `SalesforceTokenManager` refreshes expired access tokens and marks connections that require reauthorization.
- `SalesforceClient` provides REST resources for limits, object discovery, describe, SOQL, record operations, and Composite API calls.
- `SalesforceOrgAssessment` inventories standard objects, Health Cloud indicators, installed Authora metadata, and daily API capacity.
- `SalesforceMetadataPackage` creates the versioned deploy ZIP in memory-safe temporary storage.
- `SalesforceMetadataClient` starts and monitors Metadata API deployments over SOAP using the OAuth access token as the session ID.
- `ProvisionSalesforceOrg` assesses the org, validates API access, builds the package, and starts deployment.
- `MonitorSalesforceDeployment` polls asynchronously and records success or a sanitized deployment error.

## External Client App

Configure a Salesforce External Client App with the callback URL:

```text
https://<backend-host>/settings/integrations/salesforce/callback
```

Required OAuth scopes:

```text
api refresh_token
```

Set the server environment:

```dotenv
SALESFORCE_CLIENT_ID=
SALESFORCE_CLIENT_SECRET=
SALESFORCE_LOGIN_URL=https://login.salesforce.com
SALESFORCE_API_VERSION=v66.0
SALESFORCE_SCOPES="api refresh_token"
```

Use `https://test.salesforce.com` for sandbox authorization.

## Metadata deployment safety

Metadata deployment is disabled by default. This keeps local and newly configured environments in validation-only mode.
OAuth success automatically queues `ProvisionSalesforceOrg`; with deployment
disabled it stops after assessment and validation, and with deployment enabled it
continues into the Metadata API installation and monitoring sequence.

Enable it only after validating the External Client App and connected sandbox:

```dotenv
SALESFORCE_METADATA_DEPLOY_ENABLED=true
SALESFORCE_DEPLOYMENT_POLL_SECONDS=10
SALESFORCE_DEPLOYMENT_MAX_CHECKS=60
```

Run an integrations queue worker:

```bash
php artisan queue:work --queue=integrations,default --tries=3
```

The package deploys:

- `Authora_Authorization__c`
- `Authora_Evidence__c`
- `Authora_Installation__c`
- authorization external ID, service date, and controlled status fields
- a submission-readiness validation rule
- `Authora_User` permission set
- draft `Authora_Authorization_Readiness` record-triggered flow
- `Authora Health` Lightning application in App Launcher
- Authora Operations App Builder home and authorization record pages
- custom object and Lightning page tabs

The flow is intentionally installed as `Draft`. Customer administrators review and activate automation after validation.

The canonical source project is under `salesforce/` and can also be checked with
Salesforce CLI. See `salesforce/README.md` for sandbox validation commands.

## AI operations boundary

Each tenant can add its own encrypted OpenAI API key under **Intelligence**.
Authora's readiness assistant uses the Responses API with storage disabled and
submits only an operational projection of a case. Patient identity, birth date,
notes, and clinical document content are excluded. Results are advisory and
require human review; the assistant does not determine medical necessity or
claim payer approval.

## Tenant API

All routes require Sanctum authentication and organization context.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/salesforce` | Sanitized connection, assessment, and package plan |
| `POST` | `/api/salesforce/assess` | Live org and API-capacity assessment |
| `POST` | `/api/salesforce/install` | Queue assessment and controlled package installation |
| `GET` | `/api/salesforce/deployment` | Poll current deployment state |

Installation request:

```json
{
  "package_version": "0.2.0",
  "confirm": true
}
```

Only organization administrators can start installation. Access and refresh tokens are never included in API responses, audit context, frontend props, or exception messages.

## Production checklist

1. Use a dedicated production External Client App.
2. Restrict callback URLs and permitted users in Salesforce.
3. Run queue workers under a process supervisor.
4. Confirm application encryption keys are backed up and rotated under an approved procedure.
5. Keep PHI out of integration logs and audit-event context.
6. Validate the package in a customer sandbox before enabling production deployment.
7. Monitor Salesforce daily API limits and deployment failures.
