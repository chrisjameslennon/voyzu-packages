import type { DbExecutor } from "@voyzu/capability/db";
import type {
  ConfigurationCreate,
  ConfigurationDetail,
  ConfigurationKind,
  ConfigurationPatch,
  ConfigurationRow,
} from "../../types/configuration.types";

const tableFor = (kind: ConfigurationKind) =>
  ({
    category: "item_category",
    warehouse: "warehouse",
    "custom-field": "custom_field",
    "option-list": "option_list",
  })[kind];
const isoDate = (value: unknown) => new Date(String(value)).toISOString();
const normalizeAudit = (row: Record<string, unknown>) => ({
  created: {
    date: isoDate(row.creation_date),
    actorType: row.creation_actor_type as "API" | "APP" | "SYSTEM",
    userId: row.creation_user_id == null ? null : String(row.creation_user_id),
    mutationId:
      row.creation_mutation_id == null
        ? null
        : String(row.creation_mutation_id),
  },
  updated: {
    date: isoDate(row.updated_date),
    actorType: row.updated_actor_type as "API" | "APP" | "SYSTEM",
    userId: row.updated_user_id == null ? null : String(row.updated_user_id),
    mutationId:
      row.updated_mutation_id == null ? null : String(row.updated_mutation_id),
  },
});

export class ConfigurationRepo {
  constructor(private readonly db: DbExecutor) {}
  async list(
    organizationId: number,
    kind: ConfigurationKind,
  ): Promise<ConfigurationRow[]> {
    const table = tableFor(kind);
    const joins =
      kind === "category"
        ? "LEFT JOIN item i ON i.organization_id = source.organization_id AND i.item_category_id = source.id"
        : kind === "option-list"
          ? "LEFT JOIN option_list_value v ON v.organization_id = source.organization_id AND v.option_list_id = source.id"
          : kind === "custom-field"
            ? "LEFT JOIN custom_field_value v ON v.organization_id = source.organization_id AND v.custom_field_id = source.id"
            : "";
    const secondary =
      kind === "warehouse"
          ? "concat_ws(', ', nullif(source.city, ''), nullif(source.country_code, ''))"
          : "''";
    const dataType = kind === "custom-field" ? "source.data_type" : "NULL::text";
    const appliesTo = kind === "custom-field" ? "source.applies_to" : "NULL::text";
    const description = kind === "category" ? "source.description" : "''";
    const count =
      kind === "category"
        ? "count(i.id)"
        : kind === "option-list"
          ? "count(v.id)"
          : kind === "custom-field"
            ? "count(v.id)"
            : "0";
    const shared = kind === "option-list" ? "AND source.is_shared = true" : "";
    const { rows } = await this.db.query(
      `SELECT source.id::int, ${kind === "category" || kind === "warehouse" ? "source.code" : "NULL::text AS code"}, source.name, ${description} AS description, ${secondary} AS secondary, ${dataType} AS "dataType", ${appliesTo} AS "appliesTo", ${count}::int AS count, source.status FROM ${table} source ${joins} WHERE source.organization_id = $1 ${shared} GROUP BY source.id ORDER BY source.name`,
      [organizationId],
    );
    return rows as ConfigurationRow[];
  }
  async get(
    organizationId: number,
    kind: ConfigurationKind,
    id: number,
  ): Promise<ConfigurationDetail | null> {
    const table = tableFor(kind);
    const { rows } = await this.db.query(
      `SELECT * FROM ${table} WHERE organization_id = $1 AND id = $2`,
      [organizationId, id],
    );
    const row = rows[0] as Record<string, unknown> | undefined;
    if (!row) return null;
    let options: ConfigurationDetail["options"] = [];
    let usedBy: ConfigurationDetail["usedBy"] = [];
    let linkedOptionListIsShared = false;
    if (
      kind === "option-list" ||
      (kind === "custom-field" && row.option_list_id)
    ) {
      const listId = kind === "option-list" ? id : Number(row.option_list_id);
      const result = await this.db.query(
        `SELECT value.id::int, value.value, value.status, count(field_value.id)::int AS used_by FROM option_list_value value LEFT JOIN custom_field_value field_value ON field_value.organization_id = value.organization_id AND field_value.option_list_value_id = value.id WHERE value.organization_id = $1 AND value.option_list_id = $2 GROUP BY value.id ORDER BY value.sort_order, value.value`,
        [organizationId, listId],
      );
      options = result.rows.map((value: Record<string, unknown>) => ({
        id: Number(value.id),
        value: String(value.value),
        status: value.status as "ACTIVE" | "INACTIVE",
        usedBy: Number(value.used_by),
      }));
      const fields = await this.db.query(
        "SELECT id::int, name, applies_to, data_type FROM custom_field WHERE organization_id = $1 AND option_list_id = $2 ORDER BY name",
        [organizationId, listId],
      );
      usedBy = fields.rows.map((field: Record<string, unknown>) => ({
        id: Number(field.id),
        name: String(field.name),
        appliesTo: String(field.applies_to),
        dataType: String(field.data_type),
      }));
      if (kind === "custom-field") {
        const linkedList = await this.db.query(
          "SELECT is_shared FROM option_list WHERE organization_id=$1 AND id=$2",
          [organizationId, listId],
        );
        linkedOptionListIsShared = Boolean(linkedList.rows[0]?.is_shared);
      }
    }
    const inUseQuery =
      kind === "category"
        ? "SELECT EXISTS(SELECT 1 FROM item WHERE organization_id=$1 AND item_category_id=$2) value"
        : kind === "warehouse"
          ? "SELECT (EXISTS(SELECT 1 FROM inventory_transaction_line WHERE organization_id=$1 AND warehouse_id=$2) OR EXISTS(SELECT 1 FROM inventory_reservation WHERE organization_id=$1 AND warehouse_id=$2) OR EXISTS(SELECT 1 FROM stock_count WHERE organization_id=$1 AND warehouse_id=$2 AND deletion_date IS NULL)) value"
          : kind === "option-list"
            ? "SELECT EXISTS(SELECT 1 FROM custom_field WHERE organization_id=$1 AND option_list_id=$2) value"
            : "SELECT EXISTS(SELECT 1 FROM custom_field_value WHERE organization_id=$1 AND custom_field_id=$2) value";
    const used = await this.db.query(inUseQuery, [organizationId, id]);
    return {
      id: Number(row.id),
      code: row.code == null ? null : String(row.code),
      name: String(row.name),
      description: row.description == null ? "" : String(row.description),
      status: row.status as "ACTIVE" | "INACTIVE",
      inUse: Boolean(used.rows[0]?.value),
      addressLine1: String(row.address_line_1 ?? ""),
      addressLine2: String(row.address_line_2 ?? ""),
      city: String(row.city ?? ""),
      region: String(row.region ?? ""),
      postcode: String(row.postcode ?? ""),
      countryCode: row.country_code == null ? null : String(row.country_code),
      dataType: row.data_type == null ? null : String(row.data_type),
      appliesTo: row.applies_to == null ? null : String(row.applies_to),
      required: Boolean(row.required),
      optionListId:
        row.option_list_id == null ? null : Number(row.option_list_id),
      isShared:
        kind === "option-list"
          ? Boolean(row.is_shared)
          : linkedOptionListIsShared,
      options,
      usedBy,
      audit: normalizeAudit(row),
    };
  }
  async insert(
    organizationId: number,
    kind: ConfigurationKind,
    input: ConfigurationCreate,
    audit: Record<string, unknown>,
  ): Promise<number> {
    const table = tableFor(kind);
    const values: Record<string, unknown> =
      kind === "category"
        ? {
            code: input.code?.trim().toUpperCase(),
            name: input.name.trim(),
            description: input.description?.trim() ?? "",
            status: "ACTIVE",
          }
        : kind === "warehouse"
          ? {
              code: input.code?.trim().toUpperCase(),
              name: input.name.trim(),
              address_line_1: input.addressLine1 ?? "",
              address_line_2: input.addressLine2 ?? "",
              city: input.city ?? "",
              region: input.region ?? "",
              postcode: input.postcode ?? "",
              country_code: input.countryCode ?? null,
              status: "ACTIVE",
            }
          : kind === "option-list"
            ? {
                name: input.name.trim(),
                is_shared: input.isShared ?? true,
                status: "ACTIVE",
              }
            : {
                name: input.name.trim(),
                data_type: input.dataType,
                applies_to: input.appliesTo,
                required: input.required ?? false,
                option_list_id: input.optionListId ?? null,
                status: "ACTIVE",
              };
    Object.assign(values, audit);
    const entries = Object.entries(values);
    const result = await this.db.query(
      `INSERT INTO ${table} (organization_id, ${entries.map(([key]) => key).join(", ")}) VALUES ($1, ${entries.map((_, index) => `$${index + 2}`).join(", ")}) RETURNING id::int`,
      [organizationId, ...entries.map(([, value]) => value)],
    );
    return Number(result.rows[0].id);
  }
  async patch(
    organizationId: number,
    kind: ConfigurationKind,
    id: number,
    input: ConfigurationPatch,
    audit: Record<string, unknown>,
  ): Promise<void> {
    const maps: Record<ConfigurationKind, Record<string, string>> = {
      category: { code: "code", name: "name", description: "description" },
      warehouse: { code: "code", name: "name", addressLine1: "address_line_1", addressLine2: "address_line_2", city: "city", region: "region", postcode: "postcode", countryCode: "country_code" },
      "custom-field": { name: "name", dataType: "data_type", appliesTo: "applies_to", required: "required", optionListId: "option_list_id" },
      "option-list": { name: "name", isShared: "is_shared" },
    };
    const map = maps[kind];
    const row: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input))
      if (value !== undefined && map[key])
        row[map[key]!] =
          key === "code" && typeof value === "string"
            ? value.trim().toUpperCase()
            : typeof value === "string"
              ? value.trim()
              : value;
    Object.assign(row, audit);
    const entries = Object.entries(row);
    await this.db.query(
      `UPDATE ${tableFor(kind)} SET ${entries.map(([key], index) => `${key}=$${index + 3}`).join(", ")} WHERE organization_id=$1 AND id=$2`,
      [organizationId, id, ...entries.map(([, value]) => value)],
    );
  }
  async transition(
    organizationId: number,
    kind: ConfigurationKind,
    ids: number[],
    status: string,
    audit: Record<string, unknown>,
  ) {
    if (status === "DELETED") {
      await this.db.query(
        `DELETE FROM ${tableFor(kind)} WHERE organization_id=$1 AND id=ANY($2::bigint[])`,
        [organizationId, ids],
      );
      return;
    }
    const entries = Object.entries(audit);
    await this.db.query(
      `UPDATE ${tableFor(kind)} SET status=$3, ${entries.map(([key], index) => `${key}=$${index + 4}`).join(", ")} WHERE organization_id=$1 AND id=ANY($2::bigint[])`,
      [organizationId, ids, status, ...entries.map(([, value]) => value)],
    );
  }
  async addOption(
    organizationId: number,
    listId: number,
    value: string,
    audit: Record<string, unknown>,
  ) {
    const entries = Object.entries(audit);
    await this.db.query(
      `INSERT INTO option_list_value (organization_id, option_list_id, value, sort_order, status, ${entries.map(([key]) => key).join(",")}) VALUES ($1,$2,$3,(SELECT COALESCE(MAX(sort_order),0)+1 FROM option_list_value WHERE organization_id=$1 AND option_list_id=$2),'ACTIVE',${entries.map((_, index) => `$${index + 4}`).join(",")})`,
      [
        organizationId,
        listId,
        value.trim(),
        ...entries.map(([, item]) => item),
      ],
    );
  }
  async patchOption(
    organizationId: number,
    listId: number,
    optionId: number,
    input: { value?: string; status?: "ACTIVE" | "INACTIVE" },
    audit: Record<string, unknown>,
  ) {
    const row: Record<string, unknown> = { ...audit };
    if (input.value !== undefined) row.value = input.value.trim();
    if (input.status !== undefined) row.status = input.status;
    const entries = Object.entries(row);
    await this.db.query(
      `UPDATE option_list_value SET ${entries.map(([key], index) => `${key}=$${index + 4}`).join(",")} WHERE organization_id=$1 AND option_list_id=$2 AND id=$3`,
      [organizationId, listId, optionId, ...entries.map(([, value]) => value)],
    );
  }
  async deleteOption(
    organizationId: number,
    listId: number,
    optionId: number,
    audit: Record<string, unknown>,
  ) {
    await this.db.query(
      "DELETE FROM custom_field_value WHERE organization_id=$1 AND option_list_value_id=$2",
      [organizationId, optionId],
    );
    await this.patchOption(
      organizationId,
      listId,
      optionId,
      { status: "INACTIVE" },
      audit,
    );
    await this.db.query(
      "DELETE FROM option_list_value WHERE organization_id=$1 AND option_list_id=$2 AND id=$3",
      [organizationId, listId, optionId],
    );
  }
}
