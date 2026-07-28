# Authora Health Product Blueprint

## Category

Authora Health is the prior authorization operating system for US specialty-care providers. It combines workflow automation, Salesforce-native deployment, payer requirement intelligence, evidence readiness, and accountable human review in one multi-tenant SaaS platform.

## Strategic wedge

The first market is specialty-care provider organizations with high-cost therapies and procedures, fragmented authorization teams, and an existing Salesforce footprint. The initial workflow is intentionally narrow:

> Turn an incomplete authorization request into a traceable, submission-ready case, then coordinate the payer decision and appeal.

Authora does not replace the EHR, Salesforce, or payer portals. It becomes the control plane connecting them.

## Core product surfaces

### 1. Authora Intake

- Secure case creation from the web application and API
- Salesforce case and patient-context ingestion
- Document upload with evidence classification
- FHIR-based clinical context ingestion in a later integration phase
- Duplicate and missing-data detection

### 2. Authora Readiness

- Payer and procedure requirement checklists
- Source-linked evidence matrix
- Missing-document and inconsistency flags
- Human-reviewed readiness state
- Versioned rules with effective dates

### 3. Authora Flow

- Role-based work queues
- Deadlines, ownership, escalations, and service-level timers
- Submission and follow-up timeline
- Decision and denial-reason capture
- Appeal preparation and approval

### 4. Authora Salesforce

- OAuth-based organization connection
- Org capability and metadata discovery
- Admin-approved transactional metadata deployment
- Custom objects, fields, validation rules, permission sets, and Flows
- Idempotent synchronization and deployment audit history

### 5. Authora Intelligence

- Advisory document extraction and case summarization
- Evidence-linked recommendations
- Rule-drift and workflow-bottleneck detection
- Operational analytics without fabricated or unverified clinical claims
- Mandatory human approval before an external submission

## Onboarding journey

1. An organization administrator creates an Authora workspace.
2. The administrator connects a Salesforce org with OAuth.
3. Authora scans supported capabilities and presents an installation plan.
4. The administrator reviews requested metadata and permissions.
5. Authora deploys the versioned package transactionally and verifies it.
6. The organization maps teams, queues, locations, and payer workflows.
7. A guided sample case validates the operating loop.
8. The user enters the dashboard with installation health and next actions visible.

## Architectural boundaries

- Authora is the workflow and evidence system of record.
- Salesforce is the CRM and service context.
- The EHR remains the clinical system of record.
- Payer portals and APIs remain external decision channels.
- PHI is minimized, encrypted, tenant-scoped, and excluded from telemetry.
- AI is advisory; it does not make autonomous medical-necessity decisions.

## Delivery sequence

### Foundation

- Identity, tenancy, subscriptions, audit, and secure sessions
- Salesforce OAuth and connection health
- Core case, patient, payer, and authorization data model
- Professional web application and guided onboarding

### Operational MVP

- Intake API and case workspace
- Evidence checklist and readiness rules
- Work queue, deadlines, activities, and status transitions
- Salesforce package deployment worker and progress UI
- Admin, reviewer, and operator roles

### Integration release

- Document processing pipeline
- Payer rule catalog and versioning
- Salesforce bidirectional synchronization
- Submission-channel adapters
- FHIR connectivity for selected EHR workflows

### Intelligence release

- Source-linked document extraction
- Human-reviewed case summaries and appeal drafts
- Denial pattern analysis
- Operational forecasting and rule-drift monitoring

## Success measures

Metrics must be measured from real customer workflow events:

- Time from intake to submission-ready
- Percentage of cases complete on first review
- Manual touches per authorization
- Payer response and follow-up latency
- Denial and appeal outcomes by payer and procedure
- Salesforce installation success and synchronization health

No performance claim is published until it is supported by production evidence.
