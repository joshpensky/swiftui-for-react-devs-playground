import {
  CSSProperties,
  Fragment,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import cx from "classnames";
import { motion } from "framer-motion";
import { DragSourceMonitor, useDrag, useDrop } from "react-dnd";
import { Block } from "@src/components/Block";
import { EditorContext } from "@src/context/EditorContext";
import { ZIndexContext } from "@src/context/ZIndexContext";
import { IControl, ITemplate, IView, IViewModifier } from "@src/models/Editor";
import styles from "./styles.module.scss";

export function BaseBlock<
  B extends ITemplate | IControl | IView | IViewModifier
>({
  block,
  children,
  configuration,
  getChildScope,
  onDrag,
  onDragEnd,
  preview,
}: PropsWithChildren<{
  block: B;
  configuration: ReactNode;
  getChildScope(
    block: ITemplate | IControl | IView,
    index: number
  ): Record<string, any>;
  onDrag?(): void;
  onDragEnd?(monitor: DragSourceMonitor<B, unknown>): void;
  preview?: boolean;
}>) {
  const [editor, onEditorChange] = useContext(EditorContext);

  const [{ canDrag, isDragging }, drag] = useDrag<
    B,
    unknown,
    { canDrag: boolean; isDragging: boolean }
  >(
    () => ({
      type: block.blockType,
      item: block,
      canDrag(monitor) {
        return block.blockType !== "template";
      },
      end(draggedItem, monitor) {
        onDragEnd?.(monitor);
      },
      collect: (monitor) => ({
        canDrag: monitor.canDrag(),
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
      accept: ["view", "control"],
      collect: (monitor) => ({
        isBlockOver: !preview && monitor.canDrop(),
      }),
      canDrop(item, monitor) {
        let isOver = monitor.isOver({ shallow: true });
        if ("canDrop" in block.args) {
          return isOver && block.args.canDrop;
        } else {
          return isOver;
        }
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
        isModifierOver:
          block.blockType === "view" &&
          !preview &&
          monitor.isOver({ shallow: true }),
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
          isModifierOver:
            block.blockType === "view" &&
            !preview &&
            monitor.isOver({ shallow: true }),
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
      style={
        {
          cursor: canDrag ? (isDragging ? "grabbing" : "grab") : undefined,
          "--z-index": zIndex,
        } as CSSProperties
      }
    >
      <div className={styles["wrapper"]}>
        <div ref={modifierDropTop} className={cx(styles["container"])}>
          <div className={styles["dropzone"]} />
          {configuration}
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
              >
                <motion.ul className={styles["views"]} /*layout="position"*/>
                  {block.args.content.map((block, index) => (
                    <motion.li
                      key={block.id}
                      // layoutId={block.id}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        bounce: 0,
                        duration: 0.25,
                      }}
                    >
                      <Block
                        block={block}
                        scope={getChildScope(block, index)}
                      />
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
