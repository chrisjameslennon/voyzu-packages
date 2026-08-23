import { getPool } from "@voyzu/capability/db";

export async function sampleDocumentExists(companyCode: string, documentId: string | null | undefined): Promise<boolean> {
  if (!documentId) return false;
  const pool = getPool();
  const result = await pool.query(
    `SELECT 1
       FROM journal_header h
       JOIN finance_organization fc ON fc.id = h.finance_organization_id
       JOIN organization c ON c.id = fc.organization_id
      WHERE c.code = $1
        AND h.document_id = $2
      LIMIT 1`,
    [companyCode, documentId],
  );
  return result.rowCount > 0;
}

export async function skipExistingSampleDocument(companyCode: string, documentId: string | null | undefined): Promise<boolean> {
  if (!(await sampleDocumentExists(companyCode, documentId))) return false;
  console.log(`document ${documentId} already exists, skipping`);
  return true;
}
