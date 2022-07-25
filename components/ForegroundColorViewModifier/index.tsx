import { PropsWithChildren, useEffect, useId } from "react";
import cx from "classnames";
import { useDrag } from "react-dnd";
import styles from "./styles.module.scss";
import { Color } from "../../models/Editor";

export function ForegroundColorViewModifier({
  color,
  onChange,
  onDrag,
  onRemove,
  preview,
  id: propsId,
}: PropsWithChildren<{
  id?: string;
  preview?: boolean;
  color: Color;
  onChange?(color: Color): void;
  onDrag?(): void;
  onRemove?(): void;
}>) {
  const _id = useId();
  const id = propsId ?? _id;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "modifier",
    item: {
      id,
      type: "foregroundColor",
      props: {
        value: "red",
      },
    },
    canDrag(monitor) {
      return !!preview;
    },
    end(draggedItem, monitor) {
      if (monitor.didDrop()) {
        setTimeout(() => {
          const select = document.getElementById(id);
          if (select instanceof HTMLSelectElement) {
            select.focus();
          }
        }, 10);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    if (isDragging) {
      onDrag?.();
    }
  }, [isDragging, onDrag]);

  return (
    <div
      ref={drag}
      className={cx(styles["container"], preview && styles["preview"])}
      style={{
        cursor: preview ? (isDragging ? "grabbing" : "grab") : "default",
      }}
    >
      <pre>.foregroundColor(.</pre>
      <select
        id={id}
        name={id}
        value={color}
        onChange={(evt) => onChange?.(evt.target.value as Color)}
        disabled={preview}
      >
        <option value="red">red</option>
        <option value="green">green</option>
        <option value="blue">blue</option>
      </select>
      <pre>)</pre>

      {!preview && (
        <button type="button" onClick={() => onRemove?.()}>
          –
        </button>
      )}
    </div>
  );
}
