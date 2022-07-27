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
// import * as Select from "@radix-ui/react-select";
import * as Select from "@src/components/Select";
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

  // Select string choices from scope
  const choicesFromScope = findKeysForType(scope, "string");

  const [choice, setChoice] = useState(() => {
    const match = choicesFromScope.find(
      (choice) => choice === (block ?? defaultBlock).args.value
    );
    return match ?? Select.WRITE_IN_OPTION_KEY;
  });

  const [value, setValue] = useState(() => {
    if (choice === Select.WRITE_IN_OPTION_KEY) {
      return (block ?? defaultBlock).args.value;
    } else {
      return "Text";
    }
  });

  useLayoutEffect(() => {
    const inDOM = !!block && !!editor.select(block.id);
    if (inDOM) {
      let blockValue = choice;
      if (choice === Select.WRITE_IN_OPTION_KEY) {
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
            <Select.Root
              option={choice}
              setOption={setChoice}
              disabled={!block}
              id={id}
              writeInOptions={{
                value: value.replace(/(^\")|(\"$)/g, ""),
                setValue(value) {
                  setValue(`"${value}"`);
                },
              }}
            >
              {choicesFromScope.map((key) => (
                <Select.Option key={key} value={key} textValue={key}>
                  {key}
                </Select.Option>
              ))}
            </Select.Root>
          ) : (
            <div className={styles["input"]}>
              <pre>&quot;</pre>
              <TextField
                id={id}
                className={styles["field"]}
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
