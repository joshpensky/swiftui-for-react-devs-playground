import { Editor } from "./Editor";

describe("Editor", () => {
  describe(".insertView(view:parentId:)", () => {
    test("throws on unknown parent ID", () => {
      expect(() =>
        new Editor().insertView(
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
          "abc124"
        )
      ).toThrowError();
    });

    test("throws on invalid parent ID", () => {
      expect(() =>
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
        ]).insertView(
          {
            id: "abc124",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
          "abc123"
        )
      ).toThrowError();
    });

    test("inserts into top-level without parent ID specified", () => {
      expect(
        new Editor().insertView(
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
          null
        )
      ).toEqual(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
        ])
      );
    });

    test("inserts into nested parent", () => {
      expect(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
          {
            id: "abc124",
            type: "VStack",
            props: {
              children: [
                {
                  id: "abc125",
                  type: "Text",
                  props: {
                    value: "Text",
                  },
                  modifiers: [],
                },
              ],
            },
            modifiers: [],
          },
        ]).insertView(
          {
            id: "abc126",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
          "abc124"
        )
      ).toEqual(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
          {
            id: "abc124",
            type: "VStack",
            props: {
              children: [
                {
                  id: "abc125",
                  type: "Text",
                  props: {
                    value: "Text",
                  },
                  modifiers: [],
                },
                {
                  id: "abc126",
                  type: "Text",
                  props: {
                    value: "Text",
                  },
                  modifiers: [],
                },
              ],
            },
            modifiers: [],
          },
        ])
      );
    });
  });

  describe(".insertModifier(modifier:parentId:)", () => {
    test("throws on unknown parent ID", () => {
      expect(() =>
        new Editor().insertModifier(
          {
            id: "def123",
            type: "font",
            props: {
              value: "body",
            },
          },
          "abc123"
        )
      ).toThrowError();
    });

    test("inserts on specified parent view", () => {
      expect(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
        ]).insertModifier(
          {
            id: "def123",
            type: "font",
            props: {
              value: "body",
            },
          },
          "abc123"
        )
      ).toEqual(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [
              {
                id: "def123",
                type: "font",
                props: {
                  value: "body",
                },
              },
            ],
          },
        ])
      );
    });

    test("inserts on specified parent nested view", () => {
      expect(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
          {
            id: "abc124",
            type: "VStack",
            props: {
              children: [
                {
                  id: "abc125",
                  type: "Text",
                  props: {
                    value: "Text",
                  },
                  modifiers: [
                    {
                      id: "def123",
                      type: "font",
                      props: {
                        value: "body",
                      },
                    },
                  ],
                },
              ],
            },
            modifiers: [],
          },
        ]).insertModifier(
          {
            id: "def124",
            type: "font",
            props: {
              value: "body",
            },
          },
          "abc125"
        )
      ).toEqual(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
          {
            id: "abc124",
            type: "VStack",
            props: {
              children: [
                {
                  id: "abc125",
                  type: "Text",
                  props: {
                    value: "Text",
                  },
                  modifiers: [
                    {
                      id: "def123",
                      type: "font",
                      props: {
                        value: "body",
                      },
                    },
                    {
                      id: "def124",
                      type: "font",
                      props: {
                        value: "body",
                      },
                    },
                  ],
                },
              ],
            },
            modifiers: [],
          },
        ])
      );
    });
  });

  describe(".findView(id:)", () => {
    test("returns null in empty editor", () => {
      expect(new Editor().findView("abc123")).toEqual(null);
    });

    test("returns null for mismatched IDs", () => {
      expect(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
        ]).findView("abc124")
      ).toEqual(null);
    });

    test("returns the view with the given ID", () => {
      expect(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
        ]).findView("abc123")
      ).toEqual({
        viewPath: [0],
        item: {
          id: "abc123",
          type: "Text",
          props: {
            value: "Text",
          },
          modifiers: [],
        },
      });
    });

    test("returns the nested view with the given ID", () => {
      expect(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
          {
            id: "abc124",
            type: "VStack",
            props: {
              children: [
                {
                  id: "abc125",
                  type: "Text",
                  props: {
                    value: "Text",
                  },
                  modifiers: [],
                },
              ],
            },
            modifiers: [],
          },
        ]).findView("abc125")
      ).toEqual({
        viewPath: [1, 0],
        item: {
          id: "abc125",
          type: "Text",
          props: {
            value: "Text",
          },
          modifiers: [],
        },
      });
    });
  });

  describe(".findModifier(id:)", () => {
    test("returns null in empty editor", () => {
      expect(new Editor().findModifier("abc123")).toEqual(null);
    });

    test("returns null for mismatched IDs", () => {
      expect(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [
              {
                id: "def123",
                type: "font",
                props: {
                  value: "body",
                },
              },
            ],
          },
        ]).findModifier("def124")
      ).toEqual(null);
    });

    test("returns the modifier with the given ID", () => {
      expect(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [
              {
                id: "def123",
                type: "font",
                props: {
                  value: "body",
                },
              },
            ],
          },
        ]).findModifier("def123")
      ).toEqual({
        viewPath: [0],
        item: {
          id: "def123",
          type: "font",
          props: {
            value: "body",
          },
        },
      });
    });

    test("returns the nested view with the given ID", () => {
      expect(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [
              {
                id: "def123",
                type: "font",
                props: {
                  value: "body",
                },
              },
            ],
          },
          {
            id: "abc124",
            type: "VStack",
            props: {
              children: [
                {
                  id: "abc125",
                  type: "Text",
                  props: {
                    value: "Text",
                  },
                  modifiers: [
                    {
                      id: "def124",
                      type: "font",
                      props: {
                        value: "body",
                      },
                    },
                  ],
                },
              ],
            },
            modifiers: [],
          },
        ]).findModifier("def124")
      ).toEqual({
        viewPath: [1, 0],
        item: {
          id: "def124",
          type: "font",
          props: {
            value: "body",
          },
        },
      });
    });
  });

  describe(".updateView(id:view:)", () => {
    test("throws on invalid view ID", () => {
      expect(() =>
        new Editor().updateView("abc123", {
          id: "abc123",
          type: "Text",
          props: {
            value: "Text",
          },
          modifiers: [],
        })
      ).toThrowError();
    });

    test("updates a top-level view", () => {
      expect(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
        ]).updateView("abc123", {
          id: "abc123",
          type: "Text",
          props: {
            value: "Different text",
          },
          modifiers: [],
        })
      ).toEqual(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Different text",
            },
            modifiers: [],
          },
        ])
      );
    });

    test("updates a nested view", () => {
      expect(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
          {
            id: "abc124",
            type: "VStack",
            props: {
              children: [
                {
                  id: "abc125",
                  type: "Text",
                  props: {
                    value: "Text",
                  },
                  modifiers: [],
                },
              ],
            },
            modifiers: [],
          },
        ]).updateView("abc125", {
          id: "abc125",
          type: "Text",
          props: {
            value: "Different text",
          },
          modifiers: [],
        })
      ).toEqual(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
          {
            id: "abc124",
            type: "VStack",
            props: {
              children: [
                {
                  id: "abc125",
                  type: "Text",
                  props: {
                    value: "Different text",
                  },
                  modifiers: [],
                },
              ],
            },
            modifiers: [],
          },
        ])
      );
    });
  });

  describe(".updateModifier(id:modifier:)", () => {
    test("throws on invalid view ID", () => {
      expect(() =>
        new Editor().updateModifier("def123", {
          id: "def123",
          type: "font",
          props: {
            value: "body",
          },
        })
      ).toThrowError();
    });

    test("updates modifier on top-level view", () => {
      expect(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [
              {
                id: "def123",
                type: "font",
                props: {
                  value: "body",
                },
              },
            ],
          },
        ]).updateModifier("def123", {
          id: "def123",
          type: "font",
          props: {
            value: "title",
          },
        })
      ).toEqual(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [
              {
                id: "def123",
                type: "font",
                props: {
                  value: "title",
                },
              },
            ],
          },
        ])
      );
    });

    test("updates modifier on nested view", () => {
      expect(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
          {
            id: "abc124",
            type: "VStack",
            props: {
              children: [
                {
                  id: "abc125",
                  type: "Text",
                  props: {
                    value: "Text",
                  },
                  modifiers: [
                    {
                      id: "def123",
                      type: "font",
                      props: {
                        value: "body",
                      },
                    },
                    {
                      id: "def124",
                      type: "foregroundColor",
                      props: {
                        value: "red",
                      },
                    },
                  ],
                },
              ],
            },
            modifiers: [],
          },
        ]).updateModifier("def124", {
          id: "def124",
          type: "foregroundColor",
          props: {
            value: "green",
          },
        })
      ).toEqual(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
          {
            id: "abc124",
            type: "VStack",
            props: {
              children: [
                {
                  id: "abc125",
                  type: "Text",
                  props: {
                    value: "Text",
                  },
                  modifiers: [
                    {
                      id: "def123",
                      type: "font",
                      props: {
                        value: "body",
                      },
                    },
                    {
                      id: "def124",
                      type: "foregroundColor",
                      props: {
                        value: "green",
                      },
                    },
                  ],
                },
              ],
            },
            modifiers: [],
          },
        ])
      );
    });
  });

  describe(".removeView(id:)", () => {
    test("throws on invalid view ID", () => {
      expect(() => new Editor().removeView("abc123")).toThrowError();
    });

    test("removes top-level view from editor", () => {
      expect(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
        ]).removeView("abc123")
      ).toEqual(new Editor([]));
    });

    test("removes nested view from editor", () => {
      expect(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
          {
            id: "abc124",
            type: "VStack",
            props: {
              children: [
                {
                  id: "abc125",
                  type: "Text",
                  props: {
                    value: "Text",
                  },
                  modifiers: [],
                },
              ],
            },
            modifiers: [],
          },
        ]).removeView("abc125")
      ).toEqual(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [],
          },
          {
            id: "abc124",
            type: "VStack",
            props: {
              children: [],
            },
            modifiers: [],
          },
        ])
      );
    });
  });

  describe(".removeModifier(id:)", () => {
    test("throws on invalid view ID", () => {
      expect(() => new Editor().removeModifier("def123")).toThrowError();
    });

    test("removes modifier on top-level view from editor", () => {
      expect(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [
              {
                id: "def123",
                type: "font",
                props: {
                  value: "body",
                },
              },
              {
                id: "def124",
                type: "font",
                props: {
                  value: "body",
                },
              },
            ],
          },
        ]).removeModifier("def123")
      ).toEqual(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [
              {
                id: "def124",
                type: "font",
                props: {
                  value: "body",
                },
              },
            ],
          },
        ])
      );
    });

    test("removes modifier on nested view from editor", () => {
      expect(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [
              {
                id: "def123",
                type: "font",
                props: {
                  value: "body",
                },
              },
            ],
          },
          {
            id: "abc124",
            type: "VStack",
            props: {
              children: [
                {
                  id: "abc125",
                  type: "Text",
                  props: {
                    value: "Text",
                  },
                  modifiers: [
                    {
                      id: "def124",
                      type: "font",
                      props: {
                        value: "body",
                      },
                    },
                  ],
                },
              ],
            },
            modifiers: [],
          },
        ]).removeModifier("def124")
      ).toEqual(
        new Editor([
          {
            id: "abc123",
            type: "Text",
            props: {
              value: "Text",
            },
            modifiers: [
              {
                id: "def123",
                type: "font",
                props: {
                  value: "body",
                },
              },
            ],
          },
          {
            id: "abc124",
            type: "VStack",
            props: {
              children: [
                {
                  id: "abc125",
                  type: "Text",
                  props: {
                    value: "Text",
                  },
                  modifiers: [],
                },
              ],
            },
            modifiers: [],
          },
        ])
      );
    });
  });
});
