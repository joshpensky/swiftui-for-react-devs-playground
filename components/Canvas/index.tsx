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
import { Flipped, Flipper } from "react-flip-toolkit";

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
      <div ref={drop} className={styles["dropzone"]}>
        <Flipper
          className={cx(styles["canvas"], isOver && styles["dropping"])}
          flipKey={JSON.stringify(editor.views)}
        >
          <DragLayer />
          {!editor.views.length ? (
            <motion.p>Drag views onto the canvas.</motion.p>
          ) : (
            <div className={styles["views-container"]}>
              <ul className={styles["views"]}>
                {editor.views.map((view, index) => {
                  return (
                    <Flipped key={view.id} flipId={view.id} translate>
                      <li>
                        <View view={view} />
                      </li>
                    </Flipped>
                  );
                })}
              </ul>
            </div>
          )}
        </Flipper>

        <Library open={toolbarOpen} onOpenChange={setToolbarOpen} />
      </div>
    </EditorContext.Provider>
  );
}
