import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto } from "@voyzu/erp-core/types/modules/core";
import { Status } from "@voyzu/erp-core/types/modules/core";
import { BusinessCode, NonBlankText, PositiveId } from "@voyzu/erp-core/types/constraints";

export const OrganizationResponseDto = StrictObject({
  id: PositiveId,
  code: BusinessCode,
  organizationName: NonBlankText,
  status: Status,
  audit: AuditMetadataDto,
});
export type OrganizationResponseDto = Type.Static<typeof OrganizationResponseDto>;
