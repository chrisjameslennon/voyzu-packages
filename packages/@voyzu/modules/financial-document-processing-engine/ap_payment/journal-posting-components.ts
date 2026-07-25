import { ComponentType } from "../core/journal-posting-components";

export default {
  description: "Supplier payments debit AP control accounts and credit the selected bank or cash account.",
  formula: "Dr AP payable + Dr Unapplied payments = Cr Bank / cash",
  components: {
    dr_ap_payable: {
      title: "Accounts payable",
      side: "DR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "ACCOUNTS_PAYABLE",
      code: "AP_TRADE_PAYABLES",
    },
    dr_unapplied_payments: {
      title: "Unapplied supplier payments",
      side: "DR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "ACCOUNTS_PAYABLE",
      code: "AP_UNAPPLIED_PAYMENTS",
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
