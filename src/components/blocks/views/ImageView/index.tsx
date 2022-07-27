import { Fragment, PropsWithChildren, useContext, useId } from "react";
import * as Select from "@src/components/Select";
import { BaseBlock } from "@src/components/blocks/BaseBlock";
import { EditorContext } from "@src/context/EditorContext";
import { IImageView, SystemImage } from "@src/models/Editor";

export function ImageView({
  block,
  children,
  onDrag,
  scope = {},
}: PropsWithChildren<{
  block?: IImageView;
  onDrag?(): void;
  scope?: Record<string, any>;
}>) {
  const _id = useId();
  let id = block?.id ?? _id;

  const [editor, onEditorChange] = useContext(EditorContext);

  const defaultBlock: IImageView = {
    id,
    blockType: "view",
    type: "Image",
    args: {
      systemName: "checkmark",
    },
    modifiers: [],
  };

  return (
    <BaseBlock
      block={block ?? defaultBlock}
      preview={!block}
      configuration={
        <Fragment>
          <pre>Image(systemName: .</pre>
          <Select.Root
            id={id}
            option={(block ?? defaultBlock).args.systemName}
            disabled={!block}
            setOption={(option) => {
              const systemName = option as SystemImage;
              if (block) {
                onEditorChange(
                  editor.update(block.id, {
                    ...block,
                    args: {
                      systemName,
                    },
                  })
                );
              }
            }}
          >
            <Select.Option value="checkmark" textValue="checkmark">
              checkmark
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
    >
      {children}
    </BaseBlock>
  );
}
