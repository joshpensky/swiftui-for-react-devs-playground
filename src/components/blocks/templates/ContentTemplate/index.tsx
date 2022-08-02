import { PropsWithChildren, useId } from "react";
import { BaseBlock } from "@src/components/blocks/BaseBlock";
import { IContentTemplate } from "@src/models/Editor";

export function ContentTemplate({
  block,
  children,
  scope = {},
  onDrag,
}: PropsWithChildren<{
  block?: IContentTemplate;
  scope?: Record<string, any>;
  onDrag?(): void;
}>) {
  const _id = useId();
  let id = block?.id ?? _id;

  const defaultBlock: IContentTemplate = {
    id,
    blockType: "template",
    type: "content",
    args: {
      code: "",
      content: [],
      canDrop: false,
    },
  };

  return (
    <BaseBlock
      block={block ?? defaultBlock}
      preview={!block}
      configuration={<pre>{(block ?? defaultBlock).args.code}</pre>}
      getChildScope={() => scope}
      onDrag={onDrag}
    >
      {children}
    </BaseBlock>
  );
}
