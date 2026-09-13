import assert from "node:assert/strict";
import { test } from "node:test";
// Tests bootstrap the composed registry; the web server does this at startup.
import "../../../../.run/cross-package-api/index";
import { crossPackageApi } from "@voyzu/capability/cross-package-api";

test("cross-package API: real dispatcher with mock price list item provider", async () => {
  const priceListItem = await crossPackageApi.call(
    "@voyzu/commercial/customer-price-list-items", "get", { id: 1 },
  );
  assert.deepEqual(priceListItem, {
    id: 1, code: "ITEM-001", name: "Example Item", price: 25,
  });
  assert.ok(priceListItem);
  // No provider type import or assertion: the generated registry infers this.
  const price: number = priceListItem.price;
  assert.equal(price, 25);

  const updatedPriceListItem = await crossPackageApi.call(
    "@voyzu/commercial/customer-price-list-items", "update", { id: 1, price: 29.95 },
  );
  assert.deepEqual(updatedPriceListItem, {
    id: 1, code: "ITEM-001", name: "Example Item", price: 29.95,
  });
  assert.deepEqual(
    await crossPackageApi.call("@voyzu/commercial/customer-price-list-items", "get", { id: 1 }),
    priceListItem, // Hard-coded provider: update does not persist changes.
  );
  assert.equal(await crossPackageApi.call("@voyzu/commercial/customer-price-list-items", "get", { id: 999 }), null);
});

test("cross-package API rejects invalid input and missing resources or methods", async () => {
  await assert.rejects(async () => {
    // @ts-expect-error Runtime validation also protects untyped callers.
    await crossPackageApi.call("@voyzu/commercial/customer-price-list-items", "get", { id: "invalid" });
  }, /Invalid .* input/);
  await assert.rejects(async () => {
    // @ts-expect-error Unknown resources are rejected by both TypeScript and runtime.
    await crossPackageApi.call("@voyzu/commercial/missing", "get", { id: 1 });
  }, /Unknown resource/);
  await assert.rejects(async () => {
    // @ts-expect-error Unknown methods are rejected by both TypeScript and runtime.
    await crossPackageApi.call("@voyzu/commercial/customer-price-list-items", "missing", { id: 1 });
  }, /Unknown method/);
});
