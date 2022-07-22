import { Dispatch, SetStateAction, useState } from "react";
import { useDrop } from "react-dnd";
import cx from "classnames";
import { ForegroundColorViewModifier } from "../ForegroundColorViewModifier";
import { TextView } from "../TextView";
import styles from "./styles.module.scss";
import { IView, ITextView, IVStackView } from "../../types";
import { Library } from "./Library";
import { DragLayer } from "./DragLayer";
import { LayoutGroup, motion } from "framer-motion";
import { FontViewModifier } from "../FontViewModifier";
import { VStackView } from "../VStackView";
import { View } from "../View";

export function Canvas({
  views,
  onViewsChange,
}: {
  views: IView[];
  onViewsChange: Dispatch<SetStateAction<IView[]>>;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "view",
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
    canDrop(item, monitor) {
      return monitor.isOver({ shallow: true });
    },
    drop(item, monitor) {
      onViewsChange((views) => [...views, item as IView]);
    },
  }));

  const [toolbarOpen, setToolbarOpen] = useState(false);

  return (
    <div
      ref={drop}
      className={cx(styles["canvas"], isOver && styles["dropping"])}
    >
      <LayoutGroup>
        <DragLayer />
        {!views.length ? (
          <motion.p>Drag views onto the canvas.</motion.p>
        ) : (
          <div className={styles["views-container"]}>
            <motion.ul className={styles["views"]} /*layout*/>
              {views.map((view, index) => {
                return (
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
                      onViewsChange={onViewsChange}
                    />
                  </motion.li>
                );
              })}
            </motion.ul>
          </div>
        )}
      </LayoutGroup>

      <Library open={toolbarOpen} onOpenChange={setToolbarOpen} />
    </div>
  );
}
