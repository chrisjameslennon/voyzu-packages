import { ComponentType } from "../core/journal-posting-components";

export const INVENTORY_RECEIPT_JOURNAL_POSTING_COMPONENTS = {
  description: "Inventory receipts increase inventory control using the GL account code supplied on each line.",
  formula: "Dr Inventory Control = Cr GL code supplied",
  components: {
    dr_inventory_control: {
      title: "Inventory control",
      side: "DR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "INVENTORY",
      code: "INVENTORY_CONTROL",
    },
    cr_offset_gl_account: {
      title: "GL code supplied",
      side: "CR",
      type: ComponentType.DIRECT_GL,
      code: "gl_account_code",
    },
  },
} as const;

export const INVENTORY_RECEIPT_CONTROL_COMPONENT = INVENTORY_RECEIPT_JOURNAL_POSTING_COMPONENTS.components.dr_inventory_control;
export const INVENTORY_RECEIPT_OFFSET_COMPONENT = INVENTORY_RECEIPT_JOURNAL_POSTING_COMPONENTS.components.cr_offset_gl_account;

export default INVENTORY_RECEIPT_JOURNAL_POSTING_COMPONENTS;
