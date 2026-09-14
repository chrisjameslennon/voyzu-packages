import Type from "typebox";

export const DimensionValueName = Type.String({ pattern: "^[A-Za-z0-9 _-]{1,14}$" });
