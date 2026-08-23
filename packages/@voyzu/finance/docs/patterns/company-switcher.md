# Company switcher

This is an internal development pattern for `@voyzu/finance`. The company switcher belongs to Finance rather than the Voyzu platform because company selection is part of the Finance domain.

Authentication identifies the user. Company selection identifies the company whose Finance data the user is currently viewing. Selection is context, not authorization: every Core service and query must still enforce user access and company scope.

## UI integration

Core mounts the shared `CompanySwitcher` through its Finance left-navigation header. Other packages may use the generic navigation support, but they must not add another selector inside individual Finance pages.

After a successful selection change, the switcher calls `router.refresh()` so server components reload in the new company context.

## Endpoints

| Endpoint | Purpose |
| --- | --- |
| `GET /api/company-selection` | Return the user's active selectable companies and effective selection. |
| `PUT /api/company-selection` | Validate and store an active-company selection. |
| `POST /api/company-selection/archived` | Explicitly select an accessible archived company without adding it to the switcher. |

The switcher collection contains active companies only. Admin and organization users can select every active company; company users can select only assigned active companies.

## Selection cookie and fallback

The selected company ID is stored in the HTTP-only `voyzuSelectedCompanyId` cookie for one year. It is server-owned implementation state and must not be read or written directly by client code.

Selection and switcher membership are distinct:

- A selected active company appears in the switcher collection.
- An explicitly selected archived company remains effective but does not appear as an option.
- If the cookie is absent or inaccessible, selection falls back to the first accessible active company.
- If no active company is available and no accessible archived company was explicitly selected, the selected company is `null`.

## Archived companies

Archived companies are entered from the organization company detail page through **Access archived company**. The archived-selection endpoint verifies that the company is archived, belongs to the organization, and is accessible to the current user before storing it in the same selection cookie.

An archived selection remains current until another valid selection replaces it. The trigger may identify the archived company, but the switcher menu continues to offer active companies only.

Archived company data is read-only. UI badges communicate this state, while Core services and financial-document processing enforce it.

## Server-page pattern

Company-scoped server pages resolve the shared Core context before calling services:

```tsx
import { resolveServerCompanyApiContext } from "@voyzu/finance/common/server";
import { listWarehouseItems } from "../lib/warehouse-item.service";

export async function WarehouseItemsListPage() {
  const company = await resolveServerCompanyApiContext();
  const items = await listWarehouseItems(company.companyId);

  return (
    <WarehouseItemsList
      companyCode={company.companyCode}
      initialItems={items}
    />
  );
}
```

Pass the resolved company ID explicitly into the service. Do not make the cookie hidden global state in repositories. Organization-standard settings are separate: resolve their settings scope only after resolving the transactional company.

## Client-request pattern

Finance API routes identify the company by code:

```text
/api/finance/{companyCode}/inventory/items
```

Use the validated shared selection to construct browser URLs:

```ts
import { financeApiUrl } from "@voyzu/finance/common/client";

const response = await fetch(
  await financeApiUrl("/inventory/items"),
);
```

External API clients do not use the UI selection cookie. They supply the company-code segment in the documented Finance API route.

## Enforcement rules

- Resolve company context before loading company-owned data.
- Include `finance_company_id` in reads, writes, joins, and existence checks.
- Never authorize access merely because an ID or code appears in a cookie, URL, body, or query string.
- Return not found or access denied when a record does not belong to the resolved company.
- Keep organization pages independent of the Finance selection.
- Keep archived companies out of switcher options and enforce their read-only state on the server.

## Verification checklist

1. Company users see only assigned active companies.
2. Admin and organization users see every active company.
3. Switching refreshes the page and changes every company-scoped result.
4. Lists, details, mutations, exports, and reports all apply company scope.
5. A record from another company cannot be opened or changed.
6. Archived companies are entered explicitly and never appear as switcher options.
7. Archived selections show read-only state and reject mutations and postings.
8. Selecting an active company replaces an archived selection.
