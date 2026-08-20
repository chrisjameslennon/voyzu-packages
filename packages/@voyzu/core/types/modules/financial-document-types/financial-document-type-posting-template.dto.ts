import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { DrCr } from "@voyzu/core/types/modules/core";
import { BusinessCode, NonBlankText } from "@voyzu/core/types/constraints";

export const FinancialDocumentTypePostingTemplateLinkDto = StrictObject({
  label: Type.String(),
  href: Type.String(),
});
export type FinancialDocumentTypePostingTemplateLinkDto = Type.Static<typeof FinancialDocumentTypePostingTemplateLinkDto>;

export const FinancialDocumentTypePostingTemplateBadgeDto = StrictObject({
  label: Type.String(),
});
export type FinancialDocumentTypePostingTemplateBadgeDto = Type.Static<typeof FinancialDocumentTypePostingTemplateBadgeDto>;

export const FinancialDocumentTypePostingTemplateGlAccountDto = StrictObject({
  code: BusinessCode,
  name: NonBlankText,
});
export type FinancialDocumentTypePostingTemplateGlAccountDto = Type.Static<typeof FinancialDocumentTypePostingTemplateGlAccountDto>;

export const FinancialDocumentTypePostingTemplateSideDto = Type.Union([DrCr, Type.Literal("DR/CR")]);
export type FinancialDocumentTypePostingTemplateSideDto = Type.Static<typeof FinancialDocumentTypePostingTemplateSideDto>;

export const FinancialDocumentTypePostingTemplateOutputLineDto = StrictObject({
  side: FinancialDocumentTypePostingTemplateSideDto,
  glAccount: Type.Union([FinancialDocumentTypePostingTemplateGlAccountDto, Type.Null()]),
  fallbackLabel: Type.String(),
  reversalOfDocument: Type.Optional(Type.Boolean()),
});
export type FinancialDocumentTypePostingTemplateOutputLineDto = Type.Static<typeof FinancialDocumentTypePostingTemplateOutputLineDto>;

export const FinancialDocumentTypePostingTemplateCardDto = StrictObject({
  key: Type.String(),
  title: Type.String(),
  side: FinancialDocumentTypePostingTemplateSideDto,
  controlAccount: Type.Optional(StrictObject({
    ...FinancialDocumentTypePostingTemplateBadgeDto.properties,
    name: Type.Optional(NonBlankText),
  })),
  documentDefault: Type.Optional(StrictObject({
    label: Type.String(),
    glAccount: Type.Union([FinancialDocumentTypePostingTemplateGlAccountDto, Type.Null()]),
  })),
  resolvesTo: Type.Optional(Type.Union([FinancialDocumentTypePostingTemplateGlAccountDto, Type.Null()])),
  managedIn: Type.Optional(StrictObject({
    link: FinancialDocumentTypePostingTemplateLinkDto,
    badge: Type.Optional(FinancialDocumentTypePostingTemplateBadgeDto),
  })),
  overrideText: Type.Optional(Type.String()),
  overrideCode: Type.Optional(BusinessCode),
});
export type FinancialDocumentTypePostingTemplateCardDto = Type.Static<typeof FinancialDocumentTypePostingTemplateCardDto>;

export const FinancialDocumentTypePostingTemplateDto = StrictObject({
  title: Type.String(),
  description: Type.String(),
  formula: Type.String(),
  isCancellation: Type.Optional(Type.Boolean()),
  cancellationMessage: Type.Optional(Type.String()),
  outputTitle: Type.String(),
  outputLines: Type.Array(FinancialDocumentTypePostingTemplateOutputLineDto),
  hideComponents: Type.Optional(Type.Boolean()),
  cards: Type.Array(FinancialDocumentTypePostingTemplateCardDto),
});
export type FinancialDocumentTypePostingTemplateDto = Type.Static<typeof FinancialDocumentTypePostingTemplateDto>;
