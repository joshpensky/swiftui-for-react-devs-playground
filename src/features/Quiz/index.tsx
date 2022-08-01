import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ExitIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Canvas } from "@src/components/Canvas";
import { Library } from "@src/components/Canvas/Library";
import { Hint } from "@src/components/Hint";
import { Preview } from "@src/components/Preview";
import { Progress } from "@src/components/Progress";
import { Editor } from "@src/models/Editor";
import styles from "./styles.module.scss";

const code = `
const [items, setItems] = useState([
  { id: 1, title: "Do something", completed: true },
  { id: 2, title: "Do something else", completed: false },
]);

return (
  <div style={{ display: 'flex', flex-direction: 'column' }}>
    {items.map(item => (
      <div key={item.id} style={{ display: 'flex' }}>
        {item.completed && <img src="checkmark.png" />}
        <p>{item.title}</p>
      </div>
    ))}
  </div>
);
`.trim();

export function Quiz() {
  const [open, setOpen] = useState(false);

  const [editor, setEditor] = useState(
    new Editor({
      scope: {
        items: [
          { id: 1, title: "Do something", completed: true },
          { id: 2, title: "Do something", completed: false },
          { id: 3, title: "Do something", completed: false },
        ],
      },
      tree: [],
    })
  );
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>Open me</Dialog.Trigger>

      <Dialog.Portal forceMount>
        <AnimatePresence>
          {open && (
            <Dialog.Content
              asChild
              forceMount
              onEscapeKeyDown={(evt) => evt.preventDefault()}
            >
              <motion.div
                className={styles["modal"]}
                initial={{ opacity: 0, scale: 0.98, borderRadius: 20 }}
                animate={{ opacity: 1, scale: 1, borderRadius: 1 }}
                exit={{ opacity: 0, scale: 0.98, borderRadius: 20 }}
                transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
              >
                <nav className={styles["nav"]}>
                  <Dialog.Close asChild>
                    <button className={styles["leave"]}>
                      <ExitIcon />
                      <span>Leave</span>
                    </button>
                  </Dialog.Close>

                  <Dialog.Title>
                    <strong>Quiz:</strong> Building Blocks
                  </Dialog.Title>

                  <Progress current={2} total={5} />
                </nav>

                <div className={styles["main"]}>
                  <div className={styles["content"]}>
                    <div className={styles["library"]}>
                      <Library />
                    </div>

                    <div className={styles["canvas"]}>
                      <h3
                        className={styles["question-number"]}
                        aria-label="Question 2"
                      >
                        2
                      </h3>

                      <h4 className={styles["question"]}>
                        The following React code renders a todo list given an
                        array of items:
                      </h4>

                      <div className={styles["code"]}>
                        <SyntaxHighlighter language="jsx" style={vscDarkPlus}>
                          {code}
                        </SyntaxHighlighter>
                      </div>

                      <h4 className={styles["question"]}>
                        Drag and drop blocks to recreate the logic in SwiftUI.
                      </h4>

                      <Hint>
                        The <code>ForEach</code> view relies on the{" "}
                        <code>id</code> argument to determine which views to
                        render, much like the <code>key</code> prop in React!
                      </Hint>

                      <div className={styles["editor"]}>
                        <Canvas editor={editor} onEditorChange={setEditor} />
                      </div>
                    </div>

                    <div className={styles["previews"]}>
                      <h3>Live Preview</h3>
                      {editor.state.tree.length > 0 ? (
                        <Preview
                          key={editor.state.tree[0].id}
                          block={editor.state.tree[0]}
                          scope={editor.state.scope}
                        />
                      ) : (
                        <Preview scope={editor.state.scope} />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
