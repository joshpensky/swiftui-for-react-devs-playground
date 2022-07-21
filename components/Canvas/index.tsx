import { useState } from "react";
import { useDrop } from "react-dnd";
import cx from "classnames";
import { ForegroundColorViewModifier } from "../ForegroundColorViewModifier";
import { TextView } from "../TextView";
import styles from "./styles.module.scss";
import { IView } from "../../pages";
import { Library } from "./Library";
import { DragLayer } from "./DragLayer";
import { LayoutGroup, motion } from "framer-motion";
import { FontViewModifier } from "../FontViewModifier";

export function Canvas({
  views,
  onViewsChange,
}: {
  views: IView[];
  onViewsChange(views: IView[] | ((views: IView[]) => IView[])): void;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "view",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
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
            <motion.ul className={styles["views"]} layout>
              {views.map((view, index) => {
                switch (view.type) {
                  case "Text": {
                    return (
                      <motion.li
                        key={view.id}
                        layout="position"
                        layoutId={view.id}
                        transition={{
                          type: "spring",
                          bounce: 0,
                          duration: 0.25,
                        }}
                      >
                        <TextView
                          id={view.id}
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
                                  modifiers: [
                                    ...views[index].modifiers,
                                    modifier,
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
                                ...views.slice(index + 1),
                              ];
                            });
                          }}
                        >
                          {!!view.modifiers.length && (
                            <motion.ul layout className={styles["modifiers"]}>
                              {view.modifiers.map((modifier, mIndex) => {
                                return (
                                  <motion.li
                                    key={modifier.id}
                                    className="vm-container"
                                    layout="position"
                                    layoutId={modifier.id}
                                    transition={{
                                      type: "spring",
                                      bounce: 0,
                                      duration: 0.25,
                                    }}
                                  >
                                    {(() => {
                                      switch (modifier.type) {
                                        case "font": {
                                          return (
                                            <FontViewModifier
                                              id={modifier.id}
                                              value={modifier.props.value}
                                              onChange={(value) => {
                                                onViewsChange((views) => {
                                                  return [
                                                    ...views.slice(0, index),
                                                    {
                                                      ...views[index],
                                                      modifiers: [
                                                        ...view.modifiers.slice(
                                                          0,
                                                          mIndex
                                                        ),
                                                        {
                                                          ...modifier,
                                                          props: { value },
                                                        },
                                                        ...view.modifiers.slice(
                                                          mIndex + 1
                                                        ),
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
                                                        ...view.modifiers.slice(
                                                          0,
                                                          mIndex
                                                        ),
                                                        ...view.modifiers.slice(
                                                          mIndex + 1
                                                        ),
                                                      ],
                                                    },
                                                    ...views.slice(index + 1),
                                                  ];
                                                });
                                              }}
                                            />
                                          );
                                        }

                                        case "foregroundColor": {
                                          return (
                                            <ForegroundColorViewModifier
                                              id={modifier.id}
                                              value={modifier.props.value}
                                              onChange={(value) => {
                                                onViewsChange((views) => {
                                                  return [
                                                    ...views.slice(0, index),
                                                    {
                                                      ...views[index],
                                                      modifiers: [
                                                        ...view.modifiers.slice(
                                                          0,
                                                          mIndex
                                                        ),
                                                        {
                                                          ...modifier,
                                                          props: { value },
                                                        },
                                                        ...view.modifiers.slice(
                                                          mIndex + 1
                                                        ),
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
                                                        ...view.modifiers.slice(
                                                          0,
                                                          mIndex
                                                        ),
                                                        ...view.modifiers.slice(
                                                          mIndex + 1
                                                        ),
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
                                    })()}
                                  </motion.li>
                                );
                              })}
                            </motion.ul>
                          )}
                        </TextView>
                      </motion.li>
                    );
                  }
                  default: {
                    return null;
                  }
                }
              })}
            </motion.ul>
          </div>
        )}
      </LayoutGroup>

      <Library open={toolbarOpen} onOpenChange={setToolbarOpen} />
    </div>
  );
}
