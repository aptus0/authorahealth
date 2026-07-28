# Authora Health Architecture

## Product boundary

Authora Health is a multi-tenant prior authorization operations platform for US specialty-care providers. The first product boundary covers intake, documentation readiness, submission tracking, payer decisions, appeals, and operational analytics.

## Architecture style

The application begins as a modular monolith. Each domain owns its application services, policies, data access, events, and tests. Integrations, document processing, and AI workloads may be extracted into independent services when volume requires it.

## Domain modules

- Identity and tenancy
- Organizations and locations
- Patients and insurance coverage
- Providers and payers
- Authorization cases
- Requirements and rules
- Documents
- Tasks and workflows
- Submissions and payer decisions
- Appeals
- Notifications
- Integrations
- Analytics and audit

## Runtime

- Laravel 13 / PHP 8.4 domain API
- Next.js, React, TypeScript, and Motion web application
- PostgreSQL in production; SQLite for local bootstrap
- Redis for cache, sessions, and queues in production
- S3-compatible encrypted object storage for documents
- Queue workers for notifications, imports, document processing, and integrations

## Security invariants

- Every protected business record belongs to an organization.
- Tenant context is established from the authenticated user, never from client input alone.
- Queries must be tenant-scoped and protected by authorization policies.
- PHI must not be written to application logs, analytics payloads, or exception trackers.
- Sensitive changes produce immutable audit events.
- AI outputs are advisory, source-linked, versioned, and require human approval before external submission.

## Delivery evolution

1. Core workflow and secure tenancy
2. Rules engine and operational queues
3. Appeal workflow and human-reviewed AI assistance
4. Salesforce, EHR/FHIR, fax, and payer integrations
5. Claims outcome and revenue intelligence

## Product operating loop

Authora uses one accountable operating loop for every authorization:

1. **Intake** — accept cases from Salesforce, secure web forms, APIs, and later FHIR-enabled EHR connections.
2. **Normalize** — map patient, coverage, provider, procedure, diagnosis, and document evidence into a tenant-scoped case.
3. **Assess** — evaluate documentation readiness and payer-specific requirements without making autonomous clinical decisions.
4. **Coordinate** — assign work, collect missing evidence, submit through approved channels, and record every handoff.
5. **Decide and appeal** — capture payer responses, deadlines, denial reasons, and human-approved appeal packages.
6. **Learn** — measure operational outcomes and version rules while preserving source evidence and audit history.

This is the healthcare analogue of a vertical underwriting platform: Authora owns the prior-authorization workflow, not the clinical decision. Every automated recommendation must remain explainable and reviewable.

## Salesforce integration

Authora is the system of workflow for prior authorization, while Salesforce remains the customer relationship and service platform. Each Authora organization may connect one Salesforce org through an OAuth 2.0 External Client App.

- Authorization Code flow is used for an administrator-approved connection.
- Access and refresh tokens are encrypted by the application key before persistence.
- The Salesforce instance URL returned by OAuth is used dynamically.
- API calls retry transient failures and refresh once after an unauthorized response.
- Health checks call the versioned REST `limits` resource.
- Synchronization runs asynchronously and must be idempotent.
- Salesforce IDs are external references, never tenant identifiers.
- Only minimum required scopes (`api`, `refresh_token`) are requested.

Production uses a dedicated packaged External Client App, refresh-token rotation, permission-set preauthorization, and separate client apps for development and production.
