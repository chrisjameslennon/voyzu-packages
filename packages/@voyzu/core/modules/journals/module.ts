
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { JournalsListPage, JournalDetailPage } from "@voyzu/core/journals/server";export const journalsModule = {
  pageRoutes: {
    list: {
          id: "voyzu.journals.page.list",
          pageTitle: "Journal Entries",
          helpPath: "modules-help/company-ledger/journals",
          path: "/finance/journals",
          Page: JournalsListPage,
          breadcrumbBase: [
                { label: "Finance" },
                { label: "Company General Ledger" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detail: {
          id: "voyzu.journals.page.detail",
          pageTitle: "Journal Entry",
          helpPath: "modules-help/company-ledger/journals",
          path: "/finance/journals/[code]",
          Page: JournalDetailPage,
          breadcrumbBase: [
                { label: "Finance" },
                { label: "Company General Ledger" },
                { label: "Journal Entries", href: "/finance/journals" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        }
  },

  apiDefinitions: {},
} as const satisfies VoyzuPackageModuleDefinition;
