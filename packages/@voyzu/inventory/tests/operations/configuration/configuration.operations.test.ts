import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import {
  addInventoryOptionValue,
  createInventoryConfiguration,
  deleteInventoryOptionValue,
  getInventoryConfiguration,
  listInventoryConfiguration,
  patchInventoryConfiguration,
  patchInventoryOptionValue,
  transitionInventoryConfiguration,
} from "../../../modules/configuration/operations";
import {
  createTestOrganization,
  disposeTestOrganization,
  type TestOrganization,
} from "../support/test-organization";

let organization: TestOrganization | undefined;

before(async () => {
  organization = await createTestOrganization("CFG");
});

after(async () => {
  await disposeTestOrganization(organization);
});

test("configuration commands expose category and warehouse lifecycles", async () => {
  const organizationId = organization!.id;
  const category = await createInventoryConfiguration(
    organizationId,
    "category",
    { code: "TESTCAT", name: "Test category", description: "Original" },
  );
  assert.equal(category.code, "TESTCAT");
  assert.equal(
    (await getInventoryConfiguration(organizationId, "category", category.id))
      ?.name,
    "Test category",
  );
  assert.ok(
    (await listInventoryConfiguration(organizationId, "category")).some(
      ({ id }) => id === category.id,
    ),
  );

  const patched = await patchInventoryConfiguration(
    organizationId,
    "category",
    category.id,
    { name: "Changed category", description: "Changed" },
  );
  assert.equal(patched.name, "Changed category");
  assert.equal(patched.description, "Changed");

  assert.equal(
    (
      await transitionInventoryConfiguration(
        organizationId,
        "category",
        [category.id],
        "INACTIVE",
      )
    )[0]?.status,
    "INACTIVE",
  );
  assert.equal(
    (
      await transitionInventoryConfiguration(
        organizationId,
        "category",
        [category.id],
        "ACTIVE",
      )
    )[0]?.status,
    "ACTIVE",
  );

  const warehouse = await createInventoryConfiguration(
    organizationId,
    "warehouse",
    { code: "TESTWH", name: "Test warehouse", city: "Auckland" },
  );
  assert.equal(warehouse.city, "Auckland");
  assert.deepEqual(
    await transitionInventoryConfiguration(
      organizationId,
      "warehouse",
      [warehouse.id],
      "DELETED",
    ),
    [],
  );
  assert.equal(
    await getInventoryConfiguration(organizationId, "warehouse", warehouse.id),
    null,
  );
});

test("configuration commands expose custom fields and option values", async () => {
  const organizationId = organization!.id;
  const optionList = await createInventoryConfiguration(
    organizationId,
    "option-list",
    { name: "Test choices", isShared: true },
  );
  const withOption = await addInventoryOptionValue(
    organizationId,
    optionList.id,
    { value: "First choice" },
  );
  const option = withOption.options.find(
    ({ value }) => value === "First choice",
  );
  assert.ok(option);

  const renamed = await patchInventoryOptionValue(
    organizationId,
    optionList.id,
    option.id,
    { value: "Renamed choice", status: "INACTIVE" },
  );
  assert.equal(
    renamed.options.find(({ id }) => id === option.id)?.value,
    "Renamed choice",
  );
  assert.equal(
    renamed.options.find(({ id }) => id === option.id)?.status,
    "INACTIVE",
  );

  const customField = await createInventoryConfiguration(
    organizationId,
    "custom-field",
    {
      name: "Test selection",
      dataType: "OPTION",
      appliesTo: "ITEM",
      optionListId: optionList.id,
      required: false,
    },
  );
  assert.equal(customField.optionListId, optionList.id);

  const withoutOption = await deleteInventoryOptionValue(
    organizationId,
    optionList.id,
    option.id,
  );
  assert.ok(!withoutOption.options.some(({ id }) => id === option.id));
});

test("configuration commands enforce required kind-specific fields", async () => {
  await assert.rejects(
    createInventoryConfiguration(organization!.id, "category", {
      name: "Missing code",
    }),
    /code is required/i,
  );
  await assert.rejects(
    createInventoryConfiguration(organization!.id, "custom-field", {
      name: "Missing type",
    }),
    /data type and applies to are required/i,
  );
});
