import {
  CSSProperties,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useDrag, useDrop } from "react-dnd";
import cx from "classnames";
import { IView, IViewModifier } from "../../pages";
import styles from "./styles.module.scss";
import { motion } from "framer-motion";
import { View, ZIndexContext } from "../View";

export function VStackView({
  children,
  content,
  onDrag,
  onRemove,
  onChild,
  onChildChange,
  onModifier,
  preview,
  id: propsId,
}: PropsWithChildren<{
  id?: string;
  preview?: boolean;
  content: IView[];
  onDrag?(): void;
  onChild?(view: IView): void;
  onChildChange?(action: SetStateAction<IView[]>): void;
  onModifier?(modifier: IViewModifier): void;
  onRemove?(): void;
}>) {
  const _id = useId();
  let id = propsId ?? _id;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "view",
    item: {
      id,
      type: "VStack",
      props: {
        children: [],
      },
      modifiers: [],
    },
    canDrag(monitor) {
      return !!preview;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    if (isDragging) {
      onDrag?.();
    }
  }, [isDragging, onDrag]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "view",
    collect: (monitor) => ({
      isOver: !preview && monitor.isOver({ shallow: true }),
    }),
    canDrop(item, monitor) {
      return monitor.isOver({ shallow: true });
    },
    drop(item, monitor) {
      onChild?.(item as IView);
    },
  }));

  const [{ isModifierOver }, modifierDrop] = useDrop(() => ({
    accept: "view-modifier",
    collect: (monitor) => ({
      isModifierOver: !preview && monitor.isOver({ shallow: true }),
    }),
    canDrop(item, monitor) {
      return monitor.isOver({ shallow: true });
    },
    drop(item, monitor) {
      onModifier?.(item as IViewModifier);
    },
  }));

  const zIndex = useContext(ZIndexContext);

  return (
    <div
      ref={drag}
      className={cx(
        styles["view"],
        preview && styles["preview"],
        isDragging && styles["dragging"]
      )}
      style={{
        cursor: preview ? (isDragging ? "grabbing" : "grab") : "default",
      }}
    >
      <div
        ref={modifierDrop}
        className={cx(
          styles["container"],
          isModifierOver && styles["dropping"]
        )}
      >
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
          className={cx(styles["children-drop"], isOver && styles["dropping"])}
          style={{ "--z-index": zIndex } as CSSProperties}
        >
          {!!content.length && (
            <motion.ul className={styles["views"]} /*layout*/>
              {content.map((view, index) => (
                <motion.li
                  key={view.id}
                  // layout="position"
                  // layoutId={view.id}
                  transition={{
                    type: "spring",
                    bounce: 0,
                    duration: 0.25,
                  }}
                >
                  <View
                    view={view}
                    index={index}
                    onViewsChange={(action) => onChildChange?.(action)}
                  />
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>
      </div>

      <div className={cx(styles["container"])}>
        <pre>{`}`}</pre>
      </div>

      <div className={styles["modifiers"]}>{children}</div>
    </div>
  );
}
