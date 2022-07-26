import { Fragment, useContext, useId } from "react";
import styles from "./styles.module.scss";
import { Font, IFontViewModifier } from "../../models/Editor";
import { BaseBlock } from "../BaseBlock";
import { EditorContext } from "../../context/EditorContext";

export function FontViewModifier({
  block,
  onDrag,
}: {
  block?: IFontViewModifier;
  onDrag?(): void;
}) {
  const _id = useId();
  const id = block?.id ?? _id;

  const [editor, onEditorChange] = useContext(EditorContext);

  const defaultBlock: IFontViewModifier = {
    id,
    blockType: "modifier",
    type: "font",
    args: {
      value: "body",
    },
  };

  return (
    <BaseBlock
      block={block ?? defaultBlock}
      preview={!block}
      configuration={
        <Fragment>
          <pre>.font(</pre>
          <select
            id={id}
            className={styles["select"]}
            name={id}
            value={(block ?? defaultBlock).args.value}
            onChange={(evt) => {
              const font = evt.target.value as Font;
              if (block) {
                onEditorChange(
                  editor.update(block.id, {
                    ...block,
                    args: {
                      value: font,
                    },
                  })
                );
              }
            }}
            disabled={!block}
          >
            <option value="body">.body</option>
            <option value="title">.title</option>
          </select>
          <pre>)</pre>
        </Fragment>
      }
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
    />
  );

  // const [{ isDragging }, drag] = useDrag<
  //   IFontViewModifier,
  //   unknown,
  //   { isDragging: boolean }
  // >(() => ({
  //   type: "modifier",
  //   item: {
  //     id,
  //     blockType: "modifier",
  //     type: "font",
  //     args: {
  //       value: "body",
  //     },
  //   },
  //   canDrag(monitor) {
  //     return !!preview;
  //   },
  //   end(draggedItem, monitor) {
  //   },
  //   collect: (monitor) => ({
  //     isDragging: monitor.isDragging(),
  //   }),
  // }));

  // useEffect(() => {
  //   if (isDragging) {
  //     onDrag?.();
  //   }
  // }, [isDragging, onDrag]);

  // return (
  //   <div
  //     ref={drag}
  //     className={cx(styles["container"], preview && styles["preview"])}
  //     style={{
  //       cursor: preview ? (isDragging ? "grabbing" : "grab") : "default",
  //     }}
  //   >
  //

  //     {!preview && (
  //       <button type="button" onClick={() => onRemove?.()}>
  //         –
  //       </button>
  //     )}
  //   </div>
  // );
}
