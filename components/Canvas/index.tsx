import { Dispatch, SetStateAction, useState } from "react";
import { useDrop } from "react-dnd";
import cx from "classnames";
import styles from "./styles.module.scss";
import { IView } from "../../types";
import { Library } from "./Library";
import { DragLayer } from "./DragLayer";
import { LayoutGroup, motion } from "framer-motion";
import { View } from "../View";
import { Editor, EditorContext } from "../../models/Editor";

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
        onEditorChange(editor.insertView(item as IView, null));
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
        <LayoutGroup>
          <DragLayer />
          {!editor.views.length ? (
            <motion.p>Drag views onto the canvas.</motion.p>
          ) : (
            <div className={styles["views-container"]}>
              <motion.ul className={styles["views"]} /*layout*/>
                {editor.views.map((view, index) => {
                  return (
                    <motion.li
                      key={view.id}
                      // layout="position"
                      // layoutId={view.id}
                      transition={{
                        type: "spring",
                        bounce: 0,
                        duration: 0.25,
                      }}
                    >
                      <View view={view} />
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>
          )}
        </LayoutGroup>

        <Library open={toolbarOpen} onOpenChange={setToolbarOpen} />
      </div>
    </EditorContext.Provider>
  );
}
