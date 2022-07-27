import { useEffect } from "react";
import cx from "classnames";
import { motion } from "framer-motion";
import { useDragLayer } from "react-dnd";
import { IfControl } from "@src/components/blocks/controls/IfControl";
import { BackgroundViewModifier } from "@src/components/blocks/modifiers/BackgroundViewModifier";
import { FontViewModifier } from "@src/components/blocks/modifiers/FontViewModifier";
import { ForegroundColorViewModifier } from "@src/components/blocks/modifiers/ForegroundColorViewModifier";
import { ColorView } from "@src/components/blocks/views/ColorView";
import { ForEachView } from "@src/components/blocks/views/ForEachView";
import { HStackView } from "@src/components/blocks/views/HStackView";
import { ImageView } from "@src/components/blocks/views/ImageView";
import { SpacerView } from "@src/components/blocks/views/SpacerView";
import { TextView } from "@src/components/blocks/views/TextView";
import { VStackView } from "@src/components/blocks/views/VStackView";
import { IControl, IView, IViewModifier } from "@src/models/Editor";
import styles from "./styles.module.scss";

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
      case "control": {
        const control = item as IControl;
        switch (control.type) {
          case "if": {
            return <IfControl block={control} />;
          }
        }
      }

      case "view": {
        const view = item as IView;
        switch (view.type) {
          case "Color": {
            return <ColorView block={view} />;
          }
          case "ForEach": {
            return <ForEachView block={view} />;
          }
          case "HStack": {
            return <HStackView block={view} />;
          }
          case "Image": {
            return <ImageView block={view} />;
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
          case "background": {
            return <BackgroundViewModifier block={modifier} />;
          }
          case "font": {
            return <FontViewModifier block={modifier} />;
          }
          case "foregroundColor": {
            return <ForegroundColorViewModifier block={modifier} />;
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
        // layoutId={item.id}
        hidden={!currentOffset}
      >
        {renderItem()}
      </motion.li>
    </motion.ul>
  );
}
