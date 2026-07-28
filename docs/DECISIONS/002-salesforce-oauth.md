# ADR 002: Salesforce OAuth and synchronization boundary

Status: Accepted

Authora connects to customer Salesforce organizations through an External Client App using the OAuth 2.0 authorization-code flow. The callback URL is `/settings/integrations/salesforce/callback`.

Tokens are server-side only and stored with Laravel encrypted casts. The dynamic `instance_url` returned by Salesforce is authoritative for API calls. A refresh token is required for background synchronization.

Initial synchronization is deliberately narrow: organization/account references, case status, tasks, ownership, and document references. Clinical files and PHI are not copied into Salesforce by default. Every mapping and synchronization operation must carry both the Authora organization ID and Salesforce org ID, be idempotent, and create an audit event.
