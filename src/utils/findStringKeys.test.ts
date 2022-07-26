import { findStringKeys } from "./findStringKeys";

describe("findStringKeys", () => {
  test("returns empty array for empty object", () => {
    expect(findStringKeys({})).toEqual([]);
  });

  test("returns empty array for object with array", () => {
    expect(findStringKeys({ value: ["string"] })).toEqual([]);
  });

  test("returns key related to string", () => {
    expect(findStringKeys({ value: "string" })).toEqual(["value"]);
  });

  test("returns key related to object with string", () => {
    expect(findStringKeys({ value: { child: "string" } })).toEqual([
      "value.child",
    ]);
  });

  test("returns key related to nested object with string", () => {
    expect(
      findStringKeys({
        value: { child: { grandchild: "string" }, child2: "text" },
      })
    ).toEqual(["value.child2", "value.child.grandchild"]);
  });
});
