import { PropsWithChildren, useEffect, useId } from "react";
import cx from "classnames";
import { useDrag } from "react-dnd";
import styles from "./styles.module.scss";
import { Font } from "../../pages";

export function FontViewModifier({
  value,
  onChange,
  onDrag,
  onRemove,
  preview,
  id: propsId,
}: PropsWithChildren<{
  id?: string;
  preview?: boolean;
  value: Font;
  onChange?(value: Font): void;
  onDrag?(): void;
  onRemove?(): void;
}>) {
  const _id = useId();
  const id = propsId ?? _id;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "view-modifier",
    item: {
      id,
      type: "font",
      props: {
        value: "body",
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
      <pre>.font(</pre>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(evt) => onChange?.(evt.target.value as Font)}
        disabled={preview}
      >
        <option value="body">.body</option>
        <option value="title">.title</option>
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
