import { Fragment, PropsWithChildren, useContext, useId } from "react";
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
      scopeVariable: "",
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
          <select
            value={(block ?? defaultBlock).args.data}
            onChange={(evt) => {
              if (block) {
                onEditorChange(
                  editor.update(block.id, {
                    ...block,
                    args: {
                      ...block.args,
                      data: evt.target.value,
                      id: "",
                    },
                  })
                );
              }
            }}
          >
            <option value=""></option>
            {Object.keys(dataOptions).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>

          <pre>, id: \.</pre>
          <select
            value={(block ?? defaultBlock).args.id}
            onChange={(evt) => {
              if (block) {
                onEditorChange(
                  editor.update(block.id, {
                    ...block,
                    args: {
                      ...block.args,
                      id: evt.target.value,
                    },
                  })
                );
              }
            }}
            disabled={!(block ?? defaultBlock).args.data}
          >
            <option value=""></option>
            {idOptions.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>

          <pre>{`) { `}</pre>
          <input
            value={(block ?? defaultBlock).args.scopeVariable}
            onChange={(evt) => {
              if (block) {
                onEditorChange(
                  editor.update(block.id, {
                    ...block,
                    args: {
                      ...block.args,
                      scopeVariable: evt.target.value,
                    },
                  })
                );
              }
            }}
            placeholder="$0"
          />
          <pre> {`in `}</pre>
        </Fragment>
      }
      getChildScope={(child, index) => {
        const { scopeVariable, data: dataKey } = (block ?? defaultBlock).args;
        const data = dataOptions[dataKey];
        if (!data) {
          return scope;
        }

        return {
          ...scope,
          [`${scopeVariable || "$0"}`]: data[index],
        };
      }}
      onDrag={onDrag}
      preview={!block}
    >
      {children}
    </BaseBlock>
  );
}
