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
  const owner = { name: "@example", contracts: { internalApi: { defines: { "@example/record": definition } } } };
  const provider = { name: "@provider", contracts: { internalApi: { implements: { "@example/record": async () => ({ get: async ({ id }: { id: number }) => ({ id }) }) } } } };
  assert.throws(() => resolveInternalApiContracts([owner, owner]), /Duplicate definition/);
  assert.throws(() => resolveInternalApiContracts([owner, provider, provider]), /Duplicate implementation/);
  assert.throws(() => resolveInternalApiContracts([provider]), /Undefined resource/);
  assert.throws(() => resolveInternalApiContracts([{ name: "@other", contracts: owner.contracts }]), /Invalid resource/);
});

test("internal API: namespace ownership distinguishes implementation and composition", () => {
  const load = async () => ({ get: async ({ id }: { id: number }) => ({ id }) });
  const platform = { name: "@voyzu/business-objects", isPlatform: true };
  const shared = { defines: { "@erp/example": definition } };
  assert.throws(() => resolveInternalApiContracts([{ ...platform, contracts: { internalApi: { ...shared, implements: { "@erp/example": load } } } }]), /ownership/);
  const resolved = resolveInternalApiContracts([{ ...platform, contracts: { internalApi: { ...shared, composes: { "@erp/example": load } } } }]);
  assert.equal(resolved.providers.get("@erp/example")?.section, "composes");
  assert.throws(() => resolveInternalApiContracts([{ ...platform, contracts: { internalApi: { defines: { "@core/example": definition } } } }]), /requires a Platform implementation/);
  assert.throws(() => resolveInternalApiContracts([{ name: "@example", contracts: { internalApi: { implements: { "@core/example": load } } } }]), /ownership/);
  assert.throws(() => resolveInternalApiContracts([{ name: "@example", contracts: { internalApi: shared } }]), /Invalid resource/);
});

test("internal API: composed customer lookup and missing records", async () => {
  resetMockData();
  const customer = await internalApi.call("@erp/customer", "findByCode", { code: "CUSTOMER-001" });
  assert.equal(customer?.account.creditLimit, 5000);
  assert.equal(await internalApi.call("@erp/customer", "get", { party_id: 999 }), null);
  assert.equal(await internalApi.call("@erp/customer", "findByCode", { code: "MISSING" }), null);
});

test("internal API: has checks registration without loading providers", () => {
  let loads = 0;
  const api = createInternalApi([
    createLazyInternalApiResource("@example/record", definition, async () => {
      loads++;
      return { get: async ({ id }) => ({ id }) };
    }),
    createLazyInternalApiResource("@example/unimplemented", definition),
  ]);
  assert.equal(api.has("@example/record"), true);
  assert.equal(api.has("@example/record", "get"), true);
  assert.equal(api.has("@example/record", "constructor"), false);
  assert.equal(api.has("@example/unimplemented"), false);
  assert.equal(api.has("@example/missing"), false);
  assert.equal(loads, 0);
});

test("internal API: optional retrieval returns null only for absent resources/providers", async () => {
  const api = createInternalApi([createLazyInternalApiResource("@example/record", definition)]) as InternalApiInvoker;
  assert.equal(await api.callOptional("@example/record", "get", { id: 1 }), null);
  assert.equal(await api.callOptional("@example/missing", "get", { id: 1 }), null);
  await assert.rejects(api.call("@example/record", "get", { id: 1 }), /No implementation/);
});

test("internal API: optional calls preserve results and validation errors", async () => {
  const api = createInternalApi([createLazyInternalApiResource("@example/record", definition, async () => ({
    get: async ({ id }) => id === 2 ? { id, extra: true } : { id },
  }))]) as InternalApiInvoker;
  assert.deepEqual(await api.callOptional("@example/record", "get", { id: 1 }), { id: 1 });
  await assert.rejects(api.callOptional("@example/record", "get", { id: "wrong" }), /Invalid .* input/);
  await assert.rejects(api.callOptional("@example/record", "get", { id: 2 }), /Invalid .* output/);
  await assert.rejects(api.callOptional("@example/record", "missing", { id: 1 }), /Unknown method/);
});

test("internal API: optional calls do not hide loader or handler failures", async () => {
  const failure = new Error("Provider failed");
  for (const load of [
    async () => { throw failure; },
    async () => ({ get: async () => { throw failure; } }),
    async () => ({}),
  ]) {
    const api = createInternalApi([createLazyInternalApiResource("@example/record", definition, load)]) as InternalApiInvoker;
    await assert.rejects(api.callOptional("@example/record", "get", { id: 1 }));
  }
});

test("internal API: composed registry exposes has and typed optional calls", async () => {
  resetMockData();
  assert.equal(internalApi.has("@erp/customer", "get"), true);
  assert.equal(internalApi.has("@absent/resource"), false);
  const customer = await internalApi.callOptional("@erp/customer", "get", { party_id: 1 });
  assert.equal(customer?.account.creditLimit, 5000);
  assert.equal(await internalApi.callOptional("@erp/customer", "get", { party_id: 999 }), null);
});
