import type { DrCr } from "@voyzu/core/types/modules/core";
export interface FinancialDocumentTypePostingTemplateLinkDto {
  label: string;
  href: string;
}

export interface FinancialDocumentTypePostingTemplateBadgeDto {
  label: string;
}

export interface FinancialDocumentTypePostingTemplateGlAccountDto {
  code: string;
  name: string;
}

export type FinancialDocumentTypePostingTemplateSideDto = DrCr | "DR/CR";

export interface FinancialDocumentTypePostingTemplateOutputLineDto {
  side: FinancialDocumentTypePostingTemplateSideDto;
  glAccount: FinancialDocumentTypePostingTemplateGlAccountDto | null;
  fallbackLabel: string;
  reversalOfDocument?: boolean;
}

export interface FinancialDocumentTypePostingTemplateCardDto {
  key: string;
  title: string;
  side: FinancialDocumentTypePostingTemplateSideDto;
  controlAccount?: FinancialDocumentTypePostingTemplateBadgeDto & {
    name?: string;
  };
  documentDefault?: {
    label: string;
    glAccount: FinancialDocumentTypePostingTemplateGlAccountDto | null;
  };
  resolvesTo?: FinancialDocumentTypePostingTemplateGlAccountDto | null;
  managedIn?: {
    link: FinancialDocumentTypePostingTemplateLinkDto;
    badge?: FinancialDocumentTypePostingTemplateBadgeDto;
  };
  overrideText?: string;
  overrideCode?: string;
}

export interface FinancialDocumentTypePostingTemplateDto {
  title: string;
  description: string;
  formula: string;
  isCancellation?: boolean;
  cancellationMessage?: string;
  outputTitle: string;
  outputLines: FinancialDocumentTypePostingTemplateOutputLineDto[];
  hideComponents?: boolean;
  cards: FinancialDocumentTypePostingTemplateCardDto[];
}
