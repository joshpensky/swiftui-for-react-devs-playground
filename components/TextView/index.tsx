import { PropsWithChildren, useEffect, useId, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import cx from "classnames";
import styles from "./styles.module.scss";
import { ITextView, IViewModifier } from "../../models/Editor";

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
  onModifier?(modifier: IViewModifier): void;
  onRemove?(): void;
  value: string;
}>) {
  const _id = useId();
  let id = propsId ?? _id;

  const inputRef = useRef<HTMLInputElement>(null);

  const [{ isDragging }, drag] = useDrag<
    ITextView,
    unknown,
    { isDragging: boolean }
  >(
    () => ({
      type: "view",
      item: {
        id,
        blockType: "view",
        type: "Text",
        args: {
          value,
        },
        modifiers: [],
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
      accept: "modifier",
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
        <pre>Text(&quot;</pre>
        <div className={styles["input"]}>
          <pre aria-hidden="true">{value || "Content"}</pre>
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
        </div>
        <pre>&quot;)</pre>

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
