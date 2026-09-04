import { getDb, withTransaction, type DbExecutor } from "@voyzu/capability/db";

const SAMPLE_ORGANIZATION_CODE = "TESTCO";

async function deleteRows(
  db: DbExecutor,
  table: string,
  organizationId: number,
): Promise<number> {
  const result = await db.query(
    `DELETE FROM ${table} WHERE organization_id = $1`,
    [organizationId],
  );
  return result.rowCount ?? 0;
}

async function resetDocumentSequence(db: DbExecutor, table: string): Promise<void> {
  await db.query(
    `SELECT setval(
       pg_get_serial_sequence('${table}', 'id'),
       GREATEST(COALESCE((SELECT MAX(id) FROM ${table}), 9999), 9999),
       true
     )`,
  );
}

/** Removes Inventory demonstration data for the shared TESTCO organization. */
export async function teardownSampleData(): Promise<void> {
  const organizationResult = await getDb().query<{ id: number }>(
    `SELECT id::int FROM organization WHERE code = $1`,
    [SAMPLE_ORGANIZATION_CODE],
  );
  const organizationId = organizationResult.rows[0]?.id;
  if (!organizationId) {
    console.log("TESTCO was not found; no Inventory sample data to tear down.");
    return;
  }

  const deleted = await withTransaction(async (db) => {
    const documentLinkTable = await db.query<{ exists: boolean }>(
      "SELECT to_regclass('public.document_link') IS NOT NULL AS exists",
    );
    const documentLinks = documentLinkTable.rows[0]?.exists
      ? await db.query(
          `DELETE FROM document_link
            WHERE organization_id = $1
              AND (
                upstream_document_type LIKE 'STOCK_%'
                OR downstream_document_type LIKE 'STOCK_%'
              )`,
          [organizationId],
        )
      : null;

    const counts = {
      documentLinks: documentLinks?.rowCount ?? 0,
      customFieldValues: await deleteRows(db, "inv_custom_field_value", organizationId),
      financialActivity: await deleteRows(db, "inventory_financial_activity", organizationId),
      reservationLines: await deleteRows(db, "inventory_reservation_line", organizationId),
      reservations: await deleteRows(db, "inventory_reservation", organizationId),
      stockCountLines: await deleteRows(db, "stock_count_line", organizationId),
      stockCounts: await deleteRows(db, "stock_count", organizationId),
      transactionLines: await deleteRows(db, "inventory_transaction_line", organizationId),
      transactions: await deleteRows(db, "inventory_transaction", organizationId),
      customFields: await deleteRows(db, "inv_custom_field", organizationId),
      optionValues: await deleteRows(db, "inv_option_list_value", organizationId),
      optionLists: await deleteRows(db, "inv_option_list", organizationId),
      items: await deleteRows(db, "item", organizationId),
      warehouses: await deleteRows(db, "warehouse", organizationId),
      categories: await deleteRows(db, "item_category", organizationId),
    };

    await resetDocumentSequence(db, "inventory_transaction");
    await resetDocumentSequence(db, "inventory_reservation");
    await resetDocumentSequence(db, "stock_count");
    return counts;
  });

  console.log(`Inventory sample data removed from ${SAMPLE_ORGANIZATION_CODE}.`);
  console.log(
    `Deleted ${deleted.transactions} transactions, ${deleted.reservations} reservations, `
      + `${deleted.stockCounts} stock counts, ${deleted.items} items, `
      + `${deleted.warehouses} warehouses, and ${deleted.documentLinks} document links.`,
  );
}

export default teardownSampleData;
