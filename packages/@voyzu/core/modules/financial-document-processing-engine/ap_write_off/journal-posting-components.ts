import { ComponentType } from "../core/journal-posting-components";
import type { AccountType } from "@voyzu/core/types/modules/core";

export default {
  description: "Payable write-offs debit AP trade payables and credit write-off income.",
  formula: "Dr AP payable = Cr Write-off income",
  components: {
    dr_ap_payable: {
      title: "Accounts payable",
      side: "DR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "ACCOUNTS_PAYABLE",
      code: "AP_TRADE_PAYABLES",
    },
    cr_write_off_income: {
      title: "Write-off income",
      side: "CR",
      type: ComponentType.POSTING_CODE,
      code: "SUPPLIER_WRITE_OFF_INCOME_ACCOUNT",
      allowedAccountTypes: ["REVENUE"] satisfies readonly AccountType[],
    },
  },
} as const;
