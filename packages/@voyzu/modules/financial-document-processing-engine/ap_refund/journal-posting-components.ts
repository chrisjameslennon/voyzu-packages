import { ComponentType } from "../core/journal-posting-components";

export default {
  description: "Supplier refunds debit the selected bank or cash account and credit unapplied supplier payments.",
  formula: "Dr Bank / cash = Cr Unapplied payments",
  components: {
    dr_bank_cash: {
      title: "Bank / cash",
      side: "DR",
      type: ComponentType.BANK_CASH,
      ledger: "BANK_CASH",
      control_account: "BANK_OPERATING",
      posting_code: "BANK_CASH_ACCOUNT",
    },
    cr_unapplied_payments: {
      title: "Unapplied supplier payments",
      side: "CR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "ACCOUNTS_PAYABLE",
      code: "AP_UNAPPLIED_PAYMENTS",
    },
  },
} as const;
