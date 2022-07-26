import { Fragment, PropsWithChildren, useContext, useId } from "react";
import { BaseBlock } from "@src/components/blocks/BaseBlock";
import { EditorContext } from "@src/context/EditorContext";
import { Color, IColorView } from "@src/models/Editor";
import styles from "./styles.module.scss";

export function ColorView({
  block,
  children,
  onDrag,
}: PropsWithChildren<{
  block?: IColorView;
  onDrag?(): void;
}>) {
  const _id = useId();
  let id = block?.id ?? _id;

  const [editor, onEditorChange] = useContext(EditorContext);

  const defaultBlock: IColorView = {
    id,
    blockType: "view",
    type: "Color",
    args: {
      value: "red",
    },
    modifiers: [],
  };

  return (
    <BaseBlock
      block={block ?? defaultBlock}
      preview={!block}
      configuration={
        <Fragment>
          <pre>Color.</pre>
          <select
            id={id}
            className={styles["select"]}
            name={id}
            value={(block ?? defaultBlock).args.value}
            onChange={(evt) => {
              const color = evt.target.value as Color;
              if (block) {
                onEditorChange(
                  editor.update(block.id, {
                    ...block,
                    args: {
                      value: color,
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
    >
      {children}
    </BaseBlock>
  );
}
