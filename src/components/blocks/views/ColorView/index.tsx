import { Fragment, PropsWithChildren, useContext, useId } from "react";
import * as Select from "@src/components/Select";
import { BaseBlock } from "@src/components/blocks/BaseBlock";
import { EditorContext } from "@src/context/EditorContext";
import { Color, IColorView } from "@src/models/Editor";

export function ColorView({
  block,
  children,
  onDrag,
  scope = {},
}: PropsWithChildren<{
  block?: IColorView;
  onDrag?(): void;
  scope?: Record<string, any>;
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
          <Select.Root
            id={id}
            option={(block ?? defaultBlock).args.value}
            disabled={!block}
            setOption={(option) => {
              const color = option as Color;
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
          >
            <Select.Option value="red" textValue="red">
              red
            </Select.Option>
            <Select.Option value="green" textValue="green">
              green
            </Select.Option>
            <Select.Option value="blue" textValue="blue">
              blue
            </Select.Option>
          </Select.Root>
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
