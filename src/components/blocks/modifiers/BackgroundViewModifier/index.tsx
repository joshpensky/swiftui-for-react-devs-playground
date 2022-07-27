import { PropsWithChildren, useId } from "react";
import { BaseBlock } from "@src/components/blocks/BaseBlock";
import { IBackgroundViewModifier } from "@src/models/Editor";

export function BackgroundViewModifier({
  block,
  children,
  scope = {},
  onDrag,
}: PropsWithChildren<{
  block?: IBackgroundViewModifier;
  scope?: Record<string, any>;
  onDrag?(): void;
}>) {
  const _id = useId();
  let id = block?.id ?? _id;

  const defaultBlock: IBackgroundViewModifier = {
    id,
    blockType: "modifier",
    type: "background",
    args: {
      content: [],
    },
  };

  return (
    <BaseBlock
      block={block ?? defaultBlock}
      preview={!block}
      configuration={<pre>.background {`{`}</pre>}
      getChildScope={() => scope}
      onDrag={onDrag}
    >
      {children}
    </BaseBlock>
  );
}
