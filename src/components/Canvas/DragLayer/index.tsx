import { useDragLayer } from "react-dnd";
import { IView, IViewModifier } from "@src/models/Editor";
import { ForegroundColorViewModifier } from "@src/components/blocks/modifiers/ForegroundColorViewModifier";
import { TextView } from "@src/components/blocks/views/TextView";
import styles from "./styles.module.scss";
import cx from "classnames";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { FontViewModifier } from "@src/components/blocks/modifiers/FontViewModifier";
import { VStackView } from "@src/components/blocks/views/VStackView";
import { ColorView } from "@src/components/blocks/views/ColorView";
import { SpacerView } from "@src/components/blocks/views/SpacerView";

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
            return <ColorView block={view} />;
          }
          case "Spacer": {
            return <SpacerView block={view} />;
          }
          case "Text": {
            return <TextView block={view} />;
          }
          case "VStack": {
            return <VStackView block={view} />;
          }
        }
      }

      case "modifier": {
        const modifier = item as IViewModifier;
        switch (modifier.type) {
          case "font": {
            return <FontViewModifier />;
          }
          case "foregroundColor": {
            return <ForegroundColorViewModifier />;
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
