import { useState } from "react";
import { useDrop } from "react-dnd";
import { ForegroundColorViewModifier } from "../ForegroundColorViewModifier";
import { TextView } from "../TextView";
import styles from "./styles.module.scss";
import { ViewModel } from "../../pages";
import { Toolbox } from "./Toolbox";
import { DragLayer } from "./DragLayer";
import { LayoutGroup, motion } from "framer-motion";

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
                          {!!view.modifiers.length && (
                            <motion.ul layout className={styles["modifiers"]}>
                              {view.modifiers.map((modifier, mIndex) => {
                                switch (modifier.type) {
                                  case "foregroundColor": {
                                    return (
                                      <motion.li
                                        key={modifier.id}
                                        layout="position"
                                        layoutId={modifier.id}
                                      >
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
                                      </motion.li>
                                    );
                                  }
                                  default: {
                                    return null;
                                  }
                                }
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

      <Toolbox open={toolbarOpen} onOpenChange={setToolbarOpen} />
    </div>
  );
}
