import { useMemo, useState } from "react";
import type { NextPage } from "next";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Canvas } from "@src/components/Canvas";
import { Preview } from "@src/components/Preview";
import { Editor } from "@src/models/Editor";
import styles from "./styles/index.module.scss";

const code = `
const [items, setItems] = useState([
  { id: 1, title: "Do something", completed: true },
  { id: 2, title: "Do something else", completed: false },
]);

return (
  <div>
    {items.map(item => (
      <div key={item.id}>
        {item.completed && <img src="checkmark.png" />}
        <p>{item.title}</p>
      </div>
    ))}
  </div>
);
`.trim();

const Home: NextPage = () => {
  const [editor, setEditor] = useState(
    new Editor({
      scope: {
        items: [
          { id: 1, title: "Do something", completed: true },
          { id: 2, title: "Do something", completed: false },
          { id: 3, title: "Do something", completed: false },
        ],
        // example: { subtext: { grandchildText: "text" } },
      },
      tree: [],
    })
  );

  const matched = useMemo(() => {
    return editor.equals(new Editor({ scope: {}, tree: [] }));
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
          {editor.state.tree.length ? (
            editor.state.tree.map((block) => (
              <Preview
                key={block.id}
                block={block}
                scope={editor.state.scope}
              />
            ))
          ) : (
            <Preview scope={editor.state.scope} />
          )}
        </div>
      </div>

      <p>{matched ? "✅ Success!" : "❌ Not quite"}</p>

      <details>
        <summary>JSON representation</summary>
        <pre>{JSON.stringify(editor.state, null, 2)}</pre>
      </details>
    </div>
  );
};

export default Home;
