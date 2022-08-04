import { Dispatch, SetStateAction, useState } from "react";
import cx from "classnames";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useDrop } from "react-dnd";
import { Block } from "@src/components/Block";
import { EditorContext } from "@src/context/EditorContext";
import { Editor, IView } from "@src/models/Editor";
import { DragLayer } from "./DragLayer";
import { Trash } from "./Trash";
import styles from "./styles.module.scss";

export function Canvas({
  editor,
  onEditorChange,
}: {
  editor: Editor;
  onEditorChange: Dispatch<SetStateAction<Editor>>;
}) {
  return (
    <EditorContext.Provider value={[editor, onEditorChange]}>
      <div className={styles["canvas"]}>
        <LayoutGroup id="canvas">
          <DragLayer />

          <motion.div
            className={styles["views-container"]}
            key="canvas-views"
            exit={{
              opacity: 0,
              transition: { duration: 0.25, when: "afterChildren" },
            }}
          >
            <motion.ul className={styles["views"]} /*layout="position"*/>
              <AnimatePresence>
                {editor.state.tree.map((block) => {
                  return (
                    <motion.li
                      key={block.id}
                      className={styles["view"]}
                      // layoutId={block.id}
                      transition={{
                        type: "spring",
                        bounce: 0,
                        duration: 0.25,
                      }}
                    >
                      <Block block={block} scope={editor.state.scope} />
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </motion.ul>
          </motion.div>
          {/* )}
          </AnimatePresence> */}
        </LayoutGroup>

        <Trash />
      </div>
    </EditorContext.Provider>
  );
}
