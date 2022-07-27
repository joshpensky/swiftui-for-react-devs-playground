import { Fragment, PropsWithChildren, useContext, useId } from "react";
import * as Select from "@src/components/Select";
import { BaseBlock } from "@src/components/blocks/BaseBlock";
import { EditorContext } from "@src/context/EditorContext";
import { IForEachView } from "@src/models/Editor";

export function ForEachView({
  block,
  scope = {},
  children,
  onDrag,
}: PropsWithChildren<{
  block?: IForEachView;
  scope?: Record<string, any>;
  onDrag?(): void;
}>) {
  const _id = useId();
  let id = block?.id ?? _id;

  const [editor, onEditorChange] = useContext(EditorContext);

  const defaultBlock: IForEachView = {
    id,
    blockType: "view",
    type: "ForEach",
    args: {
      data: "",
      id: "",
      content: [],
    },
    modifiers: [],
  };

  const dataOptions: Record<string, any[]> = {};
  Object.entries(scope).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      dataOptions[key] = value;
    }
  });

  const idOptions: string[] = [];
  if (dataOptions[(block ?? defaultBlock).args.data]) {
    const firstItem = dataOptions[(block ?? defaultBlock).args.data][0];
    if (typeof firstItem === "string" || typeof firstItem === "number") {
      idOptions.push("self");
    } else if (firstItem && typeof firstItem === "object") {
      Object.entries(firstItem).forEach(([key, value]) => {
        if (typeof value === "string" || typeof value === "number") {
          idOptions.push(key);
        }
      });
    }
  }

  return (
    <BaseBlock<IForEachView>
      block={block ?? defaultBlock}
      configuration={
        <Fragment>
          <pre>ForEach(</pre>
          <Select.Root
            id={`${id}-data`}
            option={(block ?? defaultBlock).args.data}
            disabled={!block}
            setOption={(option) => {
              if (block) {
                onEditorChange(
                  editor.update(block.id, {
                    ...block,
                    args: {
                      ...block.args,
                      data: option,
                      id: "",
                    },
                  })
                );
              }
            }}
          >
            <Select.Option value="" textValue="">
              &nbsp;
            </Select.Option>
            {Object.keys(dataOptions).map((key) => (
              <Select.Option key={key} value={key} textValue={key}>
                {key}
              </Select.Option>
            ))}
          </Select.Root>

          <pre>, id: \.</pre>
          <Select.Root
            id={`${id}-id`}
            option={(block ?? defaultBlock).args.id}
            disabled={!(block ?? defaultBlock).args.data}
            setOption={(option) => {
              if (block) {
                onEditorChange(
                  editor.update(block.id, {
                    ...block,
                    args: {
                      ...block.args,
                      id: option,
                    },
                  })
                );
              }
            }}
          >
            <Select.Option value="" textValue="">
              &nbsp;
            </Select.Option>
            {idOptions.map((key) => (
              <Select.Option key={key} value={key} textValue={key}>
                {key}
              </Select.Option>
            ))}
          </Select.Root>

          <pre>{`) { `}</pre>
        </Fragment>
      }
      getChildScope={(child, index) => {
        const { data: dataKey } = (block ?? defaultBlock).args;
        const data = dataOptions[dataKey];
        if (!data) {
          return scope;
        }

        return {
          ...scope,
          $0: data[index],
        };
      }}
      onDrag={onDrag}
      onDragEnd={(monitor) => {
        if (monitor.didDrop()) {
          setTimeout(() => {
            const select = document.getElementById(`${id}-data`);
            if (select instanceof HTMLSelectElement) {
              select.focus();
            }
          }, 10);
        }
      }}
      preview={!block}
    >
      {children}
    </BaseBlock>
  );
}
