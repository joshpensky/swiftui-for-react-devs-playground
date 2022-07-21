import { useDragLayer, XYCoord } from "react-dnd";
import cx from "classnames";
import { ViewModel, ViewModifierModel } from "../../../pages";
import { ForegroundColorViewModifier } from "../../ForegroundColorViewModifier";
import { TextView } from "../../TextView";
import styles from "./styles.module.scss";
import { CSSProperties, useEffect } from "react";

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
    <div className={styles["layer"]}>
      <div
        className={styles["item"]}
        style={
          {
            "--x": `${currentOffset?.x ?? 0}px`,
            "--y": `${currentOffset?.y ?? 0}px`,
          } as CSSProperties
        }
        hidden={!currentOffset}
      >
        {renderItem()}
      </div>
    </div>
  );
}
