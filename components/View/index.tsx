import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { ITextView, IView, IVStackView } from "../../types";
import { TextView } from "../TextView";
import { VStackView } from "../VStackView";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";
import { FontViewModifier } from "../FontViewModifier";
import { ForegroundColorViewModifier } from "../ForegroundColorViewModifier";

export const ZIndexContext = createContext(0);

export function View({
  view,
  index,
  onViewsChange,
}: {
  view: IView;
  index: number;
  onViewsChange: Dispatch<SetStateAction<IView[]>>;
}) {
  let modifiers = null;
  if (view.modifiers.length) {
    modifiers = (
      <motion.ul /*layout*/ className={styles["modifiers"]}>
        {view.modifiers.map((modifier, mIndex) => {
          return (
            <motion.li
              key={modifier.id}
              className="vm-container"
              // layout="position"
              // layoutId={modifier.id}
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
                                  ...view.modifiers.slice(0, mIndex),
                                  {
                                    ...modifier,
                                    props: { value },
                                  },
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
                                  ...view.modifiers.slice(0, mIndex),
                                  {
                                    ...modifier,
                                    props: { value },
                                  },
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
              })()}
            </motion.li>
          );
        })}
      </motion.ul>
    );
  }

  const zIndex = useContext(ZIndexContext);

  return (
    <ZIndexContext.Provider value={zIndex + 1}>
      {(() => {
        switch (view.type) {
          case "VStack": {
            return (
              <VStackView
                id={view.id}
                content={view.props.children}
                onChild={(view) => {
                  onViewsChange((views) => {
                    return [
                      ...views.slice(0, index),
                      {
                        ...(views[index] as IVStackView),
                        props: {
                          children: [
                            ...(views[index] as IVStackView).props.children,
                            view,
                          ],
                        },
                      },
                      ...views.slice(index + 1),
                    ];
                  });
                }}
                onChildChange={(action) => {
                  onViewsChange((views) => {
                    return [
                      ...views.slice(0, index),
                      {
                        ...(views[index] as IVStackView),
                        props: {
                          children:
                            typeof action === "function"
                              ? action(
                                  (views[index] as IVStackView).props.children
                                )
                              : action,
                        },
                      },
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
                {modifiers}
              </VStackView>
            );
          }

          case "Text": {
            return (
              <TextView
                id={view.id}
                value={view.props.value}
                onChange={(value) => {
                  onViewsChange((views) => {
                    return [
                      ...views.slice(0, index),
                      {
                        ...(views[index] as ITextView),
                        props: { value },
                      },
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
                {modifiers}
              </TextView>
            );
          }
          default: {
            return null;
          }
        }
      })()}
    </ZIndexContext.Provider>
  );
}
