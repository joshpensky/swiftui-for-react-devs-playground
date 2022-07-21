import { PropsWithChildren, useEffect, useId, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import cx from "classnames";
import { motion } from "framer-motion";
import { ViewModifierModel } from "../../pages";
import styles from "./styles.module.scss";

export function TextView({
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
  onChange?(value: string): void;
  onDrag?(): void;
  onModifier?(modifier: ViewModifierModel): void;
  onRemove?(): void;
  value: string;
}>) {
  const _id = useId();
  let id = propsId ?? _id;

  const inputRef = useRef<HTMLInputElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "view",
    item: {
      id,
      type: "Text",
      props: {
        value: "Text",
      },
      modifiers: [],
    },
    canDrag(monitor) {
      return !!preview;
    },
    end(draggedItem, monitor) {
      if (monitor.didDrop()) {
        setTimeout(() => {
          const input = document.getElementById(id);
          if (input instanceof HTMLInputElement) {
            input.focus();
            input.setSelectionRange(0, input.value.length);
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
  }, [isDragging]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "view-modifier",
    collect: (monitor) => ({
      isOver: !preview && monitor.isOver(),
    }),
    drop(item, monitor) {
      onModifier?.(item as ViewModifierModel);
    },
  }));

  const widthRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const rect = widthRef.current?.getBoundingClientRect();
    if (inputRef.current) {
      inputRef.current.style.width = `${(rect?.width ?? 0) + 10}px`;
    }
  }, [value]);

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
        cursor: preview ? (isDragging ? "grabbing" : "grab") : "default",
      }}
    >
      <div
        ref={drop}
        className={styles["container"]}
        style={{ boxShadow: isOver ? "inset 0 0 0 3px #2868E4" : undefined }}
      >
        <pre>Text(&quot;</pre>
        <input
          ref={inputRef}
          id={id}
          name={id}
          type="text"
          placeholder="Content"
          value={value}
          onChange={(evt) => {
            onChange?.(evt.target.value);
          }}
          disabled={preview}
        />
        <pre>&quot;)</pre>

        <div ref={widthRef} aria-hidden="true">
          <pre>{value || "Content"}</pre>
        </div>

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
