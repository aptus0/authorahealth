# ADR 001: Begin with a modular monolith

Status: Accepted

Authora Health will begin as a single deployable Laravel application with explicit domain boundaries.

This keeps transactions, testing, deployments, and HIPAA controls understandable while the product workflow is still evolving. It avoids premature distributed-system complexity. Document processing, integrations, and AI orchestration can be extracted later because they are asynchronous boundaries.
