import { Fragment, useContext, useId } from "react";
import { BaseBlock } from "@src/components/blocks/BaseBlock";
import { EditorContext } from "@src/context/EditorContext";
import { Color, IForegroundColorViewModifier } from "@src/models/Editor";
import styles from "./styles.module.scss";

export function ForegroundColorViewModifier({
  block,
  onDrag,
  scope = {},
}: {
  block?: IForegroundColorViewModifier;
  onDrag?(): void;
  scope?: Record<string, any>;
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
      getChildScope={() => scope}
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
