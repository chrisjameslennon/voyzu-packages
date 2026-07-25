import { ComponentType } from "../core/journal-posting-components";
import type { AccountType } from "@voyzu/types/modules";

export default {
  description: "AR opening balances debit the AR control account and credit opening balance equity.",
  formula: "Dr AR receivable = Cr Opening balance equity",
  components: {
    dr_ar_receivable: {
      title: "Accounts receivable",
      side: "DR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "ACCOUNTS_RECEIVABLE",
      code: "AR_TRADE_RECEIVABLES",
    },
    cr_opening_balance_equity: {
      title: "Opening balance equity",
      side: "CR",
      type: ComponentType.POSTING_CODE,
      code: "OPENING_BALANCE_EQUITY_ACCOUNT",
      allowedAccountTypes: ["EQUITY"] satisfies readonly AccountType[],
    },
  },
} as const;
