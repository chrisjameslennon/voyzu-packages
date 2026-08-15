import { randomUUID } from "node:crypto";
import { expect, test as base } from "@playwright/test";
import { getDb } from "@voyzu/capability/db";

import type { TemplateCreateRequestDto } from "../../types";
import { createTemplate } from "../server";

interface TemplateFixture {
  uniqueCode(): string;
  input(overrides?: Partial<TemplateCreateRequestDto>): TemplateCreateRequestDto;
  create(overrides?: Partial<TemplateCreateRequestDto>): ReturnType<typeof createTemplate>;
  track(code: string): void;
}

export const test = base.extend<{ templates: TemplateFixture }>({
  templates: async ({}, use, testInfo) => {
    const codes = new Set<string>();
    let sequence = 0;
    const uniqueCode = () => [
      "TEST",
      testInfo.workerIndex.toString(36),
      (sequence++).toString(36),
      randomUUID().replaceAll("-", "").slice(0, 6),
    ].join("_").toUpperCase();

    const fixture: TemplateFixture = {
      uniqueCode,
      input: (overrides = {}) => ({
        code: uniqueCode(),
        description: "Playwright template",
        ...overrides,
      }),
      async create(overrides = {}) {
        const created = await createTemplate(this.input(overrides));
        codes.add(created.code);
        return created;
      },
      track: (code) => codes.add(code),
    };

    try {
      await use(fixture);
    } finally {
      const ownedCodes = [...codes];
      if (!ownedCodes.length) return;
      const db = getDb();
      await db.query(
        `DELETE FROM audit_change
          WHERE audit_event_id IN (
            SELECT id FROM audit_event
            WHERE entity_type = 'template' AND entity_code = ANY($1::text[])
          )`,
        [ownedCodes],
      );
      await db.query(
        "DELETE FROM audit_event WHERE entity_type = 'template' AND entity_code = ANY($1::text[])",
        [ownedCodes],
      );
      await db.query("DELETE FROM template WHERE code = ANY($1::text[])", [ownedCodes]);
    }
  },
});

export { expect };
