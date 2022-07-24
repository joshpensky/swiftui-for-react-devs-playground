import { PropsWithChildren, useEffect, useId, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import cx from "classnames";
import { Color, IViewModifier } from "../../types";
import styles from "./styles.module.scss";

export function ColorView({
  children,
  onChange,
  onDrag,
  onModifier,
  onRemove,
  value,
  preview,
  id: propsId,
}: PropsWithChildren<{
  id?: string;
  preview?: boolean;
  onChange?(value: Color): void;
  onDrag?(): void;
  onModifier?(modifier: IViewModifier): void;
  onRemove?(): void;
  value: Color;
}>) {
  const _id = useId();
  let id = propsId ?? _id;

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "view",
      item: {
        id,
        type: "Color",
        props: {
          value,
        },
        modifiers: [],
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
    }),
    [value]
  );

  useEffect(() => {
    if (isDragging) {
      onDrag?.();
    }
  }, [isDragging, onDrag]);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "view-modifier",
      collect: (monitor) => ({
        isOver: !preview && monitor.isOver(),
      }),
      drop(item, monitor) {
        onModifier?.(item as IViewModifier);
      },
    }),
    [onModifier]
  );

  return (
    <div
      ref={drag}
      className={cx(
        styles["view"],
        preview && styles["preview"],
        isDragging && styles["dragging"],
        isOver && styles["dropping"]
      )}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      <div
        ref={drop}
        className={cx(styles["container"], isOver && styles["dropping"])}
      >
        <pre>Color.</pre>
        <select
          id={id}
          name={id}
          value={value}
          onChange={(evt) => onChange?.(evt.target.value as Color)}
          disabled={preview}
        >
          <option value="red">red</option>
          <option value="green">green</option>
          <option value="blue">blue</option>
        </select>

        {!preview && (
          <button type="button" onClick={() => onRemove?.()}>
            –
          </button>
        )}
      </div>

      {children}
    </div>
  );
}
