import "server-only";

import { command } from "@voyzu/capability/commands";
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

export const createTemplate = command.defineLazy(
  { parameters: Type.Tuple([TemplateCreateRequestDto]), result: TemplateResponseDto },
  () => loadService().then((module) => module.createTemplate),
);
export const batchCreateTemplates = command.defineLazy(
  { parameters: Type.Tuple([Type.Array(TemplateCreateRequestDto)]), result: TemplateList },
  () => loadService().then((module) => module.batchCreateTemplates),
);
export const getTemplate = command.defineLazy(
  {
    parameters: Type.Tuple([Type.String()]),
    result: Type.Union([TemplateResponseDto, Type.Null()]),
  },
  () => loadService().then((module) => module.getTemplate),
);
export const listTemplates = command.defineLazy(
  { parameters: noParametersOrListOptions, result: TemplateList },
  () => loadService().then((module) => module.listTemplates),
);
export const filterTemplates = command.defineLazy(
  { parameters: optionalListOptions(Type.Array(Filter)), result: TemplateList },
  () => loadService().then((module) => module.filterTemplates),
);
export const searchTemplates = command.defineLazy(
  { parameters: optionalListOptions(Type.String()), result: TemplateList },
  () => loadService().then((module) => module.searchTemplates),
);
export const updateTemplate = command.defineLazy(
  {
    parameters: Type.Tuple([Type.String(), TemplateUpdateRequestDto]),
    result: TemplateResponseDto,
  },
  () => loadService().then((module) => module.updateTemplate),
);
export const patchTemplate = command.defineLazy(
  {
    parameters: Type.Tuple([Type.String(), TemplatePatchRequestDto]),
    result: TemplateResponseDto,
  },
  () => loadService().then((module) => module.patchTemplate),
);
export const batchGetTemplates = command.defineLazy(
  { parameters: Type.Tuple([Codes]), result: TemplateList },
  () => loadService().then((module) => module.batchGetTemplates),
);
export const batchUpdateTemplates = command.defineLazy(
  { parameters: Type.Tuple([Type.Array(TemplateBatchUpdateRequestDto)]), result: TemplateList },
  () => loadService().then((module) => module.batchUpdateTemplates),
);
export const batchPatchTemplates = command.defineLazy(
  { parameters: Type.Tuple([Type.Array(TemplateBatchPatchRequestDto)]), result: TemplateList },
  () => loadService().then((module) => module.batchPatchTemplates),
);
export const deleteTemplate = command.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: Type.Undefined() },
  () => loadService().then((module) => module.deleteTemplate),
);
export const batchDeleteTemplates = command.defineLazy(
  { parameters: Type.Tuple([Codes]), result: Type.Undefined() },
  () => loadService().then((module) => module.batchDeleteTemplates),
);
export const activateTemplate = command.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: TemplateResponseDto },
  () => loadService().then((module) => module.activateTemplate),
);
export const deactivateTemplate = command.defineLazy(
  { parameters: Type.Tuple([Type.String()]), result: TemplateResponseDto },
  () => loadService().then((module) => module.deactivateTemplate),
);
export const activateTemplates = command.defineLazy(
  { parameters: Type.Tuple([Codes]), result: TemplateList },
  () => loadService().then((module) => module.activateTemplates),
);
export const deactivateTemplates = command.defineLazy(
  { parameters: Type.Tuple([Codes]), result: TemplateList },
  () => loadService().then((module) => module.deactivateTemplates),
);

export const commands = {
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
