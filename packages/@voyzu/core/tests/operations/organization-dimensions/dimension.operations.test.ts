import assert from "node:assert/strict";
import { describe, it, before, after } from "node:test";

import type { DimensionCreateRequestDto } from "@voyzu/core/types/modules/dimensions/dimension.create.request.dto";
import type { DimensionPatchRequestDto } from "@voyzu/core/types/modules/dimensions/dimension.patch.request.dto";
import type { DimensionResponseDto } from "@voyzu/core/types/modules/dimensions/dimension.response.dto";
import type { DimensionUpdateRequestDto } from "@voyzu/core/types/modules/dimensions/dimension.update.request.dto";

import { getPool } from "@voyzu/capability/db";
import {
  createDimension,
  getDimension,
  updateDimension,
  patchDimension,
  deleteDimension,
  listDimensions,
  filterDimensions,
  searchDimensions,
  batchCreateDimensions,
  batchGetDimensions,
  batchUpdateDimensions,
  batchPatchDimensions,
  batchDeleteDimensions
} from "../../../modules/organization-dimensions/operations";

const createdCodes: string[] = [];
const testCodes = ["SVC-DIM-A", "SVC-DIM-B", "SVC-DIM-C", "SVC-DIM-D"];

before(async () => {
  await batchDeleteDimensions(testCodes);
});

after(async () => {
  if (createdCodes.length) {
    try {
      await batchDeleteDimensions([...createdCodes]);
    } catch {
      // best-effort cleanup
    }
  }
  await getPool().end();
});

describe("dimension.service", () => {
  it("creates a dimension", async () => {
    const input: DimensionCreateRequestDto = {
      code: "SVC-DIM-A",
      name: "Service Test Dimension A",
    };
    const dimension: DimensionResponseDto = await createDimension(input);
    createdCodes.push(dimension.code);

    assert.equal(dimension.code, "SVC-DIM-A");
    assert.equal(dimension.name, "Service Test Dimension A");
    assert.equal(dimension.status, "ACTIVE");
    assert.ok(dimension.id > 0);
    assert.ok(dimension.audit.created.date);
    assert.ok(dimension.audit.updated.date);
  });

  it("creates a second dimension", async () => {
    const input: DimensionCreateRequestDto = { code: "SVC-DIM-B", name: "Service Test Dimension B" };
    const dimension: DimensionResponseDto = await createDimension(input);
    createdCodes.push(dimension.code);

    assert.equal(dimension.code, "SVC-DIM-B");
  });

  it("gets a dimension by code", async () => {
    const dimension = await getDimension("SVC-DIM-A");
    assert.ok(dimension);
    assert.equal(dimension.code, "SVC-DIM-A");
    assert.equal(dimension.name, "Service Test Dimension A");
  });

  it("returns null for a non-existent code", async () => {
    const dimension = await getDimension("DOES-NOT-EXIST");
    assert.equal(dimension, null);
  });

  it("updates a dimension by code (full replace)", async () => {
    const input: DimensionUpdateRequestDto = {
      code: "SVC-DIM-A",
      name: "Service Test Dimension A Updated",
      status: "INACTIVE",
    };
    const dimension = await updateDimension("SVC-DIM-A", input);

    assert.equal(dimension.name, "Service Test Dimension A Updated");
    assert.equal(dimension.status, "INACTIVE");
  });

  it("patches a dimension (partial update)", async () => {
    const input: DimensionPatchRequestDto = { name: "Service Test Dimension A Patched", status: "ACTIVE" };
    const dimension: DimensionResponseDto = await patchDimension("SVC-DIM-A", input);

    assert.equal(dimension.name, "Service Test Dimension A Patched");
    assert.equal(dimension.status, "ACTIVE");
  });

  it("lists all dimensions (includes test dimensions)", async () => {
    const dimensions: DimensionResponseDto[] = await listDimensions();
    const testCodes = dimensions.map((d) => d.code).filter((c) => c.startsWith("SVC-DIM-"));
    assert.ok(testCodes.includes("SVC-DIM-A"));
    assert.ok(testCodes.includes("SVC-DIM-B"));
  });

  it("filters dimensions by status", async () => {
    const dimensions = await filterDimensions([{ field: "status", operator: "=", value: "ACTIVE" }]);
    const testDims = dimensions.filter((d) => d.code.startsWith("SVC-DIM-"));
    assert.ok(testDims.length >= 1);
  });

  it("searches dimensions by phrase", async () => {
    const dimensions = await searchDimensions("Patched");
    const found = dimensions.find((d) => d.code === "SVC-DIM-A");
    assert.ok(found);
  });
  it("batch creates dimensions", async () => {
    const inputs: DimensionCreateRequestDto[] = [
      { code: "SVC-DIM-C", name: "Service Test Dimension C" },
      { code: "SVC-DIM-D", name: "Service Test Dimension D" },
    ];
    const dimensions = await batchCreateDimensions(inputs);
    for (const d of dimensions) createdCodes.push(d.code);

    assert.equal(dimensions.length, 2);
    assert.equal(dimensions[0].code, "SVC-DIM-C");
    assert.equal(dimensions[1].code, "SVC-DIM-D");
  });

  it("batch gets dimensions by codes", async () => {
    const dimensions = await batchGetDimensions(["SVC-DIM-A", "SVC-DIM-B"]);
    assert.equal(dimensions.length, 2);
    const codes = dimensions.map((d) => d.code);
    assert.ok(codes.includes("SVC-DIM-A"));
    assert.ok(codes.includes("SVC-DIM-B"));
  });

  it("batch updates dimensions (full replace)", async () => {
    const inputs: DimensionUpdateRequestDto[] = [
      { code: "SVC-DIM-C", name: "Service Test Dimension C Updated", status: "INACTIVE" },
      { code: "SVC-DIM-D", name: "Service Test Dimension D Updated", status: "INACTIVE" },
    ];
    const dimensions = await batchUpdateDimensions(inputs);

    assert.equal(dimensions.length, 2);
    assert.equal(dimensions[0].name, "Service Test Dimension C Updated");
    assert.equal(dimensions[0].status, "INACTIVE");
    assert.equal(dimensions[1].name, "Service Test Dimension D Updated");
    assert.equal(dimensions[1].status, "INACTIVE");
  });

  it("batch patches dimensions (partial update)", async () => {
    const inputs: Array<DimensionPatchRequestDto & { code: string }> = [
      { code: "SVC-DIM-C", name: "Service Test Dimension C Patched", status: "ACTIVE" },
      { code: "SVC-DIM-D", name: "Service Test Dimension D Patched", status: "ACTIVE" },
    ];
    const dimensions = await batchPatchDimensions(inputs);

    assert.equal(dimensions.length, 2);
    assert.equal(dimensions[0].name, "Service Test Dimension C Patched");
    assert.equal(dimensions[0].status, "ACTIVE");
    assert.equal(dimensions[1].name, "Service Test Dimension D Patched");
    assert.equal(dimensions[1].status, "ACTIVE");
  });

  it("deletes a single dimension by code", async () => {
    const code = createdCodes.shift()!;
    await deleteDimension(code);

    const dimension = await getDimension(code);
    assert.equal(dimension, null);
  });

  it("batch deletes remaining dimensions", async () => {
    await batchDeleteDimensions([...createdCodes]);

    for (const code of createdCodes) {
      const dimension = await getDimension(code);
      assert.equal(dimension, null);
    }

    createdCodes.length = 0;
  });

  it("validates required fields on create", async () => {
    await assert.rejects(
      () => createDimension({ code: "", name: "" }),
      (err: Error) => {
        assert.ok(err.message.includes("Code is required"));
        assert.ok(err.message.includes("Name is required"));
        return true;
      },
    );
  });

  it("validates patch - empty code is rejected", async () => {
    await assert.rejects(
      () => patchDimension("SVC-DIM-A", { code: "" }),
      (err: Error) => {
        assert.ok(err.message.includes("Code cannot be empty"));
        return true;
      },
    );
  });

  it("validates patch - invalid status is rejected", async () => {
    await assert.rejects(
      () => patchDimension("SVC-DIM-A", { status: "DELETED" as never }),
      (err: Error) => {
        assert.ok(err.message.includes("Status must be ACTIVE or INACTIVE"));
        return true;
      },
    );
  });
});

