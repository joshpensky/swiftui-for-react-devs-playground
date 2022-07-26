import { PropsWithChildren, useId } from "react";
import { BaseBlock } from "@src/components/blocks/BaseBlock";
import { ISpacerView } from "@src/models/Editor";

export function SpacerView({
  block,
  children,
  scope = {},
  onDrag,
}: PropsWithChildren<{
  block?: ISpacerView;
  scope?: Record<string, any>;
  onDrag?(): void;
}>) {
  const _id = useId();
  let id = block?.id ?? _id;

  const defaultBlock: ISpacerView = {
    id,
    blockType: "view",
    type: "Spacer",
    args: {},
    modifiers: [],
  };

  return (
    <BaseBlock
      block={block ?? defaultBlock}
      preview={!block}
      configuration={<pre>Spacer{`()`}</pre>}
      getChildScope={() => scope}
      onDrag={onDrag}
    >
      {children}
    </BaseBlock>
  );
}
