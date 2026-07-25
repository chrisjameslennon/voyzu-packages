import { ComponentType } from "../core/journal-posting-components";
import type { AccountType } from "@voyzu/types/modules";

export default {
  description: "AP opening balances debit opening balance equity and credit AP trade payables.",
  formula: "Dr Opening balance equity = Cr AP payable",
  components: {
    dr_opening_balance_equity: {
      title: "Opening balance equity",
      side: "DR",
      type: ComponentType.POSTING_CODE,
      code: "OPENING_BALANCE_EQUITY_ACCOUNT",
      allowedAccountTypes: ["EQUITY"] satisfies readonly AccountType[],
    },
    cr_ap_payable: {
      title: "Accounts payable",
      side: "CR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "ACCOUNTS_PAYABLE",
      code: "AP_TRADE_PAYABLES",
    },
  },
} as const;
