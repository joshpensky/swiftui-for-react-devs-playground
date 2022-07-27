import { Fragment, useContext, useId } from "react";
import * as Select from "@src/components/Select";
import { BaseBlock } from "@src/components/blocks/BaseBlock";
import { EditorContext } from "@src/context/EditorContext";
import { Font, IFontViewModifier } from "@src/models/Editor";

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
          <pre>.font(.</pre>
          <Select.Root
            id={id}
            option={(block ?? defaultBlock).args.value}
            disabled={!block}
            setOption={(option) => {
              const font = option as Font;
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
          >
            <Select.Option value="body" textValue="body">
              body
            </Select.Option>
            <Select.Option value="title" textValue="title">
              title
            </Select.Option>
          </Select.Root>
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
