import { handleGetApCounterparty, handleListApCounterparties } from "@voyzu/core/ap-subledger-counterparties/server";
import { ApCounterpartiesListPage, ApCounterpartyDetailPage } from "@voyzu/core/ap-subledger-counterparties/server";

export const pageRoutes = {
  list: {
    id: "voyzu.ap-subledger-counterparties.page.list",
    pageTitle: "AP Counterparties",
    helpPath: "modules-help/company-ledger/ap-counterparties",
    path: "/finance/subledgers/ap/counterparties",
    Page: ApCounterpartiesListPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AP Subledger" },
    ],
    auth: { required: true, minRole: "COMPANY_USER" }
  },
  detail: {
    id: "voyzu.ap-subledger-counterparties.page.detail",
    pageTitle: "AP Counterparty",
    helpPath: "modules-help/company-ledger/ap-counterparties",
    path: "/finance/subledgers/ap/counterparties/[code]",
    Page: ApCounterpartyDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AP Counterparties", href: "/finance/subledgers/ap/counterparties" },
    ],
    auth: { required: true, minRole: "COMPANY_USER" }
  },
  detailPrintable: {
    id: "voyzu.ap-subledger-counterparties.page.detail.printable",
    pageTitle: "AP Counterparty",
    path: "/finance/subledgers/ap/counterparties/[code]/printable",
    Page: ApCounterpartyDetailPage,
    unframed: true,
    auth: { required: true, minRole: "COMPANY_USER" }
  }
} as const;
