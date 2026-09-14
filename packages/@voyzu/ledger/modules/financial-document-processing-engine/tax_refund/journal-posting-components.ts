import { ComponentType } from "../core/journal-posting-components";

export default {
  description: "Tax refunds debit the selected bank or cash account and credit the selected tax control account.",
  formula: "Dr Bank / cash = Cr Tax control account",
  components: {
    dr_bank_cash: {
      title: "Bank / cash",
      side: "DR",
      type: ComponentType.BANK_CASH,
      ledger: "BANK_CASH",
      control_account: "BANK_OPERATING",
      posting_code: "BANK_CASH_ACCOUNT",
    },
    cr_tax_control_account: {
      title: "Tax control account",
      side: "CR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "TAX",
      code: "TAX_ON_PURCHASES",
    },
  },
} as const;
