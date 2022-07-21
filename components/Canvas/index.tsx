import { useState } from "react";
import { useDrop } from "react-dnd";
import { ForegroundColorViewModifier } from "../ForegroundColorViewModifier";
import { TextView } from "../TextView";
import styles from "./styles.module.scss";
import { ViewModel } from "../../pages";
import { Toolbox } from "./Toolbox";
import { DragLayer } from "./DragLayer";

export function Canvas({
  views,
  onViewsChange,
}: {
  views: ViewModel[];
  onViewsChange(
    views: ViewModel[] | ((views: ViewModel[]) => ViewModel[])
  ): void;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "view",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    drop(item, monitor) {
      onViewsChange((views) => [...views, item as ViewModel]);
    },
  }));

  const [toolbarOpen, setToolbarOpen] = useState(false);

  return (
    <div
      ref={drop}
      className={styles["canvas"]}
      style={{ boxShadow: isOver ? "inset 0 0 0 3px #2868E4" : "none" }}
    >
      {!views.length && <p>Drag views onto the canvas.</p>}

      <DragLayer />

      <div className={styles["views"]}>
        {views.map((view, index) => {
          switch (view.type) {
            case "Text": {
              return (
                <TextView
                  key={index}
                  value={view.props.value}
                  onChange={(value) => {
                    onViewsChange((views) => {
                      return [
                        ...views.slice(0, index),
                        { ...views[index], props: { value } },
                        ...views.slice(index + 1),
                      ];
                    });
                  }}
                  onModifier={(modifier) => {
                    onViewsChange((views) => {
                      return [
                        ...views.slice(0, index),
                        {
                          ...views[index],
                          modifiers: [...views[index].modifiers, modifier],
                        },
                        ...views.slice(index + 1),
                      ];
                    });
                  }}
                  onRemove={() => {
                    onViewsChange((views) => {
                      return [
                        ...views.slice(0, index),
                        ...views.slice(index + 1),
                      ];
                    });
                  }}
                >
                  {view.modifiers.map((modifier, mIndex) => {
                    switch (modifier.type) {
                      case "foregroundColor": {
                        return (
                          <ForegroundColorViewModifier
                            key={mIndex}
                            value={modifier.props.value}
                            onChange={(value) => {
                              onViewsChange((views) => {
                                return [
                                  ...views.slice(0, index),
                                  {
                                    ...views[index],
                                    modifiers: [
                                      ...view.modifiers.slice(0, mIndex),
                                      { ...modifier, props: { value } },
                                      ...view.modifiers.slice(mIndex + 1),
                                    ],
                                  },
                                  ...views.slice(index + 1),
                                ];
                              });
                            }}
                            onRemove={() => {
                              onViewsChange((views) => {
                                return [
                                  ...views.slice(0, index),
                                  {
                                    ...views[index],
                                    modifiers: [
                                      ...view.modifiers.slice(0, mIndex),
                                      ...view.modifiers.slice(mIndex + 1),
                                    ],
                                  },
                                  ...views.slice(index + 1),
                                ];
                              });
                            }}
                          />
                        );
                      }
                      default: {
                        return null;
                      }
                    }
                  })}
                </TextView>
              );
            }
            default: {
              return null;
            }
          }
        })}
      </div>

      <Toolbox open={toolbarOpen} onOpenChange={setToolbarOpen} />
    </div>
  );
}
