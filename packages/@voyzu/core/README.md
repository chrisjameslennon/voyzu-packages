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
declares database objects under `install/db/objects` and reference/default seeds
under `install/db/seed` in their required execution order. Both phases are
repeatable; package installation executes the object phase first and the seed
phase second. Core relies on the preinstalled Voyzu Audit package for shared
audit infrastructure.

## Public API

The package exports its definition as `@voyzu/core/voyzu-package`. Module, client,
server and type entry points intended for peer packages are declared explicitly
in `package.json`. Consumers must use those exports rather than private source
paths.

Core exports its optional sample-data installer as `@voyzu/core/scripts/sample-data`
and exposes it through the `sampleData` package script:

```shell
npm run voyzu:run-script -- @voyzu/core sampleData
```

For disposable development databases, Core also exposes a destructive reset
script which drops and recreates every Core-owned table before restoring Core
seed data:

```shell
npm run voyzu:run-script -- @voyzu/core purgeAndRecreate
```

This command must not be run against a database containing data that needs to
be retained.

## Documentation

Package documentation belongs under `docs`. Public-facing and online-help
source begins at [`docs/public/README.md`](docs/public/README.md).

Core implementation patterns intended for Core maintainers rather than public
online help belong under [`docs/patterns`](docs/patterns). See the
[company-switcher pattern](docs/patterns/company-switcher.md).
