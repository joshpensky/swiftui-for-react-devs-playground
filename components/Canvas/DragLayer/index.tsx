import { useDragLayer } from "react-dnd";
import { IView, IViewModifier } from "../../../types";
import { ForegroundColorViewModifier } from "../../ForegroundColorViewModifier";
import { TextView } from "../../TextView";
import styles from "./styles.module.scss";
import cx from "classnames";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontViewModifier } from "../../FontViewModifier";
import { VStackView } from "../../VStackView";
import { ColorView } from "../../ColorView";
import { SpacerView } from "../../SpacerView";

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
        const view = item as IView;
        switch (view.type) {
          case "Color": {
            return <ColorView preview value="red" />;
          }
          case "Spacer": {
            return <SpacerView preview />;
          }
          case "Text": {
            return <TextView preview value="" />;
          }
          case "VStack": {
            return <VStackView preview content={[]} />;
          }
        }
      }

      case "view-modifier": {
        const modifier = item as IViewModifier;
        switch (modifier.type) {
          case "font": {
            return <FontViewModifier preview value="body" />;
          }
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
        transition={{ duration: 0 }}
        layoutId={item.id}
        hidden={!currentOffset}
      >
        {renderItem()}
      </motion.li>
    </motion.ul>
  );
}
