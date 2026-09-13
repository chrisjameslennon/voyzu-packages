# Financial entity initialization

`initialize-financial-entity.sql` is the single source of per-entity defaults:
GL categories/accounts, control mappings, inventory processing rules, posting
profiles, dimensions/values, document defaults and fiscal calendar.

The Finance install manifest registers its database routine after table creation.
Package-wide country/tax/document definitions remain in `install/db/seed`.
After those definitions are installed, `finance-organization.seed.sql` invokes the
routine only for newly inserted financial entities. Existing entities are skipped.

Application provisioning calls the same routine through
`FinancialEntityInitializationRepo`, with the actual financial entity ID and
current audit stamp. Creation and initialization share the caller's transaction,
including the ERP organization creation transaction. A failure rolls everything
back. All creation/activation entry points use the same provisioning service.

The repository distinguishes newly inserted entities from existing entities.
Reactivation/repeated creation therefore never restores defaults over user choices.
The SQL also uses insert-only conflict handling to avoid overwriting settings on
an explicit retry. There is no template entity, inheritance, backfill or sample data.

When changing the SQL defaults, deploy the routine through Finance installation
(or apply this routine definition alone to a development database). Compose and
file watching do not install database objects. Updating the routine does not
modify existing entity data.
