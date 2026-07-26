import { ComponentType } from "../core/journal-posting-components";

export const INVENTORY_RECEIPT_JOURNAL_POSTING_COMPONENTS = {
  description: "Inventory receipts increase inventory control and offset to the item's posting profile adjustment gain code.",
  formula: "Dr Inventory Control = Cr Item Posting Profile.adjustment_gain_code",
  components: {
    dr_inventory_control: {
      title: "Inventory control",
      side: "DR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "INVENTORY",
      code: "INVENTORY_CONTROL",
    },
    cr_adjustment_gain: {
      title: "Adjustment gain",
      side: "CR",
      type: ComponentType.ITEM_POSTING_PROFILE_CODE,
      code: "adjustment_gain_code",
    },
  },
} as const;

export const INVENTORY_RECEIPT_CONTROL_COMPONENT = INVENTORY_RECEIPT_JOURNAL_POSTING_COMPONENTS.components.dr_inventory_control;
export const INVENTORY_RECEIPT_ADJUSTMENT_GAIN_COMPONENT = INVENTORY_RECEIPT_JOURNAL_POSTING_COMPONENTS.components.cr_adjustment_gain;

export default INVENTORY_RECEIPT_JOURNAL_POSTING_COMPONENTS;
