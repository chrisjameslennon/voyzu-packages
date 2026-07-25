import { ComponentType } from "../core/journal-posting-components";

export const INVENTORY_ISSUE_JOURNAL_POSTING_COMPONENTS = {
  description: "Inventory issues reduce inventory control and offset to COGS or consumption based on issue purpose.",
  formula: "Dr Item Posting Profile.cogs_code / consumption_code = Cr Inventory Control",
  components: {
    dr_cogs: {
      title: "Cost of goods sold",
      side: "DR",
      type: ComponentType.ITEM_POSTING_PROFILE_CODE,
      code: "cogs_code",
    },
    dr_consumption: {
      title: "Consumption",
      side: "DR",
      type: ComponentType.ITEM_POSTING_PROFILE_CODE,
      code: "consumption_code",
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

export const INVENTORY_ISSUE_COGS_COMPONENT = INVENTORY_ISSUE_JOURNAL_POSTING_COMPONENTS.components.dr_cogs;
export const INVENTORY_ISSUE_CONSUMPTION_COMPONENT = INVENTORY_ISSUE_JOURNAL_POSTING_COMPONENTS.components.dr_consumption;
export const INVENTORY_ISSUE_CONTROL_COMPONENT = INVENTORY_ISSUE_JOURNAL_POSTING_COMPONENTS.components.cr_inventory_control;

export default INVENTORY_ISSUE_JOURNAL_POSTING_COMPONENTS;
