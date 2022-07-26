import { PropsWithChildren, useId } from "react";
import { BaseBlock } from "@src/components/blocks/BaseBlock";
import { IVStackView } from "@src/models/Editor";

export function VStackView({
  block,
  scope = {},
  children,
  onDrag,
}: PropsWithChildren<{
  block?: IVStackView;
  scope?: Record<string, any>;
  onDrag?(): void;
}>) {
  const _id = useId();
  let id = block?.id ?? _id;

  const defaultBlock: IVStackView = {
    id,
    blockType: "view",
    type: "VStack",
    args: { content: [] },
    modifiers: [],
  };

  return (
    <BaseBlock<IVStackView>
      block={block ?? defaultBlock}
      configuration={<pre>VStack {`{`}</pre>}
      getChildScope={() => scope}
      onDrag={onDrag}
      preview={!block}
    >
      {children}
    </BaseBlock>
  );
}
