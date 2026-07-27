import type { AuditMetadataDto, Status } from "@voyzu/types/modules/core";

export interface IceCreamFlavorResponseDto {
  id: number;
  code: string;
  name: string;
  status: Status;
}

export interface IceCreamCreateRequestDto {
  code: string;
  name: string;
  flavorCode: string;
  supplier: string;
}

export interface IceCreamUpdateRequestDto {
  name: string;
  flavorCode: string;
  supplier: string;
}

export interface IceCreamPatchRequestDto {
  name?: string;
  flavorCode?: string;
  supplier?: string;
}

export interface IceCreamBatchUpdateRequestDto extends IceCreamUpdateRequestDto {
  code: string;
}

export interface IceCreamBatchPatchRequestDto extends IceCreamPatchRequestDto {
  code: string;
}

export interface IceCreamResponseDto {
  id: number;
  code: string;
  name: string;
  flavor: IceCreamFlavorResponseDto;
  supplier: string;
  status: Status;
  audit: AuditMetadataDto;
}

export interface IceCreamReportRowDto {
  code: string;
  name: string;
  flavorCode: string;
  flavorName: string;
  supplier: string;
  status: Status;
}
