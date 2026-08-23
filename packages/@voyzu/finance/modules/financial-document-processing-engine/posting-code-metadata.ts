import type { AccountType } from "@voyzu/finance/types/modules/core";

import apBill from "./ap_bill/journal-posting-components";
import apCreditNote from "./ap_credit_note/journal-posting-components";
import apOpeningBalance from "./ap_opening_balance/journal-posting-components";
import apWriteOff from "./ap_write_off/journal-posting-components";
import arCreditNote from "./ar_credit_note/journal-posting-components";
import arInvoice from "./ar_invoice/journal-posting-components";
import arOpeningBalance from "./ar_opening_balance/journal-posting-components";
import arWriteOff from "./ar_write_off/journal-posting-components";
import taxAdjustment from "./tax_adjustment/journal-posting-components";
import { ComponentType } from "./core/journal-posting-components";

interface PostingCodeComponent {
  type: ComponentType.POSTING_CODE;
  code: string;
  allowedAccountTypes: readonly AccountType[];
}

const COMPONENTS_BY_DOCUMENT = {
  AP_BILL: apBill.components,
  AP_CREDIT_NOTE: apCreditNote.components,
  AP_OPENING_BALANCE: apOpeningBalance.components,
  AP_WRITE_OFF: apWriteOff.components,
  AR_CREDIT_NOTE: arCreditNote.components,
  AR_INVOICE: arInvoice.components,
  AR_OPENING_BALANCE: arOpeningBalance.components,
  AR_WRITE_OFF: arWriteOff.components,
  TAX_ADJUSTMENT: taxAdjustment.components,
} as const;

export function getPostingCodeAllowedAccountTypes(documentCode: string, postingCode: string): readonly AccountType[] {
  const components = COMPONENTS_BY_DOCUMENT[documentCode as keyof typeof COMPONENTS_BY_DOCUMENT];
  if (!components) throw new Error(`No posting component metadata is registered for ${documentCode}`);

  const component = Object.values(components).find((candidate) => (
    candidate.type === ComponentType.POSTING_CODE && "code" in candidate && candidate.code === postingCode
  )) as PostingCodeComponent | undefined;

  if (!component) throw new Error(`No posting code metadata is registered for ${documentCode}/${postingCode}`);
  if (component.allowedAccountTypes.length === 0) throw new Error(`Posting code ${documentCode}/${postingCode} has no allowed account types`);
  return component.allowedAccountTypes;
}
