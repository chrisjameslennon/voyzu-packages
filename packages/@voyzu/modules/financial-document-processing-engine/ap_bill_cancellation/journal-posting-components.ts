import { ComponentType } from "../core/journal-posting-components";

export default {
  is_cancellation: true,
  description: "Bill withdrawals reverse the AP payable, purchase, and recoverable tax postings from the source bill.",
  formula: "Dr AP payable = Cr Purchase / expense + Cr Tax on purchases",
  components: {
    dr_ap_payable: {
      title: "Accounts payable",
      side: "DR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "ACCOUNTS_PAYABLE",
      code: "AP_TRADE_PAYABLES",
    },
    cr_purchase: {
      title: "Purchase / expense",
      side: "CR",
      type: ComponentType.SOURCE_DOCUMENT,
      code: "SOURCE_BILL_PURCHASE",
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
