import { randomUUID } from "node:crypto";
import { test as base, expect } from "@playwright/test";
import { getDb } from "@voyzu/capability/db";

import type { IceCreamCreateRequestDto } from "../../types";
import { createIceCream } from "../server";

interface IceCreamFixture {
  uniqueCode(): string;
  input(overrides?: Partial<IceCreamCreateRequestDto>): IceCreamCreateRequestDto;
  create(overrides?: Partial<IceCreamCreateRequestDto>): ReturnType<typeof createIceCream>;
  track(code: string): void;
}

export const test = base.extend<{ iceCreams: IceCreamFixture }>({
  iceCreams: async ({}, use, testInfo) => {
    const codes = new Set<string>();
    let sequence = 0;
    const uniqueCode = () => [
      "TEST",
      testInfo.workerIndex.toString(36),
      (sequence++).toString(36),
      randomUUID().replaceAll("-", "").slice(0, 6),
    ].join("_").toUpperCase();

    const fixture: IceCreamFixture = {
      uniqueCode,
      input: (overrides = {}) => ({
        code: uniqueCode(),
        name: "Test Vanilla",
        flavorCode: "VANILLA",
        supplier: "Playwright Creamery",
        ...overrides,
      }),
      async create(overrides = {}) {
        const created = await createIceCream(this.input(overrides));
        codes.add(created.code);
        return created;
      },
      track: (code) => codes.add(code),
    };

    try {
      await use(fixture);
    } finally {
      const db = getDb();
      const ownedCodes = [...codes];
      if (ownedCodes.length) {
        await db.query(
          `DELETE FROM audit_change
            WHERE audit_event_id IN (
              SELECT id FROM audit_event
              WHERE entity_type = 'ice_cream' AND entity_code = ANY($1::text[])
            )`,
          [ownedCodes],
        );
        await db.query(
          "DELETE FROM audit_event WHERE entity_type = 'ice_cream' AND entity_code = ANY($1::text[])",
          [ownedCodes],
        );
        await db.query("DELETE FROM ice_cream WHERE code = ANY($1::text[])", [ownedCodes]);
      }
    }
  },
});

export { expect };
