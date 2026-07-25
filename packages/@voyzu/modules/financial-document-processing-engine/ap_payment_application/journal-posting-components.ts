import { ComponentType } from "../core/journal-posting-components";

export default {
  description: "Supplier payment applications reclassify unapplied supplier payments against open AP payables.",
  formula: "Dr AP payable = Cr Unapplied payments",
  components: {
    dr_ap_payable: {
      title: "Accounts payable",
      side: "DR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "ACCOUNTS_PAYABLE",
      code: "AP_TRADE_PAYABLES",
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
