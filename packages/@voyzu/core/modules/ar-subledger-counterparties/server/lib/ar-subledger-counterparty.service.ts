import { getDb } from "@voyzu/capability/db";
import { getAuditActors } from "@voyzu/core/common/server";
import type { ArCounterpartyResponseDto } from "@voyzu/core/types/modules/ar-subledger";

import { ArSubledgerCounterpartyRepo } from "../db/ar-subledger-counterparty.repo";

function repo(): ArSubledgerCounterpartyRepo {
  return new ArSubledgerCounterpartyRepo(getDb());
}

async function toCounterpartyDto(row: Awaited<ReturnType<ArSubledgerCounterpartyRepo["listCounterparties"]>>[number]): Promise<ArCounterpartyResponseDto> {
  const auditActors = await getAuditActors(row);
  return {
    id: row.id,
    companyId: row.company_id,
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
}

export async function listArCounterparties(companyId: number): Promise<ArCounterpartyResponseDto[]> {
  const rows = await repo().listCounterparties(companyId);
  return Promise.all(rows.map(toCounterpartyDto));
}

export async function getArCounterparty(companyId: number, code: string): Promise<ArCounterpartyResponseDto | null> {
  const row = await repo().getCounterparty(companyId, code);
  return row ? toCounterpartyDto(row) : null;
}
