import { PropsWithChildren } from "react";
import cx from "classnames";
import { useDrag } from "react-dnd";
import styles from "./styles.module.scss";

export type Color = "red" | "green" | "blue";

export function ForegroundColorViewModifier({
  value,
  onChange,
  onRemove,
  preview,
}: PropsWithChildren<{
  preview?: boolean;
  value: Color;
  onChange?(value: Color): void;
  onRemove?(): void;
}>) {
  const [collected, drag] = useDrag(() => ({
    type: "view-modifier",
    item: {
      type: "foregroundColor",
      props: {
        value: "red",
      },
    },
    canDrag(monitor) {
      return !!preview;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={cx(styles["container"], preview && styles["preview"])}
      style={{
        opacity: collected.isDragging ? 0.5 : 1,
        cursor: preview
          ? collected.isDragging
            ? "grabbing"
            : "grab"
          : "default",
      }}
    >
      <pre>.foregroundColor(</pre>
      <select
        value={value}
        onChange={(evt) => onChange?.(evt.target.value as Color)}
        disabled={preview}
      >
        <option value="red">.red</option>
        <option value="green">.green</option>
        <option value="blue">.blue</option>
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
