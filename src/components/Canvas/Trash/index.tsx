import { useContext, useEffect, useState } from "react";
import { TrashIcon } from "@radix-ui/react-icons";
import cx from "classnames";
import { useDragLayer, useDrop } from "react-dnd";
import { EditorContext } from "@src/context/EditorContext";
import { IControl, IView, IViewModifier } from "@src/models/Editor";
import styles from "./styles.module.scss";

export function Trash() {
  const [editor, onEditorChange] = useContext(EditorContext);

  const { isDragging } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
  }));

  const [didDrop, setDidDrop] = useState(false);
  const [{ isOver }, drop] = useDrop({
    accept: ["view", "control", "modifier"],
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
    canDrop(item, monitor) {
      return monitor.isOver({ shallow: true });
    },
    drop(item, monitor) {
      let view = item as IControl | IView | IViewModifier;
      if (editor.select(view.id)) {
        onEditorChange(editor.delete(view.id));
      }
      setDidDrop(true);
    },
  });

  useEffect(() => {
    if (didDrop) {
      setTimeout(() => {
        setDidDrop(false);
      }, 500);
    }
  }, [didDrop]);

  return (
    <div className={styles["wrapper"]}>
      {didDrop && <div aria-hidden="true" className={styles["poof"]} />}

      {isDragging && (
        <button
          ref={drop}
          className={cx(styles["drop"], isOver && styles["dropping"])}
          aria-label="Remove block"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}
