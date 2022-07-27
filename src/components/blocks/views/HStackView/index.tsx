import { PropsWithChildren, useId } from "react";
import { BaseBlock } from "@src/components/blocks/BaseBlock";
import { IHStackView } from "@src/models/Editor";

export function HStackView({
  block,
  scope = {},
  children,
  onDrag,
}: PropsWithChildren<{
  block?: IHStackView;
  scope?: Record<string, any>;
  onDrag?(): void;
}>) {
  const _id = useId();
  let id = block?.id ?? _id;

  const defaultBlock: IHStackView = {
    id,
    blockType: "view",
    type: "HStack",
    args: { content: [] },
    modifiers: [],
  };

  return (
    <BaseBlock<IHStackView>
      block={block ?? defaultBlock}
      configuration={<pre>HStack {`{`}</pre>}
      getChildScope={() => scope}
      onDrag={onDrag}
      preview={!block}
    >
      {children}
    </BaseBlock>
  );
}
