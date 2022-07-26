import {
  CSSProperties,
  Fragment,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { DragSourceMonitor, useDrag, useDrop } from "react-dnd";
import cx from "classnames";
import { motion } from "framer-motion";
import { EditorContext } from "../../../context/EditorContext";
import { ZIndexContext } from "../../../context/ZIndexContext";
import { IControl, IView, IViewModifier } from "../../../models/Editor";
import styles from "./styles.module.scss";
import { Block } from "../../Block";

export function BaseBlock<B extends IControl | IView | IViewModifier>({
  block,
  children,
  configuration,
  onDrag,
  onDragEnd,
  preview,
}: PropsWithChildren<{
  block: B;
  configuration: ReactNode;
  onDrag?(): void;
  onDragEnd?(monitor: DragSourceMonitor<B, unknown>): void;
  preview?: boolean;
}>) {
  const [editor, onEditorChange] = useContext(EditorContext);

  const [{ isDragging }, drag] = useDrag<B, unknown, { isDragging: boolean }>(
    () => ({
      type: block.blockType,
      item: block,
      end(draggedItem, monitor) {
        onDragEnd?.(monitor);
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [block]
  );

  useEffect(() => {
    if (isDragging) {
      onDrag?.();
    }
  }, [isDragging, onDrag]);

  const [{ isBlockOver }, contentDrop] = useDrop(
    () => ({
      accept: "view",
      collect: (monitor) => ({
        isBlockOver: !preview && monitor.isOver({ shallow: true }),
      }),
      canDrop(item, monitor) {
        return monitor.isOver({ shallow: true });
      },
      drop(item, monitor) {
        let contentBlock = item as IControl | IView;
        if (editor.select(contentBlock.id)) {
          onEditorChange(editor.move(contentBlock.id, block.id));
        } else {
          onEditorChange(editor.insert(contentBlock, block.id));
        }
      },
    }),
    [editor]
  );

  const [{ isModifierOver: isModifierOverTop }, modifierDropTop] = useDrop(
    () => ({
      accept: "modifier",
      collect: (monitor) => ({
        isModifierOver: !preview && monitor.isOver({ shallow: true }),
      }),
      canDrop(item, monitor) {
        return block.blockType === "view" && monitor.isOver({ shallow: true });
      },
      drop(item, monitor) {
        let modifier = item as IViewModifier;
        onEditorChange(editor.insert(modifier, block.id));
      },
    }),
    [editor]
  );

  const [{ isModifierOver: isModifierOverBottom }, modifierDropBottom] =
    useDrop(
      () => ({
        accept: "modifier",
        collect: (monitor) => ({
          isModifierOver: !preview && monitor.isOver({ shallow: true }),
        }),
        canDrop(item, monitor) {
          return (
            block.blockType === "view" && monitor.isOver({ shallow: true })
          );
        },
        drop(item, monitor) {
          let modifier = item as IViewModifier;
          onEditorChange(editor.insert(modifier, block.id));
        },
      }),
      [editor]
    );

  const isModifierOver = isModifierOverTop || isModifierOverBottom;

  const zIndex = useContext(ZIndexContext);

  return (
    <div
      ref={drag}
      className={cx(
        styles["block"],
        styles[block.blockType],
        "content" in block.args && styles["block--with-content"],
        preview && styles["preview"],
        isDragging && styles["dragging"],
        isModifierOver && styles["modifier-dropping"]
      )}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      <div className={styles["wrapper"]}>
        <div ref={modifierDropTop} className={cx(styles["container"])}>
          <div className={styles["dropzone"]} />

          {configuration}

          {!preview && (
            <button
              type="button"
              onClick={() => {
                onEditorChange(editor.delete(block.id));
              }}
            >
              –
            </button>
          )}
        </div>

        {"content" in block.args && (
          <Fragment>
            <div className={cx(styles["content"])}>
              <div
                ref={contentDrop}
                className={cx(
                  styles["content-drop"],
                  isBlockOver && styles["dropping"]
                )}
                style={{ "--z-index": zIndex } as CSSProperties}
              >
                <motion.ul className={styles["views"]} layout="position">
                  {block.args.content.map((block, index) => (
                    <motion.li
                      key={block.id}
                      layoutId={block.id}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        bounce: 0,
                        duration: 0.25,
                      }}
                    >
                      <Block block={block} />
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </div>

            <div ref={modifierDropBottom} className={cx(styles["container"])}>
              <pre>{`}`}</pre>
            </div>
          </Fragment>
        )}
      </div>

      {block.blockType === "view" && children && (
        <div className={styles["modifiers"]}>{children}</div>
      )}
    </div>
  );
}
