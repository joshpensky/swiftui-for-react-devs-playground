import { PropsWithChildren, useId } from "react";
import { BaseBlock } from "@src/components/blocks/BaseBlock";
import { ICodeTemplate } from "@src/models/Editor";

export function CodeTemplate({
  block,
  children,
  scope = {},
  onDrag,
}: PropsWithChildren<{
  block?: ICodeTemplate;
  scope?: Record<string, any>;
  onDrag?(): void;
}>) {
  const _id = useId();
  let id = block?.id ?? _id;

  const defaultBlock: ICodeTemplate = {
    id,
    blockType: "template",
    type: "code",
    args: {
      code: "",
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
