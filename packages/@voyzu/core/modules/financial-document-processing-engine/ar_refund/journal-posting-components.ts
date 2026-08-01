import { ComponentType } from "../core/journal-posting-components";

export default {
  description: "Customer refunds reduce unapplied customer cash and credit the selected bank or cash account.",
  formula: "Dr Unapplied cash = Cr Bank / cash",
  components: {
    dr_unapplied_cash: {
      title: "Unapplied cash",
      side: "DR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "ACCOUNTS_RECEIVABLE",
      code: "AR_UNAPPLIED_CASH",
    },
    cr_bank_cash: {
      title: "Bank / cash",
      side: "CR",
      type: ComponentType.BANK_CASH,
      ledger: "BANK_CASH",
      control_account: "BANK_OPERATING",
      posting_code: "BANK_CASH_ACCOUNT",
    },
  },
} as const;
