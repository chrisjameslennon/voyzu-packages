import type { DbExecutor } from "@voyzu/capability/db";
import type { QueryResult } from "pg";

export class InventorySampleDataRepo {
  constructor(private readonly db: DbExecutor) {}

  findSampleOrganization(): Promise<QueryResult<{ id: number; code: string; name: string }>> {
    return this.db.query(`SELECT id::int, code, name
       FROM organization
      WHERE status = 'ACTIVE'
        AND code = 'TESTCO'`) as Promise<QueryResult<{ id: number; code: string; name: string }>>;
  }

  findSampleReservation(organizationId: number) {
    return this.db.query(`SELECT 1
       FROM inventory_reservation
      WHERE organization_id = $1
        AND reference = 'SAMPLE-RESERVATION'
      LIMIT 1`, [organizationId]);
  }

  deleteOrganizationRows(organizationId: number, table: string) {
    return this.db.query(`DELETE FROM ${table} WHERE organization_id = $1`, [organizationId]);
  }

  resetDocumentSequence(table: string) {
    return this.db.query(`SELECT setval(
       pg_get_serial_sequence('${table}', 'id'),
       GREATEST(COALESCE((SELECT MAX(id) FROM ${table}), 9999), 9999),
       true
     )`);
  }

  findOrganizationId(code: string): Promise<QueryResult<{ id: number }>> {
    return this.db.query(`SELECT id::int FROM organization WHERE code = $1`, [code]) as Promise<QueryResult<{ id: number }>>;
  }

  documentLinksExist(): Promise<QueryResult<{ exists: boolean }>> {
    return this.db.query("SELECT to_regclass('public.document_link') IS NOT NULL AS exists") as Promise<QueryResult<{ exists: boolean }>>;
  }

  deleteStockDocumentLinks(organizationId: number) {
    return this.db.query(`DELETE FROM document_link
            WHERE organization_id = $1
              AND (
                upstream_document_type LIKE 'STOCK_%'
                OR downstream_document_type LIKE 'STOCK_%'
              )`, [organizationId]);
  }
}
