import { getDb } from "@voyzu/capability/db";
import { getAuditActors } from "@voyzu/finance/common/server";
import type { ApCounterpartyResponseDto } from "@voyzu/finance/types/modules/ap-subledger";

import { ApSubledgerCounterpartyRepo } from "../db/ap-subledger-counterparty.repo";

function repo(): ApSubledgerCounterpartyRepo {
  return new ApSubledgerCounterpartyRepo(getDb());
}

async function toCounterpartyDto(row: Awaited<ReturnType<ApSubledgerCounterpartyRepo["listCounterparties"]>>[number]): Promise<ApCounterpartyResponseDto> {
  const auditActors = await getAuditActors(row);
  const dto: ApCounterpartyResponseDto = {
    id: row.id,
    companyId: row.finance_organization_id,
    code: row.code,
    name: row.name,
    status: row.status,
    countryCode: row.country_code,
    countryName: row.country_name,
    taxRegionOrProvince: row.tax_region_or_province,
    audit: {
      created: {
        date: row.creation_date,
        actorType: row.creation_actor_type,
        userId: row.creation_user_id,
        user: auditActors.creationUser,
        mutationId: row.creation_mutation_id,
      },
      updated: {
        date: row.updated_date,
        actorType: row.updated_actor_type,
        userId: row.updated_user_id,
        user: auditActors.updatedUser,
        mutationId: row.updated_mutation_id,
      },
    },
  };
  return dto;
}

export async function listApCounterparties(companyId: number): Promise<ApCounterpartyResponseDto[]> {
  const rows = await repo().listCounterparties(companyId);
  return Promise.all(rows.map(toCounterpartyDto));
}

export async function getApCounterparty(companyId: number, code: string): Promise<ApCounterpartyResponseDto | null> {
  const row = await repo().getCounterparty(companyId, code);
  return row ? toCounterpartyDto(row) : null;
}
