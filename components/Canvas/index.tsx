import { useState } from "react";
import { useDrop } from "react-dnd";
import { ForegroundColorViewModifier } from "../ForegroundColorViewModifier";
import { TextView } from "../TextView";
import styles from "./styles.module.scss";
import { ViewModel } from "../../pages";
import { Toolbox } from "./Toolbox";
import { DragLayer } from "./DragLayer";
import { AnimateSharedLayout, LayoutGroup, motion } from "framer-motion";
import { v4 } from "uuid";

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
      <DragLayer />

      {!views.length ? (
        <motion.p>Drag views onto the canvas.</motion.p>
      ) : (
        <div className={styles["views-container"]}>
          <LayoutGroup>
            <motion.ul className={styles["views"]} layout>
              {views.map((view, index) => {
                switch (view.type) {
                  case "Text": {
                    return (
                      <motion.li
                        key={view.id}
                        layout="position"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          type: "spring",
                          bounce: 0,
                          duration: 0.5,
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
                          {view.modifiers.map((modifier, mIndex) => {
                            switch (modifier.type) {
                              case "foregroundColor": {
                                return (
                                  <ForegroundColorViewModifier
                                    key={modifier.id}
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
                                              { ...modifier, props: { value } },
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
                          })}
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
          </LayoutGroup>
        </div>
      )}

      <Toolbox open={toolbarOpen} onOpenChange={setToolbarOpen} />
    </div>
  );
}
