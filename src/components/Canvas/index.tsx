import { Dispatch, SetStateAction, useState } from "react";
import cx from "classnames";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useDrop } from "react-dnd";
import { Block } from "@src/components/Block";
import { EditorContext } from "@src/context/EditorContext";
import { Editor, IView } from "@src/models/Editor";
import { DragLayer } from "./DragLayer";
import { Library } from "./Library";
import styles from "./styles.module.scss";

export function Canvas({
  editor,
  onEditorChange,
}: {
  editor: Editor;
  onEditorChange: Dispatch<SetStateAction<Editor>>;
}) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "view",
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
      }),
      canDrop(item, monitor) {
        return monitor.isOver({ shallow: true });
      },
      drop(item, monitor) {
        let view = item as IView;
        if (editor.select(view.id)) {
          onEditorChange(editor.move(view.id, null));
        } else {
          onEditorChange(editor.insert(view, null));
        }
      },
    }),
    [editor]
  );

  const [toolbarOpen, setToolbarOpen] = useState(false);

  return (
    <EditorContext.Provider value={[editor, onEditorChange]}>
      <div
        ref={drop}
        className={cx(styles["canvas"], isOver && styles["dropping"])}
      >
        <LayoutGroup id="canvas">
          <DragLayer />

          {!editor.state.tree.length && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Drag views onto the canvas.
            </motion.p>
          )}

          <motion.div
            className={styles["views-container"]}
            key="canvas-views"
            exit={{
              opacity: 0,
              transition: { duration: 0.25, when: "afterChildren" },
            }}
          >
            <motion.ul className={styles["views"]} layout="position">
              <AnimatePresence>
                {editor.state.tree.map((block) => {
                  return (
                    <motion.li
                      key={block.id}
                      className={styles["view"]}
                      layoutId={block.id}
                      transition={{
                        type: "spring",
                        bounce: 0,
                        duration: 0.25,
                      }}
                    >
                      <motion.div
                        aria-hidden="true"
                        className={styles["poof"]}
                        exit={{
                          animation: `${styles["poof"]} 0.5s steps(7, end) forwards`,
                        }}
                      />

                      <motion.div
                        exit={{
                          opacity: 0,
                          transition: {
                            duration: 0.25,
                          },
                        }}
                      >
                        <Block block={block} />
                      </motion.div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </motion.ul>
          </motion.div>
          {/* )}
          </AnimatePresence> */}
        </LayoutGroup>

        <Library open={toolbarOpen} onOpenChange={setToolbarOpen} />
      </div>
    </EditorContext.Provider>
  );
}
