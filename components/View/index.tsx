import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { IView } from "../../types";
import { TextView } from "../TextView";
import { VStackView } from "../VStackView";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";
import { FontViewModifier } from "../FontViewModifier";
import { ForegroundColorViewModifier } from "../ForegroundColorViewModifier";
import { Editor, EditorContext } from "../../models/Editor";

export const ZIndexContext = createContext(0);

export function View({ view }: { view: IView }) {
  const [editor, onEditorChange] = useContext(EditorContext);

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
                          // onViewsChange((views) => {
                          //   return [
                          //     ...views.slice(0, index),
                          //     {
                          //       ...views[index],
                          //       modifiers: [
                          //         ...view.modifiers.slice(0, mIndex),
                          //         {
                          //           ...modifier,
                          //           props: { value },
                          //         },
                          //         ...view.modifiers.slice(mIndex + 1),
                          //       ],
                          //     },
                          //     ...views.slice(index + 1),
                          //   ];
                          // });
                        }}
                        onRemove={() => {
                          onEditorChange(editor.removeModifier(modifier.id));
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
                          // onViewsChange((views) => {
                          //   return [
                          //     ...views.slice(0, index),
                          //     {
                          //       ...views[index],
                          //       modifiers: [
                          //         ...view.modifiers.slice(0, mIndex),
                          //         {
                          //           ...modifier,
                          //           props: { value },
                          //         },
                          //         ...view.modifiers.slice(mIndex + 1),
                          //       ],
                          //     },
                          //     ...views.slice(index + 1),
                          //   ];
                          // });
                        }}
                        onRemove={() => {
                          onEditorChange(editor.removeModifier(modifier.id));
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
                onChild={(child) => {
                  onEditorChange(editor.insertView(child, view.id));
                }}
                onChildChange={(action) => {
                  // onViewsChange((views) => {
                  //   return [
                  //     ...views.slice(0, index),
                  //     {
                  //       ...(views[index] as IVStackView),
                  //       props: {
                  //         children:
                  //           typeof action === "function"
                  //             ? action(
                  //                 (views[index] as IVStackView).props.children
                  //               )
                  //             : action,
                  //       },
                  //     },
                  //     ...views.slice(index + 1),
                  //   ];
                  // });
                }}
                onModifier={(modifier) => {
                  onEditorChange(editor.insertModifier(modifier, view.id));
                }}
                onRemove={() => {
                  onEditorChange(editor.removeView(view.id));
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
                  // onViewsChange((views) => {
                  //   return [
                  //     ...views.slice(0, index),
                  //     {
                  //       ...(views[index] as ITextView),
                  //       props: { value },
                  //     },
                  //     ...views.slice(index + 1),
                  //   ];
                  // });
                }}
                onModifier={(modifier) => {
                  onEditorChange(editor.insertModifier(modifier, view.id));
                }}
                onRemove={() => {
                  onEditorChange(editor.removeView(view.id));
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
