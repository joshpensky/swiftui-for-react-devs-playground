import { Fragment, PropsWithChildren, useContext, useId } from "react";
import * as Select from "@src/components/Select";
import { BaseBlock } from "@src/components/blocks/BaseBlock";
import { EditorContext } from "@src/context/EditorContext";
import { IIfControl } from "@src/models/Editor";
import { findKeysForType } from "@src/utils/findKeysForType";

export function IfControl({
  block,
  children,
  onDrag,
  scope = {},
}: PropsWithChildren<{
  block?: IIfControl;
  onDrag?(): void;
  scope?: Record<string, any>;
}>) {
  const _id = useId();
  let id = block?.id ?? _id;

  const [editor, onEditorChange] = useContext(EditorContext);

  const defaultBlock: IIfControl = {
    id,
    blockType: "control",
    type: "if",
    args: {
      condition: "",
      content: [],
    },
  };

  // Select string choices from scope
  const choicesFromScope = findKeysForType(scope, "boolean");

  return (
    <BaseBlock
      block={block ?? defaultBlock}
      preview={!block}
      configuration={
        <Fragment>
          <pre>if </pre>
          <Select.Root
            id={id}
            option={(block ?? defaultBlock).args.condition}
            disabled={!block}
            setOption={(option) => {
              if (block) {
                onEditorChange(
                  editor.update(block.id, {
                    ...block,
                    args: {
                      ...block.args,
                      condition: option,
                    },
                  })
                );
              }
            }}
          >
            <Select.Option value="" textValue="">
              &nbsp;
            </Select.Option>
            {choicesFromScope.map((key) => (
              <Select.Option key={key} value={key} textValue={key}>
                {key}
              </Select.Option>
            ))}
          </Select.Root>
          <pre> {`{`}</pre>
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
    >
      {children}
    </BaseBlock>
  );
}
