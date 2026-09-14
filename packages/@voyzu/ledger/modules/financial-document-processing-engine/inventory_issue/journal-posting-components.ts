import { ComponentType } from "../core/journal-posting-components";

export const INVENTORY_ISSUE_JOURNAL_POSTING_COMPONENTS = {
  description: "Inventory issues reduce inventory control using the GL account code supplied on each line.",
  formula: "Dr GL code supplied = Cr Inventory Control",
  components: {
    dr_offset_gl_account: {
      title: "GL code supplied",
      side: "DR",
      type: ComponentType.DIRECT_GL,
      code: "gl_account_code",
    },
    cr_inventory_control: {
      title: "Inventory control",
      side: "CR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "INVENTORY",
      code: "INVENTORY_CONTROL",
    },
  },
} as const;

export const INVENTORY_ISSUE_OFFSET_COMPONENT = INVENTORY_ISSUE_JOURNAL_POSTING_COMPONENTS.components.dr_offset_gl_account;
export const INVENTORY_ISSUE_CONTROL_COMPONENT = INVENTORY_ISSUE_JOURNAL_POSTING_COMPONENTS.components.cr_inventory_control;

export default INVENTORY_ISSUE_JOURNAL_POSTING_COMPONENTS;
