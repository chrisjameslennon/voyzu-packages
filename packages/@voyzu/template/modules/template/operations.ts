import "server-only";
import * as templateService from "./server/lib/template.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const createTemplate = operation(templateService.createTemplate);
export const batchCreateTemplates = operation(templateService.batchCreateTemplates);
export const getTemplate = operation(templateService.getTemplate);
export const listTemplates = operation(templateService.listTemplates);
export const filterTemplates = operation(templateService.filterTemplates);
export const searchTemplates = operation(templateService.searchTemplates);
export const updateTemplate = operation(templateService.updateTemplate);
export const patchTemplate = operation(templateService.patchTemplate);
export const batchGetTemplates = operation(templateService.batchGetTemplates);
export const batchUpdateTemplates = operation(templateService.batchUpdateTemplates);
export const batchPatchTemplates = operation(templateService.batchPatchTemplates);
export const deleteTemplate = operation(templateService.deleteTemplate);
export const batchDeleteTemplates = operation(templateService.batchDeleteTemplates);
export const activateTemplate = operation(templateService.activateTemplate);
export const deactivateTemplate = operation(templateService.deactivateTemplate);
export const activateTemplates = operation(templateService.activateTemplates);
export const deactivateTemplates = operation(templateService.deactivateTemplates);

export const operations = {
  createTemplate, batchCreateTemplates, getTemplate, listTemplates, filterTemplates,
  searchTemplates, updateTemplate, patchTemplate, batchGetTemplates,
  batchUpdateTemplates, batchPatchTemplates, deleteTemplate, batchDeleteTemplates,
  activateTemplate, deactivateTemplate, activateTemplates, deactivateTemplates,
} as const;
