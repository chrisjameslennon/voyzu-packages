import "server-only";

import { operation } from "@voyzu/capability/operations";
import { Filter, ListOptions } from "@voyzu/types";
import Type, { type TSchema } from "typebox";

import {
  TemplateBatchPatchRequestDto,
  TemplateBatchUpdateRequestDto,
  TemplateCreateRequestDto,
  TemplatePatchRequestDto,
  TemplateResponseDto,
  TemplateUpdateRequestDto,
} from "../types";

const TemplateList = Type.Array(TemplateResponseDto);
const Codes = Type.Array(Type.String());
const optionalListOptions = (first: TSchema) =>
  Type.Union([Type.Tuple([first]), Type.Tuple([first, ListOptions])]);
const noParametersOrListOptions = Type.Union([
  Type.Tuple([]),
  Type.Tuple([ListOptions]),
]);
const loadService = () => import("./server/lib/template.service");

export const createTemplate = operation.defineLazy(
  { parameters: Type.Tuple([TemplateCreateRequestDto]), result: TemplateResponseDto },
  () => loadService().then((module) => module.createTemplate),
);
export const batchCreateTemplates = operation.defineLazy(
  { parameters: Type.Tuple([Type.Array(TemplateCreateRequestDto)]), result: TemplateList },
  () => loadService().then((module) => module.batchCreateTemplates),
);
export const getTemplate = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.String()]),
    result: Type.Union([TemplateResponseDto, Type.Null()]),
  },
  () => loadService().then((module) => module.getTemplate),
);
export const listTemplates = operation.defineLazy(
  { parameters: noParametersOrListOptions, result: TemplateList },
  () => loadService().then((module) => module.listTemplates),
);
export const filterTemplates = operation.defineLazy(
  { parameters: optionalListOptions(Type.Array(Filter)), result: TemplateList },
  () => loadService().then((module) => module.filterTemplates),
);
export const searchTemplates = operation.defineLazy(
  { parameters: optionalListOptions(Type.String()), result: TemplateList },
  () => loadService().then((module) => module.searchTemplates),
);
export const updateTemplate = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.String(), TemplateUpdateRequestDto]),
    result: TemplateResponseDto,
  },
  () => loadService().then((module) => module.updateTemplate),
);
export const patchTemplate = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.String(), TemplatePatchRequestDto]),
    result: TemplateResponseDto,
  },
  () => loadService().then((module) => module.patchTemplate),
);
export const batchGetTemplates = operation.defineLazy(
  { parameters: Type.Tuple([Codes]), result: TemplateList },
  () => loadService().then((module) => module.batchGetTemplates),
);
export const batchUpdateTemplates = operation.defineLazy(
  { parameters: Type.Tuple([Type.Array(TemplateBatchUpdateRequestDto)]), result: TemplateList },
  () => loadService().then((module) => module.batchUpdateTemplates),
);
export const batchPatchTemplates = operation.defineLazy(
  { parameters: Type.Tuple([Type.Array(TemplateBatchPatchRequestDto)]), result: TemplateList },
  () => loadService().then((module) => module.batchPatchTemplates),
);
export const deleteTemplate = operation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Undefined() },
  () => loadService().then((module) => module.deleteTemplate),
);
export const batchDeleteTemplates = operation.defineLazy(
  { parameters: Type.Tuple([Codes]), result: Type.Undefined() },
  () => loadService().then((module) => module.batchDeleteTemplates),
);
export const activateTemplate = operation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: TemplateResponseDto },
  () => loadService().then((module) => module.activateTemplate),
);
export const deactivateTemplate = operation.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: TemplateResponseDto },
  () => loadService().then((module) => module.deactivateTemplate),
);
export const activateTemplates = operation.defineLazy(
  { parameters: Type.Tuple([Codes]), result: TemplateList },
  () => loadService().then((module) => module.activateTemplates),
);
export const deactivateTemplates = operation.defineLazy(
  { parameters: Type.Tuple([Codes]), result: TemplateList },
  () => loadService().then((module) => module.deactivateTemplates),
);

export const operations = {
  createTemplate,
  batchCreateTemplates,
  getTemplate,
  listTemplates,
  filterTemplates,
  searchTemplates,
  updateTemplate,
  patchTemplate,
  batchGetTemplates,
  batchUpdateTemplates,
  batchPatchTemplates,
  deleteTemplate,
  batchDeleteTemplates,
  activateTemplate,
  deactivateTemplate,
  activateTemplates,
  deactivateTemplates,
} as const;
