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
        let view = item as IView;
        if (editor.findView(view.id)) {
          onEditorChange(editor.moveView(view.id, null));
        } else {
          onEditorChange(editor.insertView(view, null));
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
          {!editor.views.length ? (
            <motion.p>Drag views onto the canvas.</motion.p>
          ) : (
            <div className={styles["views-container"]}>
              <motion.ul className={styles["views"]} layout="position">
                {editor.views.map((view, index) => {
                  return (
                    <motion.li
                      key={view.id}
                      layoutId={view.id}
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
