import Type from "typebox";

import { StrictObject } from "@voyzu/types/api";

const PositiveId = Type.Integer({ minimum: 1 });

export const CompanyAccessCompanyDto = StrictObject({
  id: PositiveId,
  code: Type.String(),
  name: Type.String(),
  status: Type.Union([Type.Literal("ACTIVE"), Type.Literal("INACTIVE")]),
});
export type CompanyAccessCompanyDto = Type.Static<typeof CompanyAccessCompanyDto>;

export const CompanyAccessUserDto = StrictObject({
  userId: PositiveId,
  userCode: Type.String(),
  displayName: Type.String(),
  userRole: Type.Union([Type.Literal("ADMIN"), Type.Literal("STANDARD")]),
  userStatus: Type.Union([Type.Literal("ACTIVE"), Type.Literal("INACTIVE")]),
  companyIds: Type.Array(PositiveId),
});
export type CompanyAccessUserDto = Type.Static<typeof CompanyAccessUserDto>;

export const CompanyAccessPageDto = StrictObject({
  users: Type.Array(CompanyAccessUserDto),
  companies: Type.Array(CompanyAccessCompanyDto),
});
export type CompanyAccessPageDto = Type.Static<typeof CompanyAccessPageDto>;

export const CompanyAccessUpdateRequestDto = StrictObject({
  companyIds: Type.Array(PositiveId),
});
export type CompanyAccessUpdateRequestDto = Type.Static<typeof CompanyAccessUpdateRequestDto>;
