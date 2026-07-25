import { ComponentType } from "../core/journal-posting-components";

export default {
  description: "Tax payments debit the selected tax control account and credit the selected bank or cash account.",
  formula: "Dr Tax control account = Cr Bank / cash",
  components: {
    dr_tax_control_account: {
      title: "Tax control account",
      side: "DR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "TAX",
      code: "TAX_ON_SALES",
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
