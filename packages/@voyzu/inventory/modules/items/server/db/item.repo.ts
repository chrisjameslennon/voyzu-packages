import { DataError } from "@voyzu/capability/errors";
import type { DbExecutor } from "@voyzu/capability/db";
import type { ItemListRow, ItemStatus } from "../../types/item-list.types";
import type { OperationalItemDto } from "../../types/operational-item.types";
import type { ItemCategoryOptionDto, ItemCustomFieldDto, ItemCustomFieldInputDto } from "../../types/item.types";
import type { ItemRow } from "./item.row.types";

const SELECT_ITEM = `SELECT item.*, item_category.code AS category_code, item_category.name AS category_name,
  EXISTS (SELECT 1 FROM inventory_transaction_line line WHERE line.organization_id = item.organization_id AND line.item_id = item.id) AS in_use
  FROM item LEFT JOIN item_category ON item_category.organization_id = item.organization_id AND item_category.id = item.item_category_id`;

const isoDate = (value: unknown) => new Date(String(value)).toISOString();

function normalizeItem(row: Record<string, unknown>): ItemRow {
  return { ...row, id: Number(row.id), organization_id: Number(row.organization_id),
    item_category_id: row.item_category_id == null ? null : Number(row.item_category_id),
    dimension_height: row.dimension_height == null ? null : Number(row.dimension_height),
    dimension_width: row.dimension_width == null ? null : Number(row.dimension_width),
    dimension_depth: row.dimension_depth == null ? null : Number(row.dimension_depth),
    weight: row.weight == null ? null : Number(row.weight),
    in_use: Boolean(row.in_use),
    creation_date: isoDate(row.creation_date),
    updated_date: isoDate(row.updated_date) } as ItemRow;
}

export class ItemRepo {
  constructor(private readonly db: DbExecutor) {}

  async list(organizationId: number): Promise<ItemListRow[]> {
    const { rows } = await this.db.query(`${SELECT_ITEM} WHERE item.organization_id = $1 ORDER BY item.sku`, [organizationId]);
    return rows.map((row: Record<string, unknown>) => ({ id: Number(row.id), sku: String(row.sku), name: String(row.name),
      category: row.category_name === null ? null : String(row.category_name),
      unit: row.unit == null ? null : String(row.unit) as ItemListRow["unit"], quantityTracked: Boolean(row.quantity_tracked), status: row.status as ItemListRow["status"] }));
  }

  async get(organizationId: number, sku: string): Promise<ItemRow | null> {
    const { rows } = await this.db.query(`${SELECT_ITEM} WHERE item.organization_id = $1 AND item.sku = $2`, [organizationId, sku.trim().toUpperCase()]);
    return rows[0] ? normalizeItem(rows[0]) : null;
  }

  async insert(organizationId: number, row: Record<string, unknown>): Promise<ItemRow> {
    const entries = Object.entries(row); const values = [organizationId, ...entries.map(([, value]) => value)];
    const columns = ["organization_id", ...entries.map(([key]) => key)];
    await this.db.query(`INSERT INTO item (${columns.join(", ")}) VALUES (${values.map((_, index) => `$${index + 1}`).join(", ")})`, values);
    const created = await this.get(organizationId, String(row.sku));
    if (!created) throw new DataError("Created item could not be loaded");
    return created;
  }

  async insertAutoSku(organizationId: number, row: Record<string, unknown>): Promise<ItemRow> {
    const entries = Object.entries(row); const values = [organizationId, ...entries.map(([, value]) => value)];
    const columns = ["organization_id", ...entries.map(([key]) => key)];
    const { rows } = await this.db.query(
      `WITH reserved AS (
         SELECT nextval(pg_get_serial_sequence('item', 'id'))::bigint AS id
       )
       INSERT INTO item (id, sku, ${columns.join(", ")})
       SELECT reserved.id, 'SKU-' || reserved.id::text, ${values.map((_, index) => `$${index + 1}`).join(", ")}
       FROM reserved
       RETURNING sku`,
      values,
    );
    const created = await this.get(organizationId, String(rows[0]?.sku));
    if (!created) throw new DataError("Created item could not be loaded");
    return created;
  }

  async reserveAutoSku(): Promise<{ id: number; sku: string }> {
    const { rows } = await this.db.query(
      "SELECT nextval(pg_get_serial_sequence('item', 'id')) AS id",
    );
    const id = Number(rows[0]?.id);
    return { id, sku: `SKU-${id}` };
  }

  async insertReservedAutoSku(organizationId: number, id: number, row: Record<string, unknown>): Promise<ItemRow> {
    const entries = Object.entries(row); const values = [id, `SKU-${id}`, organizationId, ...entries.map(([, value]) => value)];
    const columns = ["id", "sku", "organization_id", ...entries.map(([key]) => key)];
    await this.db.query(
      `INSERT INTO item (${columns.join(", ")}) VALUES (${values.map((_, index) => `$${index + 1}`).join(", ")})`,
      values,
    );
    const created = await this.get(organizationId, `SKU-${id}`);
    if (!created) throw new DataError("Created item could not be loaded");
    return created;
  }

  async patch(organizationId: number, sku: string, row: Record<string, unknown>): Promise<ItemRow> {
    const mutable = new Set(["name", "description", "item_category_id", "unit", "dimension_unit", "dimension_height", "dimension_width", "dimension_depth", "weight_unit", "weight", "quantity_tracked", "status", "updated_date", "updated_actor_type", "updated_user_id", "updated_mutation_id"]);
    const entries = Object.entries(row).filter(([, value]) => value !== undefined); const values: unknown[] = [];
    const sets = entries.map(([column, value]) => { if (!mutable.has(column)) throw new DataError(`Unsupported mutable item column ${column}`); values.push(value);
      const cast = column === "updated_actor_type" ? "::actor_type" : column === "updated_date" ? "::timestamptz" : column === "updated_mutation_id" ? "::uuid" : "";
      return `${column} = $${values.length}${cast}`; });
    if (sets.length) { values.push(organizationId, sku.trim().toUpperCase()); const result = await this.db.query(`UPDATE item SET ${sets.join(", ")} WHERE organization_id = $${values.length - 1} AND sku = $${values.length}`, values); if (result.rowCount === 0) throw new DataError(`Item ${sku} not found`); }
    const changed = await this.get(organizationId, sku); if (!changed) throw new DataError(`Item ${sku} not found`); return changed;
  }

  async listCategories(organizationId: number): Promise<ItemCategoryOptionDto[]> {
    const { rows } = await this.db.query("SELECT id::int, code, name FROM item_category WHERE organization_id = $1 AND status = 'ACTIVE' ORDER BY name", [organizationId]);
    return rows.map((row: Record<string, unknown>) => ({ id: Number(row.id), code: String(row.code), name: String(row.name) }));
  }

  async categoryExists(organizationId: number, categoryId: number): Promise<boolean> {
    const { rows } = await this.db.query(
      "SELECT EXISTS (SELECT 1 FROM item_category WHERE organization_id = $1 AND id = $2 AND status = 'ACTIVE') AS exists",
      [organizationId, categoryId],
    );
    return Boolean(rows[0]?.exists);
  }

  async changeCategory(organizationId: number, skus: string[], categoryId: number, audit: { timestamp: string; actorType: string; userId: string | null; mutationId: string }): Promise<void> {
    await this.db.query(
      "UPDATE item SET item_category_id = $3, updated_date = $4::timestamptz, updated_actor_type = $5::actor_type, updated_user_id = $6, updated_mutation_id = $7::uuid WHERE organization_id = $1 AND sku = ANY($2::text[])",
      [organizationId, skus, categoryId, audit.timestamp, audit.actorType, audit.userId, audit.mutationId],
    );
  }

  async listCustomFields(organizationId: number, itemId: number): Promise<ItemCustomFieldDto[]> {
    const [{ rows: fieldRows }, { rows: optionRows }, { rows: valueRows }] = await Promise.all([
      this.db.query("SELECT id::int, name, data_type, required, status, option_list_id::int FROM inv_custom_field WHERE organization_id = $1 AND applies_to = 'ITEM' ORDER BY name", [organizationId]),
      this.db.query("SELECT value.id::int, value.option_list_id::int, value.value FROM inv_option_list_value value JOIN inv_option_list list ON list.organization_id = value.organization_id AND list.id = value.option_list_id WHERE value.organization_id = $1 AND value.status = 'ACTIVE' AND list.status = 'ACTIVE' ORDER BY value.sort_order, value.value", [organizationId]),
      this.db.query("SELECT custom_field_id::int, text_value, number_value, date_value, boolean_value, option_list_value_id::int FROM inv_custom_field_value WHERE organization_id = $1 AND record_id = $2 ORDER BY id", [organizationId, itemId]),
    ]);
    const optionsByList = new Map<number, Array<{ id: number; value: string }>>();
    for (const row of optionRows as Record<string, unknown>[]) { const listId = Number(row.option_list_id); const values = optionsByList.get(listId) ?? []; values.push({ id: Number(row.id), value: String(row.value) }); optionsByList.set(listId, values); }
    const valuesByField = new Map<number, Record<string, unknown>[]>();
    for (const row of valueRows as Record<string, unknown>[]) { const fieldId = Number(row.custom_field_id); const values = valuesByField.get(fieldId) ?? []; values.push(row); valuesByField.set(fieldId, values); }
    return (fieldRows as Record<string, unknown>[]).map((row) => {
      const dataType = row.data_type as ItemCustomFieldDto["dataType"]; const values = valuesByField.get(Number(row.id)) ?? [];
      let value: ItemCustomFieldDto["value"] = null;
      if (dataType === "TEXT") value = values[0]?.text_value == null ? null : String(values[0].text_value);
      else if (dataType === "NUMBER") value = values[0]?.number_value == null ? null : Number(values[0].number_value);
      else if (dataType === "DATE") value = values[0]?.date_value == null ? null : values[0].date_value instanceof Date ? values[0].date_value.toISOString().slice(0, 10) : String(values[0].date_value).slice(0, 10);
      else if (dataType === "BOOLEAN") value = values[0]?.boolean_value == null ? null : Boolean(values[0].boolean_value);
      else if (dataType === "OPTION") value = values[0]?.option_list_value_id == null ? null : Number(values[0].option_list_value_id);
      else value = values.map((entry) => Number(entry.option_list_value_id)).filter(Number.isFinite);
      return { id: Number(row.id), name: String(row.name), dataType, required: Boolean(row.required), status: row.status as ItemCustomFieldDto["status"], options: row.option_list_id == null ? [] : optionsByList.get(Number(row.option_list_id)) ?? [], value };
    });
  }

  async replaceCustomFieldValues(organizationId: number, itemId: number, fields: ItemCustomFieldInputDto[], definitions: ItemCustomFieldDto[], audit: { timestamp: string; actorType: string; userId: string | null; mutationId: string }): Promise<void> {
    const definitionById = new Map(definitions.map((field) => [field.id, field]));
    for (const field of fields) {
      const definition = definitionById.get(field.customFieldId); if (!definition || definition.status !== "ACTIVE") continue;
      await this.db.query("DELETE FROM inv_custom_field_value WHERE organization_id = $1 AND custom_field_id = $2 AND record_id = $3", [organizationId, field.customFieldId, itemId]);
      const values = definition.dataType === "MULTIPLE_OPTIONS" && Array.isArray(field.value) ? field.value : field.value === null || field.value === "" ? [] : [field.value];
      for (const value of values) {
        const columns: Record<string, unknown> = { text_value: null, number_value: null, date_value: null, boolean_value: null, option_list_value_id: null };
        if (definition.dataType === "TEXT") columns.text_value = String(value);
        else if (definition.dataType === "NUMBER") columns.number_value = Number(value);
        else if (definition.dataType === "DATE") columns.date_value = String(value);
        else if (definition.dataType === "BOOLEAN") columns.boolean_value = Boolean(value);
        else columns.option_list_value_id = Number(value);
        await this.db.query(`INSERT INTO inv_custom_field_value (organization_id, custom_field_id, record_id, text_value, number_value, date_value, boolean_value, option_list_value_id, creation_date, creation_actor_type, creation_user_id, creation_mutation_id, updated_date, updated_actor_type, updated_user_id, updated_mutation_id)
          VALUES ($1, $2, $3, $4, $5, $6::date, $7, $8, $9::timestamptz, $10::actor_type, $11, $12::uuid, $9::timestamptz, $10::actor_type, $11, $12::uuid)`, [organizationId, field.customFieldId, itemId, columns.text_value, columns.number_value, columns.date_value, columns.boolean_value, columns.option_list_value_id, audit.timestamp, audit.actorType, audit.userId, audit.mutationId]);
      }
    }
  }

  async transition(organizationId: number, skus: string[], status: ItemStatus, audit: { timestamp: string; actorType: string; userId: string | null; mutationId: string }): Promise<void> {
    await this.db.query("UPDATE item SET status = $3, updated_date = $4::timestamptz, updated_actor_type = $5::actor_type, updated_user_id = $6, updated_mutation_id = $7::uuid WHERE organization_id = $1 AND sku = ANY($2::text[])", [organizationId, skus, status, audit.timestamp, audit.actorType, audit.userId, audit.mutationId]);
  }

  async delete(organizationId: number, skus: string[], audit: { timestamp: string; actorType: string; userId: string | null; mutationId: string }): Promise<void> {
    await this.db.query("UPDATE item SET deletion_date = $3::timestamptz, deletion_actor_type = $4::actor_type, deletion_user_id = $5, deletion_mutation_id = $6::uuid WHERE organization_id = $1 AND sku = ANY($2::text[])", [organizationId, skus, audit.timestamp, audit.actorType, audit.userId, audit.mutationId]);
    await this.db.query("DELETE FROM item WHERE organization_id = $1 AND sku = ANY($2::text[])", [organizationId, skus]);
  }

  async listOperationalItems(organizationId: number, skus: string[]): Promise<OperationalItemDto[]> {
    if (!skus.length) return []; const { rows } = await this.db.query("SELECT id::int, sku, name, description, quantity_tracked, status FROM item WHERE organization_id = $1 AND sku = ANY($2::text[])", [organizationId, skus]);
    return rows.map((row: Record<string, unknown>) => ({ id: Number(row.id), sku: String(row.sku), name: String(row.name), description: String(row.description), quantityTracked: Boolean(row.quantity_tracked), status: row.status as OperationalItemDto["status"] }));
  }
}
