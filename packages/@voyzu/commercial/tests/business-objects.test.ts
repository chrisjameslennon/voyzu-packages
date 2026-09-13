import assert from "node:assert/strict";
import { test } from "node:test";

// Recommended API syntax, not an implemented runtime.
// These examples are skipped until businessObjects is implemented.

// The returned record contains data, not retrieval methods.
interface CustomerRecord {
  id: number;
  name: string;
  creditLimit: number;
}

// The service provides operations on customer records.
interface CustomerService {
  get(customerId: number): Promise<CustomerRecord | null>;
  findByCode(customerCode: string): Promise<CustomerRecord | null>;
  update(
    customerId: number,
    changes: { name?: string; creditLimit?: number },
  ): Promise<CustomerRecord>;
}

declare const businessObjects: {
  customer: CustomerService;
};

test.skip("business objects: get a customer by id", async () => {
  const customerId = 1;

  const customer = await businessObjects.customer.get(customerId);

  assert.ok(customer);
  assert.equal(customer.id, customerId);
  assert.equal(customer.name, "Example Customer");
  assert.equal(customer.creditLimit, 5000);
});

test.skip("business objects: find a customer by code", async () => {
  const customerCode = "CUSTOMER-001";

  const customer = await businessObjects.customer.findByCode(customerCode);

  assert.ok(customer);
  assert.equal(customer.id, 1);
  assert.equal(customer.name, "Example Customer");
  assert.equal(customer.creditLimit, 5000);
});

test.skip("business objects: update a customer's credit limit", async () => {
  const customerId = 1;
  const changes = {
    creditLimit: 7500,
  };

  // Commercial updates only its credit-limit contribution.
  // The platform returns the assembled Customer record.
  const updatedCustomer = await businessObjects.customer.update(
    customerId,
    changes,
  );

  assert.equal(updatedCustomer.id, customerId);
  assert.equal(updatedCustomer.name, "Example Customer");
  assert.equal(updatedCustomer.creditLimit, 7500);

  const savedCustomer = await businessObjects.customer.get(customerId);

  assert.ok(savedCustomer);
  assert.equal(savedCustomer.creditLimit, 7500);
});

test.skip("business objects: update a customer's name", async () => {
  const customerId = 1;
  const changes = {
    name: "Renamed Customer",
  };

  // The Party provider updates the shared name field.
  // Commercial's credit-limit contribution remains unchanged.
  const updatedCustomer = await businessObjects.customer.update(
    customerId,
    changes,
  );

  assert.equal(updatedCustomer.id, customerId);
  assert.equal(updatedCustomer.name, "Renamed Customer");
  assert.equal(updatedCustomer.creditLimit, 5000);

  const savedCustomer = await businessObjects.customer.get(customerId);

  assert.ok(savedCustomer);
  assert.equal(savedCustomer.name, "Renamed Customer");
});
