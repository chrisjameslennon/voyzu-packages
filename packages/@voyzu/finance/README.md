# Voyzu Finance

`@voyzu/finance` provides Voyzu's finance, inventory, tax, and reporting capabilities. [Read the Voyzu Finance introduction](https://voyzu.gitbook.io/docs/voyzu-core-concepts/introduction).

## Module ownership

Business modules own their routes, pages, services, repositories and `types` folders. AP and AR control-account pages share the `control-accounts` module. Report-specific types live beside their report under `reports`.

`common` contains only shared helpers, primitives and components—not business modules. Repository row types stay beside their repositories. Financial-entity scope and access helpers belong to `finance-companies`; financial-period types belong to `financial-years`.

There is no package-level `types` folder or template/company module split. Internal imports use module-owned source files; moving a definition does not change its API route or database identity.
