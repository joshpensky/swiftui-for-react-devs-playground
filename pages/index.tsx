import type { NextPage } from "next";
import { useMemo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import styles from "./styles/index.module.scss";
import { Preview } from "../components/NewPreview";
import { Canvas } from "../components/Canvas";
import { Editor } from "../models/Editor";
import { exampleState } from "../models/NewEditor.test";

const code = `
<p style={{ color: 'blue' }}>
  This is my great text!
</p>
`.trim();

const Home: NextPage = () => {
  const [editor, setEditor] = useState(new Editor());

  const matched = useMemo(() => {
    return editor.equals(
      new Editor([
        {
          id: "anon",
          type: "Text",
          props: {
            value: "This is my great text!",
          },
          modifiers: [
            {
              id: "anon",
              type: "foregroundColor",
              props: {
                value: "blue",
              },
            },
          ],
        },
      ])
    );
  }, [editor]);

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
          <Canvas editor={editor} onEditorChange={setEditor} />
        </div>

        <div className={styles["previews"]}>
          <h2>Preview</h2>
          {exampleState.tree.map((block) => (
            <Preview key={block.id} block={block} scope={exampleState.scope} />
          ))}
        </div>
      </div>

      <p>{matched ? "✅ Success!" : "❌ Not quite"}</p>

      <details>
        <summary>JSON representation</summary>
        <pre>{JSON.stringify(editor.views, null, 2)}</pre>
      </details>
    </div>
  );
};

export default Home;
