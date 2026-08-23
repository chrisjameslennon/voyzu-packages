import { ComponentType } from "../core/journal-posting-components";
import type { AccountType } from "@voyzu/finance/types/modules/core";

export default {
  description: "Receivable write-offs debit a write-off expense account and credit the AR control account.",
  formula: "Dr Write-off expense = Cr AR receivable",
  components: {
    dr_write_off_expense: {
      title: "Write-off expense",
      side: "DR",
      type: ComponentType.POSTING_CODE,
      code: "CUSTOMER_WRITE_OFF_EXPENSE_ACCOUNT",
      allowedAccountTypes: ["EXPENSE"] satisfies readonly AccountType[],
    },
    cr_ar_receivable: {
      title: "Accounts receivable",
      side: "CR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "ACCOUNTS_RECEIVABLE",
      code: "AR_TRADE_RECEIVABLES",
    },
  },
} as const;
