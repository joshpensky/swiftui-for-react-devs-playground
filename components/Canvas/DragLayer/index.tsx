import { useDragLayer } from "react-dnd";
import { ViewModel, ViewModifierModel } from "../../../pages";
import { ForegroundColorViewModifier } from "../../ForegroundColorViewModifier";
import { TextView } from "../../TextView";
import styles from "./styles.module.scss";
import cx from "classnames";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function DragLayer() {
  const { itemType, isDragging, item, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    })
  );

  useEffect(() => {
    document.body.classList.toggle(styles["dragging"], isDragging);
  }, [isDragging]);

  function renderItem() {
    switch (itemType) {
      case "view": {
        const view = item as ViewModel;
        switch (view.type) {
          case "Text": {
            return <TextView preview value="" />;
          }
        }
      }

      case "view-modifier": {
        const modifier = item as ViewModifierModel;
        switch (modifier.type) {
          case "foregroundColor": {
            return <ForegroundColorViewModifier preview value="red" />;
          }
        }
      }

      default:
        return null;
    }
  }

  if (!isDragging) {
    return null;
  }

  return (
    <motion.ul className={styles["layer"]}>
      <motion.li
        className={cx(styles["item"], "dragging")}
        animate={{
          x: currentOffset?.x ?? 0,
          y: currentOffset?.y ?? 0,
          opacity: 0.9,
        }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        transition={{
          duration: 0,
          layout: { duration: 0.2 },
        }}
        layoutId={item.id}
        hidden={!currentOffset}
      >
        {renderItem()}
      </motion.li>
    </motion.ul>
  );
}
