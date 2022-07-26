import {
  Fragment,
  PropsWithChildren,
  useContext,
  useEffect,
  useId,
} from "react";
import cx from "classnames";
import { useDrag } from "react-dnd";
import styles from "./styles.module.scss";
import { Color, IForegroundColorViewModifier } from "../../models/Editor";
import { BaseBlock } from "../BaseBlock";
import { EditorContext } from "../../context/EditorContext";

export function ForegroundColorViewModifier({
  block,
  onDrag,
}: {
  block?: IForegroundColorViewModifier;
  onDrag?(): void;
}) {
  const _id = useId();
  const id = block?.id ?? _id;

  const [editor, onEditorChange] = useContext(EditorContext);

  const defaultBlock: IForegroundColorViewModifier = {
    id,
    blockType: "modifier",
    type: "foregroundColor",
    args: {
      color: "red",
    },
  };

  return (
    <BaseBlock
      block={block ?? defaultBlock}
      preview={!block}
      configuration={
        <Fragment>
          <pre>.foregroundColor(.</pre>
          <select
            id={id}
            className={styles["select"]}
            name={id}
            value={(block ?? defaultBlock).args.color}
            onChange={(evt) => {
              const color = evt.target.value as Color;
              if (block) {
                onEditorChange(
                  editor.update(block.id, {
                    ...block,
                    args: {
                      color,
                    },
                  })
                );
              }
            }}
            disabled={!block}
          >
            <option value="red">red</option>
            <option value="green">green</option>
            <option value="blue">blue</option>
          </select>
          <pre>)</pre>
        </Fragment>
      }
      onDrag={onDrag}
      onDragEnd={(monitor) => {
        if (monitor.didDrop()) {
          setTimeout(() => {
            const select = document.getElementById(id);
            if (select instanceof HTMLSelectElement) {
              select.focus();
            }
          }, 10);
        }
      }}
    />
  );
}
