import { ComponentType } from "../core/journal-posting-components";

export const INVENTORY_ADJUSTMENT_JOURNAL_POSTING_COMPONENTS = {
  description: "Inventory adjustments change inventory control using the GL account code supplied on each line.",
  formula: "Positive: Dr Inventory Control = Cr GL code supplied; Negative: Dr GL code supplied = Cr Inventory Control",
  components: {
    inventory_control: {
      title: "Inventory control",
      side: "DR/CR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "INVENTORY",
      code: "INVENTORY_CONTROL",
    },
    offset_gl_account: {
      title: "GL code supplied",
      side: "DR/CR",
      type: ComponentType.DIRECT_GL,
      code: "gl_account_code",
    },
  },
} as const;

export const INVENTORY_ADJUSTMENT_CONTROL_COMPONENT = INVENTORY_ADJUSTMENT_JOURNAL_POSTING_COMPONENTS.components.inventory_control;
export const INVENTORY_ADJUSTMENT_OFFSET_COMPONENT = INVENTORY_ADJUSTMENT_JOURNAL_POSTING_COMPONENTS.components.offset_gl_account;

export default INVENTORY_ADJUSTMENT_JOURNAL_POSTING_COMPONENTS;
