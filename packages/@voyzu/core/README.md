# Voyzu Core

`@voyzu/core` provides Voyzu's standard organization and finance functionality.
It is a normal Voyzu package and conforms to the same package and module contracts
as third-party packages.

## Domains

The package contributes two application domains:

- Organization, for organization-wide configuration, companies, localization,
  standard settings, audit access and organization reports.
- Finance, for company accounting, inventory, subledgers, tax, journals, audit
  access and financial reports.

The domains and their independent left-navigation definitions are exported from
`@voyzu/core/navigation/domains`.

## Installation

Install Core through the standard Voyzu package workflow. Its package definition
declares the schema, tables and triggers in their required execution order. The
SQL is repeatable and relies on the preinstalled Voyzu Audit package for shared
audit infrastructure.

## Public API

The package exports its definition as `@voyzu/core/voyzu-package`. Module, client,
server and type entry points intended for peer packages are declared explicitly
in `package.json`. Consumers must use those exports rather than private source
paths.

Core currently exposes no callable package scripts.
