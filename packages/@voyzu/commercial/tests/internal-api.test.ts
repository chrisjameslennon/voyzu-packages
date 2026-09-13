import assert from "node:assert/strict";
import { test } from "node:test";
import Type from "typebox";
import { createInternalApi, createLazyInternalApiResource, resolveInternalApiContracts } from "@voyzu/capability/internal-api";
import type { InternalApiInvoker } from "@voyzu/types/internal-api";
import { internalApi, resetMockData } from "./internal-api.setup";

const definition = {
  dataDefinition: Type.Object({ id: Type.Number() }, { additionalProperties: false }),
  methods: {
    get: {
      input: Type.Object({ id: Type.Number() }, { additionalProperties: false }),
      output: Type.Object({ id: Type.Number() }, { additionalProperties: false }),
    },
  },
};

test("internal API: providers are lazy and cached across concurrent calls", async () => {
  let loads = 0;
  const resource = createLazyInternalApiResource("@example/record", definition, async () => {
    loads++;
    return { get: async ({ id }) => ({ id }) };
  });
  const api = createInternalApi([resource]) as InternalApiInvoker;
  assert.equal(loads, 0);
  assert.deepEqual(await Promise.all([api.call("@example/record", "get", { id: 1 }), api.call("@example/record", "get", { id: 2 })]), [{ id: 1 }, { id: 2 }]);
  assert.equal(loads, 1);
});

test("internal API: input rejected before loading; output rejects extra fields", async () => {
  let loads = 0;
  const api = createInternalApi([createLazyInternalApiResource("@example/record", definition, async () => {
    loads++;
    return { get: async ({ id }) => ({ id, extra: true }) };
  })]) as InternalApiInvoker;
  await assert.rejects(api.call("@example/record", "get", { id: "wrong" }), /Invalid .* input/);
  assert.equal(loads, 0);
  await assert.rejects(api.call("@example/record", "get", { id: 1 }), /Invalid .* output/);
});

test("internal API: absent providers and missing methods fail explicitly", async () => {
  const missing = createInternalApi([createLazyInternalApiResource("@example/record", definition)]) as InternalApiInvoker;
  await assert.rejects(missing.call("@example/record", "get", { id: 1 }), /No implementation/);
  await assert.rejects(missing.call("@example/record", "constructor", {}), /Unknown method/);
  const incomplete = createInternalApi([createLazyInternalApiResource("@example/record", definition, async () => ({}))]) as InternalApiInvoker;
  await assert.rejects(incomplete.call("@example/record", "get", { id: 1 }), /Missing implementation/);
});

test("internal API: composition rejects duplicate definitions, providers and unknown contracts", () => {
  const owner = { name: "@example", contracts: { defines: { "@example/record": definition } } };
  const provider = { name: "@provider", contracts: { implements: { "@example/record": async () => ({ get: async ({ id }: { id: number }) => ({ id }) }) } } };
  assert.throws(() => resolveInternalApiContracts([owner, owner]), /Duplicate definition/);
  assert.throws(() => resolveInternalApiContracts([owner, provider, provider]), /Duplicate implementation/);
  assert.throws(() => resolveInternalApiContracts([provider]), /Undefined resource/);
  assert.throws(() => resolveInternalApiContracts([{ name: "@other", contracts: owner.contracts }]), /Invalid resource/);
});

test("internal API: composed customer lookup and missing records", async () => {
  resetMockData();
  const customer = await internalApi.call("@core/customer", "findByCode", { code: "CUSTOMER-001" });
  assert.equal(customer?.account.creditLimit, 5000);
  assert.equal(await internalApi.call("@core/customer", "get", { id: 999 }), null);
  assert.equal(await internalApi.call("@core/customer", "findByCode", { code: "MISSING" }), null);
});
