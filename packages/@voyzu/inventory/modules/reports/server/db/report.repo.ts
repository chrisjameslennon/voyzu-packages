import type { DbExecutor } from "@voyzu/capability/db";

export class InventoryReportRepo {
  constructor(private readonly db: DbExecutor) {}

  listCustomFieldDefinitions(organizationId: number, appliesTo: string) {
    return this.db.query(`SELECT id::int, name, data_type
       FROM inv_custom_field
       WHERE organization_id = $1 AND applies_to = $2 AND status = 'ACTIVE'
       ORDER BY name`, [organizationId, appliesTo]);
  }

  listCustomFieldValues(organizationId: number, appliesTo: string, recordIds: number[]) {
    return this.db.query(`SELECT field_value.record_id::int, field_value.custom_field_id::int,
              field_value.text_value, field_value.number_value, field_value.date_value,
              field_value.boolean_value, option_value.value AS option_value
       FROM inv_custom_field_value field_value
       JOIN inv_custom_field field
         ON field.organization_id = field_value.organization_id
        AND field.id = field_value.custom_field_id
       LEFT JOIN inv_option_list_value option_value
         ON option_value.organization_id = field_value.organization_id
        AND option_value.id = field_value.option_list_value_id
       WHERE field_value.organization_id = $1
         AND field.applies_to = $2
         AND field.status = 'ACTIVE'
         AND field_value.record_id = ANY($3::bigint[])
       ORDER BY field_value.record_id, field.name, field_value.id`, [organizationId, appliesTo, recordIds]);
  }

  listFinancialActivity(organizationId: number) {
    return this.db.query(`SELECT activity.id::int,
              transaction.code,
              transaction.transaction_date date,
              activity.movement_type,
              activity.reason_code,
              activity.status,
              line.item_code,
              line.item_name,
              warehouse.name warehouse,
              line.quantity_change::float8 quantity_change
       FROM inventory_financial_activity activity
       JOIN inventory_transaction_line line
         ON line.organization_id=activity.organization_id
        AND line.id=activity.inventory_transaction_line_id
       JOIN inventory_transaction transaction
         ON transaction.organization_id=line.organization_id
        AND transaction.id=line.inventory_transaction_id
       JOIN warehouse
         ON warehouse.organization_id=line.organization_id
        AND warehouse.id=line.warehouse_id
       WHERE activity.organization_id=$1
       ORDER BY transaction.transaction_date DESC,activity.id DESC`, [organizationId]);
  }

  listReservationActivity(organizationId: number) {
    return this.db.query(`SELECT line.id,reservation.code,line.item_code,line.item_name,warehouse.name warehouse,line.quantity_change::float8,reservation.reference,reservation.reserved_at FROM inventory_reservation reservation JOIN inventory_reservation_line line ON line.organization_id=reservation.organization_id AND line.inventory_reservation_id=reservation.id JOIN warehouse ON warehouse.organization_id=line.organization_id AND warehouse.id=line.warehouse_id WHERE reservation.organization_id=$1 ORDER BY reservation.creation_date DESC,reservation.id DESC,line.id`, [organizationId]);
  }

  listStockActivity(organizationId: number) {
    return this.db.query(`SELECT line.id,
            transaction.id::int transaction_id,
            transaction.code,
            transaction.transaction_date date,
            transaction.transaction_type type,
            line.item_code,
            line.item_name,
            warehouse.name warehouse,
            line.quantity_change::float8 quantity_change,
            transaction.reference
     FROM inventory_transaction transaction
     JOIN inventory_transaction_line line
       ON line.organization_id=transaction.organization_id
      AND line.inventory_transaction_id=transaction.id
     JOIN warehouse
       ON warehouse.organization_id=line.organization_id
      AND warehouse.id=line.warehouse_id
     WHERE transaction.organization_id=$1
     ORDER BY transaction.creation_date DESC,transaction.id DESC,line.id`, [organizationId]);
  }
}
