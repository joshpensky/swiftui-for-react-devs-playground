export type Color = "red" | "green" | "blue";
export type Font = "body" | "title";
export type SystemImage = "checkmark";

export interface IBaseViewModifier {
  id: string;
  blockType: "modifier";
}

export interface IFontViewModifier extends IBaseViewModifier {
  type: "font";
  args: {
    value: Font;
  };
}

export interface IBackgroundViewModifier extends IBaseViewModifier {
  type: "background";
  args: {
    content: (IControl | IView)[];
  };
}

export type IViewModifier = IBackgroundViewModifier | IFontViewModifier;

export interface IBaseView {
  id: string;
  blockType: "view";
  modifiers: IViewModifier[];
}

export interface IZStackView extends IBaseView {
  type: "ZStack";
  args: {
    content: (IControl | IView)[];
  };
}

export interface IVStackView extends IBaseView {
  type: "VStack";
  args: {
    content: (IControl | IView)[];
  };
}

export interface ITextView extends IBaseView {
  type: "Text";
  args: {
    value: string;
  };
}

export interface IImageView extends IBaseView {
  type: "Image";
  args: {
    systemName: SystemImage;
  };
}

export interface IHStackView extends IBaseView {
  type: "HStack";
  args: {
    content: (IControl | IView)[];
  };
}

export interface IForEachView extends IBaseView {
  type: "ForEach";
  args: {
    data: string;
    id: string;
    scopeVariable: string;
    content: (IControl | IView)[];
  };
}

export interface IColorView extends IBaseView {
  type: "Color";
  args: {
    value: Color;
  };
}

export type IView =
  | IColorView
  | IForEachView
  | IHStackView
  | IImageView
  | ITextView
  | IVStackView
  | IZStackView;

export interface IBaseControl {
  id: string;
  blockType: "control";
}

export interface IIfControl extends IBaseControl {
  type: "if";
  args: {
    condition: string;
    content: (IControl | IView)[];
  };
}

export type IControl = IIfControl;

export interface EditorState {
  scope: Record<string, any>;
  tree: (IControl | IView)[];
}

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
                    condition: "item.completed",
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
                    value: "item.title",
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
