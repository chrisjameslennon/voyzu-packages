import type {
  FinancialDocumentTypePostingTemplateCardDto,
  FinancialDocumentTypePostingTemplateDto,
  FinancialDocumentTypePostingTemplateGlAccountDto,
  FinancialDocumentTypePostingTemplateOutputLineDto,
  FinancialDocumentTypePostingTemplateSideDto,
} from "@voyzu/core/types/modules/financial-document-types";
import type { FinancialDocumentDefaultResponseDto } from "@voyzu/core/types/modules/financial-document-defaults";

import { ComponentType } from "../../../../financial-document-processing-engine/core/journal-posting-components";
import apBillPostingComponents from "../../../../financial-document-processing-engine/ap_bill/journal-posting-components";
import apBillCancellationPostingComponents from "../../../../financial-document-processing-engine/ap_bill_cancellation/journal-posting-components";
import apCreditNotePostingComponents from "../../../../financial-document-processing-engine/ap_credit_note/journal-posting-components";
import apOpeningBalancePostingComponents from "../../../../financial-document-processing-engine/ap_opening_balance/journal-posting-components";
import apPaymentPostingComponents from "../../../../financial-document-processing-engine/ap_payment/journal-posting-components";
import apPaymentApplicationPostingComponents from "../../../../financial-document-processing-engine/ap_payment_application/journal-posting-components";
import apRefundPostingComponents from "../../../../financial-document-processing-engine/ap_refund/journal-posting-components";
import apWriteOffPostingComponents from "../../../../financial-document-processing-engine/ap_write_off/journal-posting-components";
import arCreditNotePostingComponents from "../../../../financial-document-processing-engine/ar_credit_note/journal-posting-components";
import arInvoicePostingComponents from "../../../../financial-document-processing-engine/ar_invoice/journal-posting-components";
import arInvoiceCancellationPostingComponents from "../../../../financial-document-processing-engine/ar_invoice_cancellation/journal-posting-components";
import arOpeningBalancePostingComponents from "../../../../financial-document-processing-engine/ar_opening_balance/journal-posting-components";
import arReceiptPostingComponents from "../../../../financial-document-processing-engine/ar_receipt/journal-posting-components";
import arReceiptApplicationPostingComponents from "../../../../financial-document-processing-engine/ar_receipt_application/journal-posting-components";
import arRefundPostingComponents from "../../../../financial-document-processing-engine/ar_refund/journal-posting-components";
import arWriteOffPostingComponents from "../../../../financial-document-processing-engine/ar_write_off/journal-posting-components";
import inventoryAdjustmentPostingComponents from "../../../../financial-document-processing-engine/inventory_adjustment/journal-posting-components";
import inventoryIssuePostingComponents from "../../../../financial-document-processing-engine/inventory_issue/journal-posting-components";
import inventoryReceiptPostingComponents from "../../../../financial-document-processing-engine/inventory_receipt/journal-posting-components";
import ledgerJournalPostingComponents from "../../../../financial-document-processing-engine/ledger_journal/journal-posting-components";
import taxAdjustmentPostingComponents from "../../../../financial-document-processing-engine/tax_adjustment/journal-posting-components";
import taxPaymentPostingComponents from "../../../../financial-document-processing-engine/tax_payment/journal-posting-components";
import taxRefundPostingComponents from "../../../../financial-document-processing-engine/tax_refund/journal-posting-components";
import { getControlAccount } from "../../../control-accounts/server";
import { listInventoryControlAccountSettings } from "../../../inventory-control-accounts/server";
import {
  encodeFinancialDocumentDefaultKey,
  getFinancialDocumentDefault,
} from "../../../financial-document-defaults/server/lib/financial-document-default.service";
import { listTaxControlAccounts } from "../../../tax-control-accounts/server";

type ComponentConfig = {
  title?: string;
  side?: FinancialDocumentTypePostingTemplateSideDto;
  type: ComponentType;
  ledger?: string;
  code?: string;
  control_account?: string;
  posting_code?: string;
};

type OverrideSlotLevel = FinancialDocumentDefaultResponseDto["overrideScope"];

type ResolvedComponent = {
  config: ComponentConfig;
  glAccount: FinancialDocumentTypePostingTemplateGlAccountDto | null;
  postingDefault?: FinancialDocumentDefaultResponseDto | null;
};

const MANAGED_LINKS: Record<string, { label: string; href: string }> = {
  ["ACCOUNTS_RECEIVABLE"]: { label: "Accounts Receivable Control Accounts", href: "/control-accounts/ar" },
  ["ACCOUNTS_PAYABLE"]: { label: "Accounts Payable Control Accounts", href: "/control-accounts/ap" },
  ["TAX"]: { label: "Tax Control Accounts", href: "/control-accounts/tax" },
  ["INVENTORY"]: { label: "Inventory Control Accounts", href: "/control-accounts/inventory" },
  ["BANK_CASH"]: { label: "Bank / Cash Accounts", href: "/bank-cash-accounts" },
};

type PostingComponentsDefinition = {
  is_cancellation?: boolean;
  hide_components?: boolean;
  description: string;
  formula: string;
  components: Record<string, ComponentConfig>;
};

const POSTING_COMPONENTS_BY_DOCUMENT_CODE: Record<string, PostingComponentsDefinition> = {
  AP_BILL: apBillPostingComponents,
  AP_BILL_CANCELLATION: apBillCancellationPostingComponents,
  AP_CREDIT_NOTE: apCreditNotePostingComponents,
  AP_OPENING_BALANCE: apOpeningBalancePostingComponents,
  AP_PAYMENT: apPaymentPostingComponents,
  AP_PAYMENT_APPLICATION: apPaymentApplicationPostingComponents,
  AP_REFUND: apRefundPostingComponents,
  AP_WRITE_OFF: apWriteOffPostingComponents,
  AR_CREDIT_NOTE: arCreditNotePostingComponents,
  AR_INVOICE: arInvoicePostingComponents,
  AR_INVOICE_CANCELLATION: arInvoiceCancellationPostingComponents,
  AR_OPENING_BALANCE: arOpeningBalancePostingComponents,
  AR_RECEIPT: arReceiptPostingComponents,
  AR_RECEIPT_APPLICATION: arReceiptApplicationPostingComponents,
  AR_REFUND: arRefundPostingComponents,
  AR_WRITE_OFF: arWriteOffPostingComponents,
  INVENTORY_ADJUSTMENT: inventoryAdjustmentPostingComponents,
  INVENTORY_ISSUE: inventoryIssuePostingComponents,
  INVENTORY_RECEIPT: inventoryReceiptPostingComponents,
  LEDGER_JOURNAL: ledgerJournalPostingComponents,
  TAX_ADJUSTMENT: taxAdjustmentPostingComponents,
  TAX_PAYMENT: taxPaymentPostingComponents,
  TAX_REFUND: taxRefundPostingComponents,
};

function glAccount(
  code?: string | null,
  name?: string | null,
): FinancialDocumentTypePostingTemplateGlAccountDto | null {
  if (!code || !name) return null;
  return { code, name };
}

function requiredConfigValue(value: string | undefined, key: string, field: string): string {
  if (!value) throw new Error(`Posting component ${key} requires ${field}`);
  return value;
}

async function resolveComponent(
  definition: PostingComponentsDefinition,
  documentCode: string,
  key: string,
  companyId: number,
): Promise<ResolvedComponent> {
  const config = definition.components[key];

  if (config.type === ComponentType.BANK_CASH) {
    const financialDocumentDefault = await getFinancialDocumentDefault(
      documentCode,
      requiredConfigValue(config.posting_code, key, "posting_code"),
      companyId,
    );
    return {
      config,
      glAccount: glAccount(
        financialDocumentDefault?.bankCashControlAccount?.glAccountCode,
        financialDocumentDefault?.bankCashControlAccount?.glAccountName,
      ),
      postingDefault: financialDocumentDefault,
    };
  }

  if (config.type === ComponentType.CONTROL_ACCOUNT && config.ledger === "TAX") {
    if (!config.code) return { config, glAccount: null };
    const taxAccount = (await listTaxControlAccounts(companyId)).find(
      (item) => item.code === config.code,
    );
    return {
      config,
      glAccount: glAccount(taxAccount?.glAccount.code, taxAccount?.glAccount.name),
    };
  }

  if (config.type === ComponentType.CONTROL_ACCOUNT && config.ledger === "INVENTORY") {
    const inventoryAccount = (await listInventoryControlAccountSettings(companyId)).find(
      (item) => item.code === config.code,
    );
    return {
      config,
      glAccount: glAccount(inventoryAccount?.glAccount.code, inventoryAccount?.glAccount.name),
    };
  }

  if (config.type === ComponentType.CONTROL_ACCOUNT) {
    const controlAccount = await getControlAccount(
      requiredConfigValue(config.code, key, "code"),
      companyId,
    );
    return {
      config,
      glAccount: glAccount(controlAccount?.glAccount?.code, controlAccount?.glAccount?.name),
    };
  }

  if (
    config.type === ComponentType.SOURCE_DOCUMENT ||
    config.type === ComponentType.DIRECT_GL ||
    config.type === ComponentType.ITEM_POSTING_PROFILE_CODE
  ) {
    return { config, glAccount: null };
  }

  const financialDocumentDefault = await getFinancialDocumentDefault(
    documentCode,
    requiredConfigValue(config.code, key, "code"),
    companyId,
  );
  return {
    config,
    glAccount: glAccount(financialDocumentDefault?.glAccount?.code, financialDocumentDefault?.glAccount?.name),
    postingDefault: financialDocumentDefault,
  };
}

function outputLine(
  side: FinancialDocumentTypePostingTemplateSideDto,
  resolved: ResolvedComponent,
  fallbackLabel: string,
): FinancialDocumentTypePostingTemplateOutputLineDto {
  return {
    side,
    glAccount: resolved.glAccount,
    fallbackLabel,
    reversalOfDocument: resolved.config.type === ComponentType.SOURCE_DOCUMENT,
  };
}

function overrideTextForLevel(level?: OverrideSlotLevel): string | undefined {
  if (level === "HEADER") return "Supply {{slot}} at header level";
  if (level === "LINE") return "Supply {{slot}} at line level";
  if (level === "HEADER_AND_LINE") return "Supply {{slot}} at header and / or line level";
  return undefined;
}

function sourceDocumentCard(
  key: string,
  title: string,
  side: FinancialDocumentTypePostingTemplateSideDto,
): FinancialDocumentTypePostingTemplateCardDto {
  return {
    key,
    title,
    side,
    documentDefault: {
      label: "Source document",
      glAccount: null,
    },
  };
}

function directGlCard(
  key: string,
  title: string,
  side: FinancialDocumentTypePostingTemplateSideDto,
): FinancialDocumentTypePostingTemplateCardDto {
  return {
    key,
    title,
    side,
    documentDefault: {
      label: "Caller supplied",
      glAccount: null,
    },
  };
}

function controlAccountCard(
  key: string,
  title: string,
  side: FinancialDocumentTypePostingTemplateSideDto,
  resolved: ResolvedComponent,
): FinancialDocumentTypePostingTemplateCardDto {
  const managedIn = resolved.config.ledger ? MANAGED_LINKS[resolved.config.ledger] : undefined;
  const label = resolved.config.code ?? (
    resolved.config.ledger === "TAX"
      ? "Selected by tax_movement_code"
      : requiredConfigValue(resolved.config.code, key, "code")
  );
  return {
    key,
    title,
    side,
    controlAccount: { label },
    resolvesTo: resolved.glAccount,
    managedIn: managedIn ? { link: managedIn } : undefined,
  };
}

function financialDocumentDefaultCard(
  key: string,
  title: string,
  side: FinancialDocumentTypePostingTemplateSideDto,
  documentCode: string,
  resolved: ResolvedComponent,
  routePrefix: string,
): FinancialDocumentTypePostingTemplateCardDto {
  const overrideSlotName = resolved.postingDefault?.overridePropertyName;
  const code = requiredConfigValue(resolved.config.code, key, "code");
  return {
    key,
    title,
    side,
    documentDefault: {
      label: "Document Default",
      glAccount: resolved.glAccount,
    },
    managedIn: {
      link: {
        label: "Document defaults",
        href: `${routePrefix}/financial-document-defaults/${encodeFinancialDocumentDefaultKey(documentCode, code)}`,
      },
      badge: { label: code },
    },
    overrideText: overrideSlotName ? overrideTextForLevel(resolved.postingDefault?.overrideScope) : undefined,
    overrideCode: overrideSlotName,
  };
}

function bankCashCard(
  key: string,
  title: string,
  side: FinancialDocumentTypePostingTemplateSideDto,
  documentCode: string,
  resolved: ResolvedComponent,
  routePrefix: string,
): FinancialDocumentTypePostingTemplateCardDto {
  const overrideSlotName = resolved.postingDefault?.overridePropertyName;
  const financialDocumentDefault = requiredConfigValue(resolved.config.posting_code, key, "posting_code");
  return {
    key,
    title,
    side,
    controlAccount: {
      label: requiredConfigValue(resolved.config.control_account, key, "control_account"),
    },
    resolvesTo: resolved.glAccount,
    managedIn: {
      link: {
        label: "Document defaults",
        href: `${routePrefix}/financial-document-defaults/${encodeFinancialDocumentDefaultKey(documentCode, financialDocumentDefault)}`,
      },
      badge: { label: financialDocumentDefault },
    },
    overrideText: overrideSlotName ? overrideTextForLevel(resolved.postingDefault?.overrideScope) : undefined,
    overrideCode: overrideSlotName,
  };
}

function itemPostingProfileCodeCard(
  key: string,
  title: string,
  side: FinancialDocumentTypePostingTemplateSideDto,
  resolved: ResolvedComponent,
): FinancialDocumentTypePostingTemplateCardDto {
  const code = requiredConfigValue(resolved.config.code, key, "code");
  return {
    key,
    title,
    side,
    documentDefault: {
      label: "Resolved per item profile",
      glAccount: null,
    },
    managedIn: {
      link: {
        label: "Item Posting Profiles",
        href: "/finance/inventory/item-posting-profiles",
      },
      badge: { label: code },
    },
  };
}

function prefixManagedLinks(
  card: FinancialDocumentTypePostingTemplateCardDto,
  routePrefix: string,
): FinancialDocumentTypePostingTemplateCardDto {
  if (!card.managedIn?.link.href?.startsWith("/")) return card;
  const managedRoutePrefix = routePrefix.startsWith("/finance") ? "/finance/settings" : routePrefix;
  if (card.managedIn.link.href.startsWith(managedRoutePrefix)) return card;
  return {
    ...card,
    managedIn: {
      ...card.managedIn,
      link: {
        ...card.managedIn.link,
        href: `${managedRoutePrefix}${card.managedIn.link.href}`,
      },
    },
  };
}

function buildCard(
  key: string,
  documentCode: string,
  resolved: ResolvedComponent,
  routePrefix: string,
): FinancialDocumentTypePostingTemplateCardDto {
  const title = resolved.config.title ?? key;
  const side = resolved.config.side ?? "DR";
  if (resolved.config.type === ComponentType.BANK_CASH) {
    return bankCashCard(key, title, side, documentCode, resolved, routePrefix);
  }
  if (resolved.config.type === ComponentType.CONTROL_ACCOUNT) {
    return prefixManagedLinks(controlAccountCard(key, title, side, resolved), routePrefix);
  }
  if (resolved.config.type === ComponentType.ITEM_POSTING_PROFILE_CODE) {
    return itemPostingProfileCodeCard(key, title, side, resolved);
  }
  if (resolved.config.type === ComponentType.POSTING_CODE) {
    return financialDocumentDefaultCard(key, title, side, documentCode, resolved, routePrefix);
  }
  if (resolved.config.type === ComponentType.SOURCE_DOCUMENT) {
    return sourceDocumentCard(key, title, side);
  }
  return directGlCard(key, title, side);
}

export async function buildFinancialDocumentTypePostingTemplate(
  documentCode: string,
  companyId: number,
  routePrefix: string = "/organization",
): Promise<FinancialDocumentTypePostingTemplateDto | null> {
  const definition = POSTING_COMPONENTS_BY_DOCUMENT_CODE[documentCode];
  if (!definition) return null;

  const entries = await Promise.all(
    Object.keys(definition.components).map(async (key) => ({
      key,
      resolved: await resolveComponent(definition, documentCode, key, companyId),
    })),
  );

  return {
    title: "Posting model",
    description: definition.description,
    formula: definition.formula,
    isCancellation: definition.is_cancellation,
    cancellationMessage: definition.is_cancellation
      ? "Cancellation documents do not introduce new posting targets. They reverse the ledger treatment of the referenced source document and preserve the audit trail back to that document."
      : undefined,
    outputTitle: "Current Ledger Output",
    outputLines: entries.map(({ resolved }) => outputLine(
      resolved.config.side ?? "DR",
      resolved,
      resolved.config.title ??
        resolved.config.code ??
        resolved.config.posting_code ??
        resolved.config.control_account ??
        "Posting component",
    )),
    hideComponents: definition.hide_components,
    cards: definition.hide_components
      ? []
      : entries.map(({ key, resolved }) => buildCard(key, documentCode, resolved, routePrefix)),
  };
}

