import { FinanceSampleDataRepo } from "../db/sample-data.repo";
import { getPool } from "@voyzu/capability/db";

export async function sampleDocumentExists(companyCode: string, documentId: string | null | undefined): Promise<boolean> {
  if (!documentId) return false;
  const pool = getPool();
  const result = await new FinanceSampleDataRepo(pool).findExistingDocument(companyCode, documentId);
  return (result.rowCount ?? 0) > 0;
}

export async function skipExistingSampleDocument(companyCode: string, documentId: string | null | undefined): Promise<boolean> {
  if (!(await sampleDocumentExists(companyCode, documentId))) return false;
  console.log(`document ${documentId} already exists, skipping`);
  return true;
}
