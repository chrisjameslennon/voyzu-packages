export const journalsModule = {
  pageRoutes: {
    list: {
      id: "voyzu.journals.page.list",
      pageTitle: "Journal Entries",
      helpPath: "modules-help/company-ledger/journals",
    },
    detail: {
      id: "voyzu.journals.page.detail",
      pageTitle: "Journal Entry",
      helpPath: "modules-help/company-ledger/journals",
    },
  },
} as const;
