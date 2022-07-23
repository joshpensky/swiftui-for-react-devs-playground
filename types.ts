export type Color = "red" | "green" | "blue";
export type Font = "body" | "title";

export interface IForegroundColorViewModifier {
  id: string;
  type: "foregroundColor";
  props: {
    value: Color;
  };
}

export interface IFontViewModifier {
  id: string;
  type: "font";
  props: {
    value: Font;
  };
}

export type IViewModifier = IFontViewModifier | IForegroundColorViewModifier;

export interface IVStackView {
  id: string;
  type: "VStack";
  props: {
    children: IView[];
  };
  modifiers: IViewModifier[];
}

export interface ITextView {
  id: string;
  type: "Text";
  props: {
    value: string;
  };
  modifiers: IViewModifier[];
}

export interface ISpacerView {
  id: string;
  type: "Spacer";
  props: {};
  modifiers: IViewModifier[];
}

export interface IColorView {
  id: string;
  type: "Color";
  props: {
    value: Color;
  };
  modifiers: IViewModifier[];
}

export type IView = IColorView | ISpacerView | ITextView | IVStackView;
