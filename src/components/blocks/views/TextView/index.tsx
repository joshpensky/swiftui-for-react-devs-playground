import {
  Fragment,
  PropsWithChildren,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useState,
} from "react";
import { CheckIcon, TriangleDownIcon } from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import { TextField } from "@src/components/TextField";
import { BaseBlock } from "@src/components/blocks/BaseBlock";
import { EditorContext } from "@src/context/EditorContext";
import { ITextView } from "@src/models/Editor";
import { findKeysForType } from "@src/utils/findKeysForType";
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
  const [choice, setChoice] = useState("__custom");
  // Select string choices from scope
  const choicesFromScope = findKeysForType(scope, "string");
  useLayoutEffect(() => {
    const inDOM = !!block && !!editor.select(block.id);
    if (inDOM) {
      let blockValue = choice;
      if (choice === "__custom") {
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
              <Select.Root name={id} value={choice} onValueChange={setChoice}>
                <Select.Trigger
                  id={id}
                  className={styles["select-trigger"]}
                  aria-label="Text Input"
                  disabled={!block}
                >
                  <Select.Value
                    aria-label={choice === "__custom" ? "Custom" : choice}
                  >
                    {choice === "__custom" ? (
                      <pre className={styles["select-value"]}>
                        &quot;{value.replace(/(^")|("$)/g, "") || "Content"}
                        &quot;
                      </pre>
                    ) : (
                      choice
                    )}
                  </Select.Value>
                  <Select.Icon className={styles["select-icon"]}>
                    <TriangleDownIcon />
                  </Select.Icon>
                </Select.Trigger>

                <Select.Content className={styles["select-content"]}>
                  <Select.Viewport>
                    <Select.Item
                      className={styles["select-content__item"]}
                      value="__custom"
                      textValue="Custom"
                    >
                      <div className={styles["select-content__item__inner"]}>
                        <Select.ItemText>
                          &quot;
                          <span className={styles["placeholder"]}>Custom</span>
                          &quot;
                        </Select.ItemText>
                        <Select.ItemIndicator
                          className={styles["select-content__item__indicator"]}
                        >
                          <CheckIcon />
                        </Select.ItemIndicator>
                      </div>
                    </Select.Item>

                    {choicesFromScope.map((key) => (
                      <Select.Item
                        className={styles["select-content__item"]}
                        key={key}
                        value={key}
                        textValue={key}
                      >
                        <div className={styles["select-content__item__inner"]}>
                          <Select.ItemText>{key}</Select.ItemText>
                          <Select.ItemIndicator
                            className={
                              styles["select-content__item__indicator"]
                            }
                          >
                            <CheckIcon />
                          </Select.ItemIndicator>
                        </div>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Root>

              {choice === "__custom" && (
                <div className={styles["select-input"]}>
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
                </div>
              )}
            </div>
          ) : (
            <div className={styles["input"]}>
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
            </div>
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
