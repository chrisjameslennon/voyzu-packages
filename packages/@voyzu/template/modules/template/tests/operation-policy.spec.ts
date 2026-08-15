import { expect, test } from "@playwright/test";
import { Activate, Deactivate, Delete } from "../domain/operation-policy";

test("status policies reject redundant transitions", () => {
  expect(Activate({ code: "EXAMPLE", status: "ACTIVE" })).toEqual([
    expect.objectContaining({ code: "ALREADY_ACTIVE" }),
  ]);
  expect(Deactivate({ code: "EXAMPLE", status: "INACTIVE" })).toEqual([
    expect.objectContaining({ code: "ALREADY_INACTIVE" }),
  ]);
});

test("delete is currently permitted for every template", () => {
  expect(Delete({ code: "EXAMPLE", status: "ACTIVE" })).toEqual([]);
});
