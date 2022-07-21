import type { NextPage } from "next";
import { useMemo, useState } from "react";
import isEqual from "lodash.isequal";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import styles from "./styles/index.module.scss";
import { Preview } from "../components/Preview";
import { Canvas } from "../components/Canvas";

export type Color = "red" | "green" | "blue";

interface IForegroundColorViewModifier {
  id: string;
  type: "foregroundColor";
  props: {
    value: Color;
  };
}

export type Font = "body" | "title";

interface IFontViewModifier {
  id: string;
  type: "font";
  props: {
    value: Font;
  };
}

export type IViewModifier = IFontViewModifier | IForegroundColorViewModifier;

interface ITextView {
  id: string;
  type: "Text";
  props: {
    value: string;
  };
  modifiers: IViewModifier[];
}

export type IView = ITextView;

const code = `
<p style={{ color: 'blue' }}>
  This is my great text!
</p>
`.trim();

const Home: NextPage = () => {
  const [views, setViews] = useState<IView[]>([]);

  const matched = useMemo(() => {
    // Remove unique IDs from views
    const strippedViews = views.map(({ id, ...view }) => ({
      ...view,
      modifiers: [...view.modifiers]
        .reverse()
        .reduce((acc, { id, ...modifier }) => {
          // Evaluate modifiers in reverse order, only keeping the first of a given type
          let mIndex = acc.findIndex((m) => m.type === modifier.type);
          if (mIndex >= 0) {
            acc[mIndex] = modifier;
          } else {
            acc.push(modifier);
          }
          return acc;
        }, [] as Omit<IViewModifier, "id">[]),
    }));

    return isEqual(strippedViews, [
      {
        type: "Text",
        props: { value: "This is my great text!" },
        modifiers: [
          {
            type: "foregroundColor",
            props: {
              value: "blue",
            },
          },
        ],
      },
    ]);
  }, [views]);

  return (
    <div className={styles["page"]}>
      <h1>How would you write the following code in SwiftUI?</h1>

      <div className={styles["code"]}>
        <SyntaxHighlighter language="jsx" style={vscDarkPlus}>
          {code}
        </SyntaxHighlighter>
      </div>

      <div className={styles["play-area"]}>
        <div className={styles["canvas"]}>
          <h2>Canvas</h2>
          <Canvas views={views} onViewsChange={setViews} />
        </div>

        <div className={styles["previews"]}>
          <h2>Preview</h2>
          {views.length ? (
            views.map((view, index) => <Preview key={index} view={view} />)
          ) : (
            <Preview />
          )}
        </div>
      </div>

      <p>{matched ? "✅ Success!" : "❌ Not quite"}</p>

      <details>
        <summary>JSON representation</summary>
        <pre>{JSON.stringify(views, null, 2)}</pre>
      </details>
    </div>
  );
};

export default Home;
