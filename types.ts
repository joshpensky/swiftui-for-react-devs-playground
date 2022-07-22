export type Color = "red" | "green" | "blue";

export interface IForegroundColorViewModifier {
  id: string;
  type: "foregroundColor";
  props: {
    value: Color;
  };
}

export type Font = "body" | "title";

export interface IFontViewModifier {
  id: string;
  type: "font";
  props: {
    value: Font;
  };
}

export type IViewModifier = IFontViewModifier | IForegroundColorViewModifier;

export interface ITextView {
  id: string;
  type: "Text";
  props: {
    value: string;
  };
  modifiers: IViewModifier[];
}

export interface IVStackView {
  id: string;
  type: "VStack";
  props: {
    children: IView[];
  };
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

export type IView = IColorView | IVStackView | ITextView;
