import Type, { type Static } from "typebox";

export const Unit = Type.Union([
  Type.Literal("each"),
  Type.Literal("ea"),
  Type.Literal("box"),
  Type.Literal("kg"),
  Type.Literal("g"),
  Type.Literal("l"),
  Type.Literal("ml"),
  Type.Literal("m"),
  Type.Literal("roll"),
]);

export type Unit = Static<typeof Unit>;

export const UNIT_VALUES: readonly Unit[] = [
  "each",
  "ea",
  "box",
  "kg",
  "g",
  "l",
  "ml",
  "m",
  "roll",
];
