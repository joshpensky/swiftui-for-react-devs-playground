import { Fragment, useContext, useId } from "react";
import * as Select from "@src/components/Select";
import { BaseBlock } from "@src/components/blocks/BaseBlock";
import { EditorContext } from "@src/context/EditorContext";
import { Color, IForegroundColorViewModifier } from "@src/models/Editor";
import styles from "./styles.module.scss";

export function ForegroundColorViewModifier({
  block,
  onDrag,
  scope = {},
}: {
  block?: IForegroundColorViewModifier;
  onDrag?(): void;
  scope?: Record<string, any>;
}) {
  const _id = useId();
  const id = block?.id ?? _id;

  const [editor, onEditorChange] = useContext(EditorContext);

  const defaultBlock: IForegroundColorViewModifier = {
    id,
    blockType: "modifier",
    type: "foregroundColor",
    args: {
      color: "red",
    },
  };

  return (
    <BaseBlock
      block={block ?? defaultBlock}
      preview={!block}
      configuration={
        <Fragment>
          <pre>.foregroundColor(.</pre>
          <Select.Root
            id={id}
            option={(block ?? defaultBlock).args.color}
            disabled={!block}
            setOption={(option) => {
              const color = option as Color;
              if (block) {
                onEditorChange(
                  editor.update(block.id, {
                    ...block,
                    args: {
                      color,
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
