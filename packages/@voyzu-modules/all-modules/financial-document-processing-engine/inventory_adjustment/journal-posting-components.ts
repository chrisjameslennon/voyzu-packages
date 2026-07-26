import { ComponentType } from "../core/journal-posting-components";

export const INVENTORY_ADJUSTMENT_JOURNAL_POSTING_COMPONENTS = {
  description: "Inventory adjustments change inventory control and offset gains or losses through the item's posting profile.",
  formula: "Positive: Dr Inventory Control = Cr Item Posting Profile.adjustment_gain_code; Negative: Dr Item Posting Profile.adjustment_loss_code = Cr Inventory Control",
  components: {
    inventory_control: {
      title: "Inventory control",
      side: "DR/CR",
      type: ComponentType.CONTROL_ACCOUNT,
      ledger: "INVENTORY",
      code: "INVENTORY_CONTROL",
    },
    adjustment_gain: {
      title: "Adjustment gain",
      side: "CR",
      type: ComponentType.ITEM_POSTING_PROFILE_CODE,
      code: "adjustment_gain_code",
    },
    adjustment_loss: {
      title: "Adjustment loss",
      side: "DR",
      type: ComponentType.ITEM_POSTING_PROFILE_CODE,
      code: "adjustment_loss_code",
    },
  },
} as const;

export const INVENTORY_ADJUSTMENT_CONTROL_COMPONENT = INVENTORY_ADJUSTMENT_JOURNAL_POSTING_COMPONENTS.components.inventory_control;
export const INVENTORY_ADJUSTMENT_GAIN_COMPONENT = INVENTORY_ADJUSTMENT_JOURNAL_POSTING_COMPONENTS.components.adjustment_gain;
export const INVENTORY_ADJUSTMENT_LOSS_COMPONENT = INVENTORY_ADJUSTMENT_JOURNAL_POSTING_COMPONENTS.components.adjustment_loss;

export default INVENTORY_ADJUSTMENT_JOURNAL_POSTING_COMPONENTS;
