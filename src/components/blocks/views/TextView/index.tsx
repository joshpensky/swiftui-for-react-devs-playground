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
import styles from "./styles.module.scss";

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
      value: `"Text"`,
    },
    modifiers: [],
  };

  const [value, setValue] = useState((block ?? defaultBlock).args.value);
  const [choice, setChoice] = useState("custom");
  // Select choices from scope
  const choicesFromScope = findStringKeys(scope);
  useEffect(() => {
    const inDOM = !!block && !!editor.select(block.id);
    if (inDOM) {
      let blockValue = choice;
      if (choice === "custom") {
        blockValue = value;
      }
      onEditorChange((editor) => {
        const response = editor.select(block.id);
        if (!response) {
          return editor;
        }
        return editor.update(block.id, {
          ...(response.item as ITextView),
          args: {
            value: blockValue,
          },
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choice, value]);

  return (
    <BaseBlock
      block={block ?? defaultBlock}
      preview={!block}
      configuration={
        <Fragment>
          <pre>Text(</pre>
          {choicesFromScope.length ? (
            <div className={styles["selector"]}>
              <select
                id={id}
                value={choice}
                onChange={(evt) => {
                  setChoice(evt.target.value);
                }}
                disabled={!block}
              >
                <option value="custom">&quot;Custom&quot;</option>
                {choicesFromScope.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
              {choice === "custom" && (
                <Fragment>
                  <pre>&quot;</pre>
                  <TextField
                    id={`${id}-input`}
                    value={(block ?? defaultBlock).args.value.replace(
                      /(^\")|(\"$)/g,
                      ""
                    )}
                    disabled={!block}
                    placeholder="Content"
                    onChange={(value) => {
                      setValue(`"${value}"`);
                    }}
                  />
                  <pre>&quot;</pre>
                </Fragment>
              )}
            </div>
          ) : (
            <Fragment>
              <pre>&quot;</pre>
              <TextField
                id={id}
                value={(block ?? defaultBlock).args.value.replace(
                  /(^\")|(\"$)/g,
                  ""
                )}
                disabled={!block}
                placeholder="Content"
                onChange={(value) => {
                  if (block) {
                    onEditorChange(
                      editor.update(block.id, {
                        ...block,
                        args: {
                          value: `"${value}"`,
                        },
                      })
                    );
                  }
                }}
              />
              <pre>&quot;</pre>
            </Fragment>
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
