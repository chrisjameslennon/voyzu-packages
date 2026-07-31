export const journalsModule = {
  pageRoutes: {
    list: {
      id: "voyzu.journals.page.list",
      pageTitle: "Journal Entries",
      helpUrl: "modules-help/company-ledger/journals",
    },
    detail: {
      id: "voyzu.journals.page.detail",
      pageTitle: "Journal Entry",
      helpUrl: "modules-help/company-ledger/journals",
    },
  },
} as const;
