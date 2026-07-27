import { expect, test } from "@playwright/test";
import { Activate, Deactivate, Delete } from "../domain/operation-policy";

test("status policies reject redundant transitions", () => {
  expect(Activate({ code: "VANILLA", status: "ACTIVE" })).toEqual([
    expect.objectContaining({ code: "ALREADY_ACTIVE" }),
  ]);
  expect(Deactivate({ code: "VANILLA", status: "INACTIVE" })).toEqual([
    expect.objectContaining({ code: "ALREADY_INACTIVE" }),
  ]);
});

test("delete is currently permitted for every ice cream", () => {
  expect(Delete({ code: "VANILLA", status: "ACTIVE" })).toEqual([]);
});
