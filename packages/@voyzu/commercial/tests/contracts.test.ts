import assert from "node:assert/strict";
import { test } from "node:test";
import { PartyDefinition, type PartyContract } from "@voyzu/types/business-objects/party";
import { CustomerDefinition, type CustomerContract } from "@voyzu/types/business-objects/customer";
import { CustomerAccountDefinition, type CustomerAccountContract } from "@voyzu/types/business-objects/customer-account";
import { CustomerPriceListDefinition, type CustomerPriceListContract } from "../modules/customers/contracts/customer-price-list.definition";
import { CustomerPriceListItemDefinition, type CustomerPriceListItemContract } from "../modules/customers/contracts/customer-price-list-item.definition";

test("whole contracts include data and method definitions", () => {
  const party = { ...PartyDefinition } satisfies PartyContract;
  const customer = { ...CustomerDefinition } satisfies CustomerContract;
  const account = { ...CustomerAccountDefinition } satisfies CustomerAccountContract;
  const priceList = { ...CustomerPriceListDefinition } satisfies CustomerPriceListContract;
  const item = { ...CustomerPriceListItemDefinition } satisfies CustomerPriceListItemContract;

  for (const contract of [party, customer, account, priceList, item]) {
    assert.deepEqual(Object.keys(contract), ["dataDefinition", "methods"]);
    assert.equal(contract.dataDefinition.type, "object");
    assert.ok(contract.methods.get.input);
    assert.ok(contract.methods.get.output);
  }
});

// Compile-time checks: a complete contract is neither a data record nor a handler object.
function checkContractTypes() {
  // @ts-expect-error The methods node is required.
  const missingMethods: PartyContract = { dataDefinition: PartyDefinition.dataDefinition };
  // @ts-expect-error The dataDefinition node is required.
  const missingData: CustomerContract = { methods: CustomerDefinition.methods };
  // @ts-expect-error A data record is not a contract definition.
  const record: PartyContract = { id: 1, code: "PARTY-001", name: "Example" };
  // @ts-expect-error A callable implementation is not a schema definition.
  const implementation: CustomerAccountContract = { get: async () => null };
  // @ts-expect-error A price-list contract is not a price-list-item contract.
  const wrongContract: CustomerPriceListItemContract = CustomerPriceListDefinition;
  return { missingMethods, missingData, record, implementation, wrongContract };
}
void checkContractTypes;
