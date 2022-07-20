import type { NextPage } from "next";
import { useMemo, useState } from "react";
import isEqual from "lodash.isequal";
import { Color } from "../components/ForegroundColorViewModifier";
import styles from "./styles/index.module.scss";
import { Preview } from "../components/Preview";
import { Canvas } from "../components/Canvas";

interface ForegroundColorViewModifierModel {
  type: "foregroundColor";
  props: {
    value: Color;
  };
}

export type ViewModifierModel = ForegroundColorViewModifierModel;

interface TextViewModel {
  type: "Text";
  props: {
    value: string;
  };
  modifiers: ViewModifierModel[];
}

export type ViewModel = TextViewModel;

const Home: NextPage = () => {
  const [views, setViews] = useState<ViewModel[]>([]);

  const matched = useMemo(() => {
    return isEqual(views, [
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

      <code className={styles["code"]}>
        <pre>
          {`<p style={{ color: ‘blue’ }}>
  This is my great text!
</p>`}
        </pre>
      </code>

      <div className={styles["play-area"]}>
        <Canvas views={views} onViewsChange={setViews} />

        <div>
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
