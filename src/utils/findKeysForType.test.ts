import { findKeysForType } from "./findKeysForType";

describe("findStringKeys", () => {
  test("returns empty array for empty object", () => {
    expect(findKeysForType({}, "string")).toEqual([]);
  });

  test("returns empty array for object with array", () => {
    expect(findKeysForType({ value: ["string"] }, "string")).toEqual([]);
  });

  test("returns key related to string", () => {
    expect(findKeysForType({ value: "string" }, "string")).toEqual(["value"]);
  });

  test("returns key related to object with string", () => {
    expect(findKeysForType({ value: { child: "string" } }, "string")).toEqual([
      "value.child",
    ]);
  });

  test("returns key related to nested object with string", () => {
    expect(
      findKeysForType(
        {
          value: { child: { grandchild: "string" }, child2: "text" },
        },
        "string"
      )
    ).toEqual(["value.child2", "value.child.grandchild"]);
  });
});
