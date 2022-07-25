import { Editor, EditorState } from "./NewEditor";

export const exampleState: EditorState = {
  scope: {
    items: [
      { id: 1, title: "Do something", completed: true },
      { id: 2, title: "Do something else", completed: false },
    ],
  },
  tree: [
    {
      id: ":ab1:",
      blockType: "view",
      type: "ForEach",
      args: {
        data: "items",
        id: "id",
        scopeVariable: "item",
        content: [
          {
            id: ":ab5:",
            blockType: "view",
            type: "HStack",
            args: {
              content: [
                {
                  id: ":ab2:",
                  blockType: "control",
                  type: "if",
                  args: {
                    condition: "$0.completed",
                    content: [
                      {
                        id: ":ab3:",
                        blockType: "view",
                        type: "Image",
                        args: {
                          systemName: "checkmark",
                        },
                        modifiers: [],
                      },
                    ],
                  },
                },
                {
                  id: ":ab4:",
                  blockType: "view",
                  type: "Text",
                  args: {
                    value: "$0.title",
                  },
                  modifiers: [
                    {
                      id: ":cd1:",
                      blockType: "modifier",
                      type: "background",
                      args: {
                        content: [
                          {
                            id: ":ab9:",
                            blockType: "view",
                            type: "Color",
                            args: {
                              value: "red",
                            },
                            modifiers: [],
                          },
                        ],
                      },
                    },
                    {
                      id: ":cd2:",
                      blockType: "modifier",
                      type: "font",
                      args: {
                        value: "body",
                      },
                    },
                  ],
                },
              ],
            },
            modifiers: [],
          },
        ],
      },
      modifiers: [],
    },
  ],
};

describe("NewEditor", () => {
  describe(".insert(blockOrModifier:id:)", () => {
    test("throws error on modifier in top-level", () => {
      expect(() =>
        new Editor({ scope: {}, tree: [] }).insert(
          {
            id: ":cd1:",
            blockType: "modifier",
            type: "font",
            args: {
              value: "title",
            },
          },
          null
        )
      ).toThrowError(new Error("Cannot add modifier to root state."));
    });

    test("adds block (control or view) to top-level", () => {
      expect(
        new Editor({ scope: {}, tree: [] }).insert(
          {
            id: ":ab1:",
            blockType: "view",
            type: "Text",
            args: {
              value: "Text",
            },
            modifiers: [],
          },
          null
        )
      ).toEqual(
        new Editor({
          scope: {},
          tree: [
            {
              id: ":ab1:",
              blockType: "view",
              type: "Text",
              args: {
                value: "Text",
              },
              modifiers: [],
            },
          ],
        })
      );
    });

    test("throws error on parent not found", () => {
      expect(() =>
        new Editor({ scope: {}, tree: [] }).insert(
          {
            id: ":ab1:",
            blockType: "modifier",
            type: "font",
            args: {
              value: "title",
            },
          },
          ":ab2:"
        )
      ).toThrowError(new Error("Parent not found."));
    });

    test("throws error when modifier inserted into modifier", () => {
      expect(() =>
        new Editor({
          scope: {},
          tree: [
            {
              id: ":ab1:",
              blockType: "view",
              type: "Text",
              args: {
                value: "Text",
              },
              modifiers: [
                {
                  id: ":cd1:",
                  blockType: "modifier",
                  type: "font",
                  args: {
                    value: "body",
                  },
                },
              ],
            },
          ],
        }).insert(
          {
            id: ":cd2:",
            blockType: "modifier",
            type: "font",
            args: {
              value: "body",
            },
          },
          ":cd1:"
        )
      ).toThrowError(new Error("Cannot add modifier to modifier."));
    });

    test("throws error when modifier inserted into control", () => {
      expect(() =>
        new Editor({
          scope: {},
          tree: [
            {
              id: ":ab1:",
              blockType: "control",
              type: "if",
              args: {
                condition: "true",
                content: [],
              },
            },
          ],
        }).insert(
          {
            id: ":cd2:",
            blockType: "modifier",
            type: "font",
            args: {
              value: "body",
            },
          },
          ":ab1:"
        )
      ).toThrowError(new Error("Cannot add modifier to control."));
    });

    test("adds modifier to view", () => {
      expect(
        new Editor({
          scope: {},
          tree: [
            {
              id: ":ab1:",
              blockType: "view",
              type: "HStack",
              args: {
                content: [],
              },
              modifiers: [],
            },
          ],
        }).insert(
          {
            id: ":cd1:",
            blockType: "modifier",
            type: "font",
            args: {
              value: "body",
            },
          },
          ":ab1:"
        )
      ).toEqual(
        new Editor({
          scope: {},
          tree: [
            {
              id: ":ab1:",
              blockType: "view",
              type: "HStack",
              args: {
                content: [],
              },
              modifiers: [
                {
                  id: ":cd1:",
                  blockType: "modifier",
                  type: "font",
                  args: {
                    value: "body",
                  },
                },
              ],
            },
          ],
        })
      );
    });

    test("throws error on invalid parent", () => {
      expect(() =>
        new Editor({
          scope: {},
          tree: [
            {
              id: ":ab1:",
              blockType: "view",
              type: "Text",
              args: {
                value: "Text",
              },
              modifiers: [],
            },
          ],
        }).insert(
          {
            id: ":ab2:",
            blockType: "view",
            type: "Text",
            args: {
              value: "Text",
            },
            modifiers: [],
          },
          ":ab1:"
        )
      ).toThrowError(new Error("Invalid parent."));
    });

    test("inserts view or control to given parent", () => {
      expect(
        new Editor({
          scope: {},
          tree: [
            {
              id: ":ab1:",
              blockType: "view",
              type: "HStack",
              args: {
                content: [
                  {
                    id: ":ab2:",
                    blockType: "control",
                    type: "if",
                    args: {
                      condition: "true",
                      content: [],
                    },
                  },
                ],
              },
              modifiers: [],
            },
          ],
        }).insert(
          {
            id: ":ab3",
            blockType: "view",
            type: "Color",
            args: {
              value: "blue",
            },
            modifiers: [],
          },
          ":ab2:"
        )
      ).toEqual(
        new Editor({
          scope: {},
          tree: [
            {
              id: ":ab1:",
              blockType: "view",
              type: "HStack",
              args: {
                content: [
                  {
                    id: ":ab2:",
                    blockType: "control",
                    type: "if",
                    args: {
                      condition: "true",
                      content: [
                        {
                          id: ":ab3",
                          blockType: "view",
                          type: "Color",
                          args: {
                            value: "blue",
                          },
                          modifiers: [],
                        },
                      ],
                    },
                  },
                ],
              },
              modifiers: [],
            },
          ],
        })
      );
    });
  });

  describe(".select(id:)", () => {
    test("searches content within blocks", () => {
      expect(new Editor(exampleState).select(":ab2:")).toEqual({
        path: [
          { type: "block", index: 0 },
          { type: "block", index: 0 },
          { type: "block", index: 0 },
        ],
        item: {
          id: ":ab2:",
          blockType: "control",
          type: "if",
          args: {
            condition: "$0.completed",
            content: [
              {
                id: ":ab3:",
                blockType: "view",
                type: "Image",
                args: {
                  systemName: "checkmark",
                },
                modifiers: [],
              },
            ],
          },
        },
      });
    });

    test("searches content within modifiers", () => {
      expect(new Editor(exampleState).select(":ab9:")).toEqual({
        path: [
          { type: "block", index: 0 },
          { type: "block", index: 0 },
          { type: "block", index: 1 },
          { type: "modifier", index: 0 },
          { type: "block", index: 0 },
        ],
        item: {
          id: ":ab9:",
          blockType: "view",
          type: "Color",
          args: {
            value: "red",
          },
          modifiers: [],
        },
      });
    });

    test("searches content within modifiers", () => {
      expect(new Editor(exampleState).select(":cd2:")).toEqual({
        path: [
          { type: "block", index: 0 },
          { type: "block", index: 0 },
          { type: "block", index: 1 },
          { type: "modifier", index: 1 },
        ],
        item: {
          id: ":cd2:",
          blockType: "modifier",
          type: "font",
          args: {
            value: "body",
          },
        },
      });
    });
  });

  describe(".contains(type:parentId:)", () => {
    test("is always falsy for top-level checks in empty editor", () => {
      expect(
        new Editor({ scope: {}, tree: [] }).contains("if", null)
      ).toBeFalsy();
    });

    test("throw error on parent not found", () => {
      expect(() =>
        new Editor({ scope: {}, tree: [] }).contains("if", ":ab1:")
      ).toThrowError(new Error("Parent not found."));
    });

    test("checks whether a modifier exists within tree", () => {
      expect(
        new Editor(exampleState).contains("background", ":ab5:")
      ).toBeTruthy();
    });

    test("checks whether a block exists within tree", () => {
      expect(new Editor(exampleState).contains("Color", null)).toBeTruthy();
    });
  });

  describe(".update(id:blockOrModifier:)", () => {
    test("throws error on not found block or modifier", () => {
      expect(() =>
        new Editor({ scope: {}, tree: [] }).update(":ab1:", {
          id: ":ab1:",
          blockType: "control",
          type: "if",
          args: {
            condition: "true",
            content: [],
          },
        })
      ).toThrowError(new Error("Not found."));
    });

    test("throws error on mismatched block type", () => {
      expect(() =>
        new Editor({
          scope: {},
          tree: [
            {
              id: ":ab1:",
              blockType: "control",
              type: "if",
              args: {
                condition: "true",
                content: [],
              },
            },
          ],
        }).update(":ab1:", {
          id: ":ab1:",
          blockType: "view",
          type: "HStack",
          args: {
            content: [],
          },
          modifiers: [],
        })
      ).toThrowError(new Error("Block type doesn't match."));
    });

    test("throws error on mismatched ID", () => {
      expect(() =>
        new Editor({
          scope: {},
          tree: [
            {
              id: ":ab1:",
              blockType: "control",
              type: "if",
              args: {
                condition: "true",
                content: [],
              },
            },
          ],
        }).update(":ab1:", {
          id: ":ab2:",
          blockType: "control",
          type: "if",
          args: {
            condition: "true",
            content: [],
          },
        })
      ).toThrowError(new Error("ID doesn't match."));
    });

    test("updates block or modifier", () => {
      expect(
        new Editor({
          scope: {},
          tree: [
            {
              id: ":ab1:",
              blockType: "control",
              type: "if",
              args: {
                condition: "true",
                content: [],
              },
            },
          ],
        }).update(":ab1:", {
          id: ":ab1:",
          blockType: "control",
          type: "if",
          args: {
            condition: "false",
            content: [],
          },
        })
      ).toEqual(
        new Editor({
          scope: {},
          tree: [
            {
              id: ":ab1:",
              blockType: "control",
              type: "if",
              args: {
                condition: "false",
                content: [],
              },
            },
          ],
        })
      );
    });
  });

  describe(".move(id:parentId:)", () => {
    test("throws error on invalid block or modifier", () => {
      expect(() =>
        new Editor({ scope: {}, tree: [] }).move(":ab1:", null)
      ).toThrowError(new Error("Not found."));
    });

    test("moves block or modifier", () => {
      expect(new Editor(exampleState).move(":ab9:", ":ab5:")).toEqual(
        new Editor({
          scope: exampleState.scope,
          tree: [
            {
              id: ":ab1:",
              blockType: "view",
              type: "ForEach",
              args: {
                data: "items",
                id: "id",
                scopeVariable: "item",
                content: [
                  {
                    id: ":ab5:",
                    blockType: "view",
                    type: "HStack",
                    args: {
                      content: [
                        {
                          id: ":ab2:",
                          blockType: "control",
                          type: "if",
                          args: {
                            condition: "$0.completed",
                            content: [
                              {
                                id: ":ab3:",
                                blockType: "view",
                                type: "Image",
                                args: {
                                  systemName: "checkmark",
                                },
                                modifiers: [],
                              },
                            ],
                          },
                        },
                        {
                          id: ":ab4:",
                          blockType: "view",
                          type: "Text",
                          args: {
                            value: "$0.title",
                          },
                          modifiers: [
                            {
                              id: ":cd1:",
                              blockType: "modifier",
                              type: "background",
                              args: {
                                content: [],
                              },
                            },
                            {
                              id: ":cd2:",
                              blockType: "modifier",
                              type: "font",
                              args: {
                                value: "body",
                              },
                            },
                          ],
                        },
                        {
                          id: ":ab9:",
                          blockType: "view",
                          type: "Color",
                          args: {
                            value: "red",
                          },
                          modifiers: [],
                        },
                      ],
                    },
                    modifiers: [],
                  },
                ],
              },
              modifiers: [],
            },
          ],
        })
      );
    });
  });

  describe(".delete(id:)", () => {
    test("throws error on invalid block or modifier", () => {
      expect(() => new Editor(exampleState).delete(":abc123:")).toThrowError(
        new Error("Not found.")
      );
    });

    test("removes a top-level block", () => {
      expect(new Editor(exampleState).delete(":ab1:")).toEqual(
        new Editor({ scope: exampleState.scope, tree: [] })
      );
    });

    test("removes a nested block", () => {
      expect(new Editor(exampleState).delete(":ab2:")).toEqual(
        new Editor({
          scope: exampleState.scope,
          tree: [
            {
              id: ":ab1:",
              blockType: "view",
              type: "ForEach",
              args: {
                data: "items",
                id: "id",
                scopeVariable: "item",
                content: [
                  {
                    id: ":ab5:",
                    blockType: "view",
                    type: "HStack",
                    args: {
                      content: [
                        {
                          id: ":ab4:",
                          blockType: "view",
                          type: "Text",
                          args: {
                            value: "$0.title",
                          },
                          modifiers: [
                            {
                              id: ":cd1:",
                              blockType: "modifier",
                              type: "background",
                              args: {
                                content: [
                                  {
                                    id: ":ab9:",
                                    blockType: "view",
                                    type: "Color",
                                    args: {
                                      value: "red",
                                    },
                                    modifiers: [],
                                  },
                                ],
                              },
                            },
                            {
                              id: ":cd2:",
                              blockType: "modifier",
                              type: "font",
                              args: {
                                value: "body",
                              },
                            },
                          ],
                        },
                      ],
                    },
                    modifiers: [],
                  },
                ],
              },
              modifiers: [],
            },
          ],
        })
      );
    });

    test("removes a modifier-nested block", () => {
      expect(new Editor(exampleState).delete(":ab9:")).toEqual(
        new Editor({
          scope: exampleState.scope,
          tree: [
            {
              id: ":ab1:",
              blockType: "view",
              type: "ForEach",
              args: {
                data: "items",
                id: "id",
                scopeVariable: "item",
                content: [
                  {
                    id: ":ab5:",
                    blockType: "view",
                    type: "HStack",
                    args: {
                      content: [
                        {
                          id: ":ab2:",
                          blockType: "control",
                          type: "if",
                          args: {
                            condition: "$0.completed",
                            content: [
                              {
                                id: ":ab3:",
                                blockType: "view",
                                type: "Image",
                                args: {
                                  systemName: "checkmark",
                                },
                                modifiers: [],
                              },
                            ],
                          },
                        },
                        {
                          id: ":ab4:",
                          blockType: "view",
                          type: "Text",
                          args: {
                            value: "$0.title",
                          },
                          modifiers: [
                            {
                              id: ":cd1:",
                              blockType: "modifier",
                              type: "background",
                              args: {
                                content: [],
                              },
                            },
                            {
                              id: ":cd2:",
                              blockType: "modifier",
                              type: "font",
                              args: {
                                value: "body",
                              },
                            },
                          ],
                        },
                      ],
                    },
                    modifiers: [],
                  },
                ],
              },
              modifiers: [],
            },
          ],
        })
      );
    });

    test("removes modifier", () => {
      expect(new Editor(exampleState).delete(":cd1:")).toEqual(
        new Editor({
          scope: exampleState.scope,
          tree: [
            {
              id: ":ab1:",
              blockType: "view",
              type: "ForEach",
              args: {
                data: "items",
                id: "id",
                scopeVariable: "item",
                content: [
                  {
                    id: ":ab5:",
                    blockType: "view",
                    type: "HStack",
                    args: {
                      content: [
                        {
                          id: ":ab2:",
                          blockType: "control",
                          type: "if",
                          args: {
                            condition: "$0.completed",
                            content: [
                              {
                                id: ":ab3:",
                                blockType: "view",
                                type: "Image",
                                args: {
                                  systemName: "checkmark",
                                },
                                modifiers: [],
                              },
                            ],
                          },
                        },
                        {
                          id: ":ab4:",
                          blockType: "view",
                          type: "Text",
                          args: {
                            value: "$0.title",
                          },
                          modifiers: [
                            {
                              id: ":cd2:",
                              blockType: "modifier",
                              type: "font",
                              args: {
                                value: "body",
                              },
                            },
                          ],
                        },
                      ],
                    },
                    modifiers: [],
                  },
                ],
              },
              modifiers: [],
            },
          ],
        })
      );
    });
  });

  describe(".equals(editor:)", () => {
    test("always true for empty editors", () => {
      expect(
        new Editor({ scope: {}, tree: [] }).equals(
          new Editor({ scope: {}, tree: [] })
        )
      ).toBeTruthy();
    });

    test("always true for exact same editors", () => {
      expect(
        new Editor(exampleState).equals(new Editor(exampleState))
      ).toBeTruthy();
    });

    test("checks for tree equality, regardless if IDs match", () => {
      expect(
        new Editor(exampleState).equals(
          new Editor({
            scope: {},
            tree: [
              {
                id: "::ab1::",
                blockType: "view",
                type: "ForEach",
                args: {
                  data: "items",
                  id: "id",
                  scopeVariable: "item",
                  content: [
                    {
                      id: "::ab5::",
                      blockType: "view",
                      type: "HStack",
                      args: {
                        content: [
                          {
                            id: "::ab2::",
                            blockType: "control",
                            type: "if",
                            args: {
                              condition: "$0.completed",
                              content: [
                                {
                                  id: "::ab3::",
                                  blockType: "view",
                                  type: "Image",
                                  args: {
                                    systemName: "checkmark",
                                  },
                                  modifiers: [],
                                },
                              ],
                            },
                          },
                          {
                            id: "::ab4::",
                            blockType: "view",
                            type: "Text",
                            args: {
                              value: "$0.title",
                            },
                            modifiers: [
                              {
                                id: "::cd1::",
                                blockType: "modifier",
                                type: "background",
                                args: {
                                  content: [
                                    {
                                      id: "::ab9::",
                                      blockType: "view",
                                      type: "Color",
                                      args: {
                                        value: "red",
                                      },
                                      modifiers: [],
                                    },
                                  ],
                                },
                              },
                              {
                                id: "::cd2::",
                                blockType: "modifier",
                                type: "font",
                                args: {
                                  value: "body",
                                },
                              },
                            ],
                          },
                        ],
                      },
                      modifiers: [],
                    },
                  ],
                },
                modifiers: [],
              },
            ],
          })
        )
      ).toBeTruthy();
    });
  });
});
