import { ComponentType } from "../core/journal-posting-components";
import type { AccountType } from "@voyzu/types/modules";

export default {
  hide_components: true,
  description: "Tax adjustments post one side to the selected tax control account and the other side to the configured adjustment offset account.",
  formula: "Dr / Cr Tax adjustment offset = Dr / Cr Tax control account",
  components: {
    tax_adjustment_offset: {
      title: "Tax adjustment offset",
      side: "DR/CR",
      type: ComponentType.POSTING_CODE,
      code: "TAX_ADJUSTMENT_OFFSET_ACCOUNT",
      allowedAccountTypes: ["EXPENSE"] satisfies readonly AccountType[],
    },
    tax_control_account: {
      title: "Tax control account",
      side: "DR/CR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "TAX",
      // actual code is determined by direction
    },
  },
} as const;
