import { Fragment, PropsWithChildren, useContext, useId, useRef } from "react";
import { BaseBlock } from "@src/components/blocks/BaseBlock";
import { EditorContext } from "@src/context/EditorContext";
import { ITextView } from "@src/models/Editor";
import styles from "./styles.module.scss";

export function TextView({
  block,
  children,
  onDrag,
}: PropsWithChildren<{
  block?: ITextView;
  onDrag?(): void;
}>) {
  const _id = useId();
  let id = block?.id ?? _id;

  const inputRef = useRef<HTMLInputElement>(null);
  const [editor, onEditorChange] = useContext(EditorContext);

  const defaultBlock: ITextView = {
    id,
    blockType: "view",
    type: "Text",
    args: {
      value: "Text",
    },
    modifiers: [],
  };

  return (
    <BaseBlock
      block={block ?? defaultBlock}
      preview={!block}
      configuration={
        <Fragment>
          <pre>Text(&quot;</pre>
          <div className={styles["input"]}>
            <pre aria-hidden="true">
              {(block ?? defaultBlock).args.value || "Content"}
            </pre>
            <input
              ref={inputRef}
              id={id}
              name={id}
              type="text"
              placeholder="Content"
              value={(block ?? defaultBlock).args.value}
              onChange={(evt) => {
                if (block) {
                  onEditorChange(
                    editor.update(block.id, {
                      ...block,
                      args: {
                        value: evt.target.value,
                      },
                    })
                  );
                }
              }}
              disabled={!block}
            />
          </div>
          <pre>&quot;)</pre>
        </Fragment>
      }
      onDrag={onDrag}
      onDragEnd={(monitor) => {
        if (monitor.didDrop()) {
          setTimeout(() => {
            const input = document.getElementById(id);
            if (input instanceof HTMLInputElement) {
              input.focus();
              input.setSelectionRange(0, input.value.length);
            }
          }, 10);
        }
      }}
    >
      {children}
    </BaseBlock>
  );
}
