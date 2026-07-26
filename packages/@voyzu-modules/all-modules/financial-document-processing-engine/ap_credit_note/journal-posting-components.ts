import { ComponentType } from "../core/journal-posting-components";
import type { AccountType } from "@voyzu/types/modules";

export default {
  description: "Supplier credit notes debit AP control accounts and credit purchase, expense, asset, and recoverable tax accounts.",
  formula: "Dr AP payable / unapplied payments = Cr Purchase / expense + Cr Tax on purchases",
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
    cr_purchase: {
      title: "Purchase / expense",
      side: "CR",
      type: ComponentType.POSTING_CODE,
      code: "PURCHASE_REVERSAL_ACCOUNT",
      allowedAccountTypes: ["EXPENSE", "ASSET"] satisfies readonly AccountType[],
    },
    cr_tax_on_purchases: {
      title: "Tax on purchases",
      side: "CR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "TAX",
      code: "TAX_ON_PURCHASES",
    },
  },
} as const;
