import { PropsWithChildren, useEffect, useId, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ViewModifierModel } from "../../pages";
import styles from "./styles.module.scss";

export function TextView({
  children,
  onChange,
  onModifier,
  onRemove,
  value,
  preview,
}: PropsWithChildren<{
  preview?: boolean;
  onChange?(value: string): void;
  onModifier?(modifier: ViewModifierModel): void;
  onRemove?(): void;
  value: string;
}>) {
  const id = useId();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "view",
    item: {
      type: "Text",
      props: {
        value: "",
      },
      modifiers: [],
    },
    canDrag(monitor) {
      return !!preview;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "view-modifier",
    collect: (monitor) => ({
      isOver: !preview && monitor.isOver(),
    }),
    drop(item, monitor) {
      onModifier?.(item as ViewModifierModel);
    },
  }));

  const inputRef = useRef<HTMLInputElement>(null);
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
      className={styles["view"]}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: preview ? (isDragging ? "grabbing" : "grab") : "default",
      }}
    >
      <div
        ref={drop}
        className={styles["container"]}
        style={{ boxShadow: isOver ? "inset 0 0 0 3px #2868E4" : "none" }}
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
