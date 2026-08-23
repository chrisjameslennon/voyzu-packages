import { ComponentType } from "../core/journal-posting-components";
import type { AccountType } from "@voyzu/finance/types/modules/core";

export default {
  description: "Customer credit notes debit revenue and tax output accounts and credit AR control accounts.",
  formula: "Dr Revenue + Dr Tax output = Cr AR receivable / unapplied cash",
  components: {
    dr_revenue: {
      title: "Revenue",
      side: "DR",
      type: ComponentType.POSTING_CODE,
      code: "REVENUE_REVERSAL_ACCOUNT",
      allowedAccountTypes: ["REVENUE"] satisfies readonly AccountType[],
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
    cr_unapplied_cash: {
      title: "Unapplied cash",
      side: "CR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "ACCOUNTS_RECEIVABLE",
      code: "AR_UNAPPLIED_CASH",
    },
  },
} as const;
