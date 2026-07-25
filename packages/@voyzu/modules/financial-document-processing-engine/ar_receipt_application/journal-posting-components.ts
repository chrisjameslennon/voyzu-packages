import { ComponentType } from "../core/journal-posting-components";

export default {
  description: "Receipt applications reclassify unapplied customer cash against open AR receivables.",
  formula: "Dr Unapplied cash = Cr AR receivable",
  components: {
    dr_unapplied_cash: {
      title: "Unapplied cash",
      side: "DR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "ACCOUNTS_RECEIVABLE",
      code: "AR_UNAPPLIED_CASH",
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
