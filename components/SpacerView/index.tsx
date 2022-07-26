import { PropsWithChildren, useId } from "react";
import { ISpacerView } from "../../models/Editor";
import { BaseBlock } from "../BaseBlock";

export function SpacerView({
  block,
  children,
  onDrag,
}: PropsWithChildren<{
  block?: ISpacerView;
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
      onDrag={onDrag}
    >
      {children}
    </BaseBlock>
  );
}
