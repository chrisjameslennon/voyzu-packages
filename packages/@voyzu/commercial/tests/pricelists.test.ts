import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { internalApi, resetMockData } from "./internal-api.mock";

// JSON-backed prototype examples, not platform-dispatcher validation tests.
beforeEach(resetMockData);

test("price lists: get a list and its items", async () => {
  const priceList = await internalApi.call(
    "@voyzu/commercial/customer-price-lists", "get", { id: 1 },
  );

  assert.ok(priceList);
  assert.equal(priceList.name, "Standard Customer Prices");
  assert.equal(priceList.items.length, 2);
  assert.equal(priceList.items[0].code, "ITEM-001");
  assert.equal(priceList.items[0].price, 25);
});

test("price lists: update a list name", async () => {
  await internalApi.call(
    "@voyzu/commercial/customer-price-lists", "update",
    { id: 1, changes: { name: "Preferred Customer Prices" } },
  );

  const savedList = await internalApi.call(
    "@voyzu/commercial/customer-price-lists", "get", { id: 1 },
  );
  assert.ok(savedList);
  assert.equal(savedList.name, "Preferred Customer Prices");
});

test("price lists: update an item and retrieve the changed price", async () => {
  const item = await internalApi.call(
    "@voyzu/commercial/customer-price-list-items", "get", { id: 1 },
  );
  assert.ok(item);
  assert.equal(item.price, 25);

  const updatedItem = await internalApi.call(
    "@voyzu/commercial/customer-price-list-items", "update", { id: 1, price: 29.95 },
  );
  assert.equal(updatedItem.price, 29.95);

  const savedItem = await internalApi.call(
    "@voyzu/commercial/customer-price-list-items", "get", { id: 1 },
  );
  assert.ok(savedItem);
  assert.equal(savedItem.price, 29.95);

  const priceList = await internalApi.call(
    "@voyzu/commercial/customer-price-lists", "get", { id: 1 },
  );
  assert.ok(priceList);
  assert.equal(priceList.items[0].price, 29.95);
});

test("price lists: missing records return null", async () => {
  assert.equal(await internalApi.call(
    "@voyzu/commercial/customer-price-lists", "get", { id: 999 },
  ), null);
  assert.equal(await internalApi.call(
    "@voyzu/commercial/customer-price-list-items", "get", { id: 999 },
  ), null);
});
