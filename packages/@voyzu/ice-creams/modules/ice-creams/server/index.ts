export {
  handleActivate,
  handleBatchActivate,
  handleBatchCreate,
  handleBatchDeactivate,
  handleBatchDelete,
  handleBatchGet,
  handleBatchPatch,
  handleBatchUpdate,
  handleCreate,
  handleDeactivate,
  handleDelete,
  handleFilter,
  handleGet,
  handleList,
  handleListFlavors,
  handlePatch,
  handleSearch,
  handleUpdate,
} from "./api/ice-cream.http.handlers";

export {
  activateIceCream,
  activateIceCreams,
  batchCreateIceCreams,
  batchDeleteIceCreams,
  batchGetIceCreams,
  batchPatchIceCreams,
  batchUpdateIceCreams,
  createIceCream,
  deactivateIceCream,
  deactivateIceCreams,
  deleteIceCream,
  filterIceCreams,
  getIceCream,
  listIceCreamFlavors,
  listIceCreams,
  patchIceCream,
  searchIceCreams,
  updateIceCream,
} from "./lib/ice-cream.service";

export { IceCreamDetailPage } from "./pages/IceCreamDetailPage";
export { IceCreamsListPage } from "./pages/IceCreamsListPage";
