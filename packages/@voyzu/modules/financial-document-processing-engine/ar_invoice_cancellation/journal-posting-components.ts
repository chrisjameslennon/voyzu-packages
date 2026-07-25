import { ComponentType } from "../core/journal-posting-components";

export default {
  is_cancellation: true,
  description: "Invoice withdrawals reverse the receivable, revenue, and output tax postings from the source invoice.",
  formula: "Dr Revenue + Dr Tax output = Cr AR receivable",
  components: {
    dr_revenue: {
      title: "Revenue",
      side: "DR",
      type: ComponentType.SOURCE_DOCUMENT,
      code: "SOURCE_INVOICE_REVENUE",
    },
    dr_tax_output: {
      title: "Tax output",
      side: "DR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "TAX",
      code: "TAX_ON_SALES",
    },
    cr_ar_receivable: {
      title: "Accounts receivable",
      side: "CR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "ACCOUNTS_RECEIVABLE",
      code: "AR_TRADE_RECEIVABLES",
    },
  },
} as const;
