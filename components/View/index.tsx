import { createContext, useContext } from "react";
import { IControl, IView } from "../../models/NewEditor";
import { TextView } from "../TextView";
import { VStackView } from "../VStackView";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";
import { FontViewModifier } from "../FontViewModifier";
import { ForegroundColorViewModifier } from "../ForegroundColorViewModifier";
import { EditorContext } from "../../context/EditorContext";
import { ColorView } from "../ColorView";
import { SpacerView } from "../SpacerView";

export const ZIndexContext = createContext(0);

export function View({ block }: { block: IControl | IView }) {
  const [editor, onEditorChange] = useContext(EditorContext);

  let modifiers = null;
  if (block.blockType === "view" && block.modifiers.length) {
    modifiers = (
      <motion.ul className={styles["modifiers"]} layout="position">
        {block.modifiers.map((modifier, mIndex) => {
          return (
            <motion.li
              key={modifier.id}
              className="vm-container"
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
                        value={modifier.args.value}
                        onChange={(value) => {
                          onEditorChange(
                            editor.update(modifier.id, {
                              ...modifier,
                              args: { value },
                            })
                          );
                        }}
                        onRemove={() => {
                          onEditorChange(editor.delete(modifier.id));
                        }}
                      />
                    );
                  }

                  case "foregroundColor": {
                    return (
                      <ForegroundColorViewModifier
                        id={modifier.id}
                        color={modifier.args.color}
                        onChange={(color) => {
                          onEditorChange(
                            editor.update(modifier.id, {
                              ...modifier,
                              args: { color },
                            })
                          );
                        }}
                        onRemove={() => {
                          onEditorChange(editor.delete(modifier.id));
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
        switch (block.type) {
          case "Color": {
            return (
              <ColorView
                id={block.id}
                value={block.args.value}
                onChange={(value) => {
                  onEditorChange(
                    editor.update(block.id, {
                      ...block,
                      args: { value },
                    })
                  );
                }}
                onModifier={(modifier) => {
                  onEditorChange(editor.insert(modifier, block.id));
                }}
                onRemove={() => {
                  onEditorChange(editor.delete(block.id));
                }}
              >
                {modifiers}
              </ColorView>
            );
          }

          case "Spacer": {
            return (
              <SpacerView
                id={block.id}
                onModifier={(modifier) => {
                  onEditorChange(editor.insert(modifier, block.id));
                }}
                onRemove={() => {
                  onEditorChange(editor.delete(block.id));
                }}
              >
                {modifiers}
              </SpacerView>
            );
          }

          case "Text": {
            return (
              <TextView
                id={block.id}
                value={block.args.value}
                onChange={(value) => {
                  onEditorChange(
                    editor.update(block.id, {
                      ...block,
                      args: { value },
                    })
                  );
                }}
                onModifier={(modifier) => {
                  onEditorChange(editor.insert(modifier, block.id));
                }}
                onRemove={() => {
                  onEditorChange(editor.delete(block.id));
                }}
              >
                {modifiers}
              </TextView>
            );
          }

          case "VStack": {
            return (
              <VStackView
                id={block.id}
                content={block.args.content}
                onModifier={(modifier) => {
                  onEditorChange(editor.insert(modifier, block.id));
                }}
                onRemove={() => {
                  onEditorChange(editor.delete(block.id));
                }}
              >
                {modifiers}
              </VStackView>
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
