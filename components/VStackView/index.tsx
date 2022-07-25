import {
  CSSProperties,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useId,
} from "react";
import { useDrag, useDrop } from "react-dnd";
import cx from "classnames";
import {
  IControl,
  IView,
  IViewModifier,
  IVStackView,
} from "../../models/Editor";
import styles from "./styles.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { View, ZIndexContext } from "../View";
import { EditorContext } from "../../context/EditorContext";

export function VStackView({
  children,
  content,
  onDrag,
  onRemove,
  onModifier,
  preview,
  id: propsId,
}: PropsWithChildren<{
  id?: string;
  preview?: boolean;
  content: (IControl | IView)[];
  onDrag?(): void;
  onModifier?(modifier: IViewModifier): void;
  onRemove?(): void;
}>) {
  const _id = useId();
  let id = propsId ?? _id;

  const [editor, onEditorChange] = useContext(EditorContext);

  const [{ isDragging }, drag] = useDrag<
    IVStackView,
    unknown,
    { isDragging: boolean }
  >(
    () => ({
      type: "view",
      item: {
        id,
        blockType: "view",
        type: "VStack",
        args: {
          content,
        },
        modifiers: [],
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [content]
  );

  useEffect(() => {
    if (isDragging) {
      onDrag?.();
    }
  }, [isDragging, onDrag]);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "view",
      collect: (monitor) => ({
        isOver: !preview && monitor.isOver({ shallow: true }),
      }),
      canDrop(item, monitor) {
        return monitor.isOver({ shallow: true });
      },
      drop(item, monitor) {
        let view = item as IView;
        if (editor.select(view.id)) {
          onEditorChange(editor.move(view.id, id));
        } else {
          onEditorChange(editor.insert(view, id));
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
        return monitor.isOver({ shallow: true });
      },
      drop(item, monitor) {
        onModifier?.(item as IViewModifier);
      },
    }),
    [onModifier]
  );
  const [{ isModifierOver: isModifierOverBottom }, modifierDropBottom] =
    useDrop(
      () => ({
        accept: "modifier",
        collect: (monitor) => ({
          isModifierOver: !preview && monitor.isOver({ shallow: true }),
        }),
        canDrop(item, monitor) {
          return monitor.isOver({ shallow: true });
        },
        drop(item, monitor) {
          onModifier?.(item as IViewModifier);
        },
      }),
      [onModifier]
    );
  const isModifierOver = isModifierOverTop || isModifierOverBottom;

  const zIndex = useContext(ZIndexContext);

  return (
    <div
      ref={drag}
      className={cx(
        styles["view"],
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

          <pre>VStack {`{`}</pre>

          {!preview && (
            <button type="button" onClick={() => onRemove?.()}>
              –
            </button>
          )}
        </div>

        <div className={cx(styles["children"])}>
          <div
            ref={drop}
            className={cx(
              styles["children-drop"],
              isOver && styles["dropping"]
            )}
            style={{ "--z-index": zIndex } as CSSProperties}
          >
            <motion.ul className={styles["views"]} layout="position">
              {content.map((block, index) => (
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
                  <View block={block} />
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>

        <div ref={modifierDropBottom} className={cx(styles["container"])}>
          <pre>{`}`}</pre>
        </div>
      </div>

      {children && <div className={styles["modifiers"]}>{children}</div>}
    </div>
  );
}
