import "server-only";
import { command } from "@voyzu/capability/commands";
import Type from "typebox";
import {
  ConfigurationCreateDto,
  ConfigurationDetailDto,
  ConfigurationKindDto,
  ConfigurationPatchDto,
  ConfigurationRowDto,
  OptionValueCreateDto,
  OptionValuePatchDto,
} from "./types/configuration.types";
const load = () => import("./server/lib/configuration.service");
export const listInventoryConfiguration = command.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), ConfigurationKindDto]),
    result: Type.Array(ConfigurationRowDto),
  },
  () => load().then((m) => m.listConfiguration),
);
export const getInventoryConfiguration = command.defineLazy(
  {
    parameters: Type.Tuple([
      Type.Number(),
      ConfigurationKindDto,
      Type.Number(),
    ]),
    result: Type.Union([ConfigurationDetailDto, Type.Null()]),
  },
  () => load().then((m) => m.getConfiguration),
);
export const createInventoryConfiguration = command.defineLazy(
  {
    parameters: Type.Tuple([
      Type.Number(),
      ConfigurationKindDto,
      ConfigurationCreateDto,
    ]),
    result: ConfigurationDetailDto,
  },
  () => load().then((m) => m.createConfiguration),
);
export const patchInventoryConfiguration = command.defineLazy(
  {
    parameters: Type.Tuple([
      Type.Number(),
      ConfigurationKindDto,
      Type.Number(),
      ConfigurationPatchDto,
    ]),
    result: ConfigurationDetailDto,
  },
  () => load().then((m) => m.patchConfiguration),
);
export const transitionInventoryConfiguration = command.defineLazy(
  {
    parameters: Type.Tuple([
      Type.Number(),
      ConfigurationKindDto,
      Type.Array(Type.Number()),
      Type.Union([
        Type.Literal("ACTIVE"),
        Type.Literal("INACTIVE"),
        Type.Literal("DELETED"),
      ]),
    ]),
    result: Type.Array(ConfigurationDetailDto),
  },
  () => load().then((m) => m.transitionConfiguration),
);
export const addInventoryOptionValue = command.defineLazy(
  {
    parameters: Type.Tuple([
      Type.Number(),
      Type.Number(),
      OptionValueCreateDto,
    ]),
    result: ConfigurationDetailDto,
  },
  () => load().then((m) => m.addOptionValue),
);
export const patchInventoryOptionValue = command.defineLazy(
  {
    parameters: Type.Tuple([
      Type.Number(),
      Type.Number(),
      Type.Number(),
      OptionValuePatchDto,
    ]),
    result: ConfigurationDetailDto,
  },
  () => load().then((m) => m.patchOptionValue),
);
export const deleteInventoryOptionValue = command.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), Type.Number(), Type.Number()]),
    result: ConfigurationDetailDto,
  },
  () => load().then((m) => m.deleteOptionValue),
);
export const commands = {
  listInventoryConfiguration,
  getInventoryConfiguration,
  createInventoryConfiguration,
  patchInventoryConfiguration,
  transitionInventoryConfiguration,
  addInventoryOptionValue,
  patchInventoryOptionValue,
  deleteInventoryOptionValue,
} as const;
