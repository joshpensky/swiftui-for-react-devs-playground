import {
  Fragment,
  PropsWithChildren,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { TextField } from "@src/components/TextField";
import { BaseBlock } from "@src/components/blocks/BaseBlock";
import { EditorContext } from "@src/context/EditorContext";
import { ITextView } from "@src/models/Editor";
import { findStringKeys } from "@src/utils/findStringKeys";

export function TextView({
  block,
  children,
  scope = {},
  onDrag,
}: PropsWithChildren<{
  block?: ITextView;
  scope?: Record<string, any>;
  onDrag?(): void;
}>) {
  const _id = useId();
  let id = block?.id ?? _id;

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

  // const [value, setValue] = useState("");

  // Select choices from scope
  const choicesFromScope = findStringKeys(scope);

  return (
    <BaseBlock
      block={block ?? defaultBlock}
      preview={!block}
      configuration={
        <Fragment>
          <pre>Text(</pre>
          {choicesFromScope.length ? (
            <select
              id={id}
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
            >
              <option value="">&quot;Custom&quot;</option>
              {choicesFromScope.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          ) : (
            <TextField
              id={id}
              value={(block ?? defaultBlock).args.value}
              disabled={!block}
              placeholder="Content"
              onChange={(value) => {
                if (block) {
                  onEditorChange(
                    editor.update(block.id, {
                      ...block,
                      args: {
                        value,
                      },
                    })
                  );
                }
              }}
            />
          )}
          <pre>)</pre>
        </Fragment>
      }
      getChildScope={() => scope}
      onDrag={onDrag}
      onDragEnd={(monitor) => {
        if (monitor.didDrop()) {
          setTimeout(() => {
            const input = document.getElementById(id);
            if (input instanceof HTMLInputElement) {
              input.focus();
              input.setSelectionRange(0, input.value.length);
            } else if (input instanceof HTMLSelectElement) {
              input.focus();
            }
          }, 10);
        }
      }}
    >
      {children}
    </BaseBlock>
  );
}
