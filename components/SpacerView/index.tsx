import { PropsWithChildren, useEffect, useId } from "react";
import { useDrag, useDrop } from "react-dnd";
import cx from "classnames";
import { IViewModifier } from "../../types";
import styles from "./styles.module.scss";

export function SpacerView({
  children,
  onDrag,
  onModifier,
  onRemove,
  preview,
  id: propsId,
}: PropsWithChildren<{
  id?: string;
  preview?: boolean;
  onDrag?(): void;
  onModifier?(modifier: IViewModifier): void;
  onRemove?(): void;
}>) {
  const _id = useId();
  let id = propsId ?? _id;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "view",
    item: {
      id,
      type: "Spacer",
      props: {},
      modifiers: [],
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
        <pre>Spacer{`()`}</pre>

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
