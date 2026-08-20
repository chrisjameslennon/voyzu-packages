import { handleGetArCounterparty, handleListArCounterparties } from "@voyzu/core/ar-subledger-counterparties/server";
import { ArCounterpartiesListPage, ArCounterpartyDetailPage } from "@voyzu/core/ar-subledger-counterparties/server";

export const pageRoutes = {
  list: {
    id: "voyzu.ar-subledger-counterparties.page.list",
    pageTitle: "AR Counterparties",
    helpPath: "modules-help/company-ledger/ar-counterparties",
    path: "/finance/subledgers/ar/counterparties",
    Page: ArCounterpartiesListPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AR Subledger" },
    ],
    auth: { required: true, minRole: "COMPANY_USER" }
  },
  detail: {
    id: "voyzu.ar-subledger-counterparties.page.detail",
    pageTitle: "AR Counterparty",
    helpPath: "modules-help/company-ledger/ar-counterparties",
    path: "/finance/subledgers/ar/counterparties/[code]",
    Page: ArCounterpartyDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AR Counterparties", href: "/finance/subledgers/ar/counterparties" },
    ],
    auth: { required: true, minRole: "COMPANY_USER" }
  },
  detailPrintable: {
    id: "voyzu.ar-subledger-counterparties.page.detail.printable",
    pageTitle: "AR Counterparty",
    path: "/finance/subledgers/ar/counterparties/[code]/printable",
    Page: ArCounterpartyDetailPage,
    unframed: true,
    auth: { required: true, minRole: "COMPANY_USER" }
  }
} as const;
