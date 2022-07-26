import { Fragment, useContext, useId } from "react";
import { BaseBlock } from "@src/components/blocks/BaseBlock";
import { EditorContext } from "@src/context/EditorContext";
import { Font, IFontViewModifier } from "@src/models/Editor";
import styles from "./styles.module.scss";

export function FontViewModifier({
  block,
  onDrag,
  scope = {},
}: {
  block?: IFontViewModifier;
  onDrag?(): void;
  scope?: Record<string, any>;
}) {
  const _id = useId();
  const id = block?.id ?? _id;

  const [editor, onEditorChange] = useContext(EditorContext);

  const defaultBlock: IFontViewModifier = {
    id,
    blockType: "modifier",
    type: "font",
    args: {
      value: "body",
    },
  };

  return (
    <BaseBlock
      block={block ?? defaultBlock}
      preview={!block}
      configuration={
        <Fragment>
          <pre>.font(</pre>
          <select
            id={id}
            className={styles["select"]}
            name={id}
            value={(block ?? defaultBlock).args.value}
            onChange={(evt) => {
              const font = evt.target.value as Font;
              if (block) {
                onEditorChange(
                  editor.update(block.id, {
                    ...block,
                    args: {
                      value: font,
                    },
                  })
                );
              }
            }}
            disabled={!block}
          >
            <option value="body">.body</option>
            <option value="title">.title</option>
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
