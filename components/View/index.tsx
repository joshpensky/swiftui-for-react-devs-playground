import { createContext, useContext } from "react";
import { IView } from "../../types";
import { TextView } from "../TextView";
import { VStackView } from "../VStackView";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";
import { FontViewModifier } from "../FontViewModifier";
import { ForegroundColorViewModifier } from "../ForegroundColorViewModifier";
import { EditorContext } from "../../models/Editor";
import { ColorView } from "../ColorView";
import { SpacerView } from "../SpacerView";
import { Flipped } from "react-flip-toolkit";

export const ZIndexContext = createContext(0);

export function View({ view }: { view: IView }) {
  const [editor, onEditorChange] = useContext(EditorContext);

  let modifiers = null;
  if (view.modifiers.length) {
    modifiers = (
      <ul className={styles["modifiers"]}>
        {view.modifiers.map((modifier, mIndex) => {
          return (
            <Flipped key={modifier.id} flipId={modifier.id}>
              <li className="vm-container">
                {(() => {
                  switch (modifier.type) {
                    case "font": {
                      return (
                        <FontViewModifier
                          id={modifier.id}
                          value={modifier.props.value}
                          onChange={(value) => {
                            onEditorChange(
                              editor.updateModifier(modifier.id, {
                                ...modifier,
                                props: { value },
                              })
                            );
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
                            onEditorChange(
                              editor.updateModifier(modifier.id, {
                                ...modifier,
                                props: { value },
                              })
                            );
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
              </li>
            </Flipped>
          );
        })}
      </ul>
    );
  }

  const zIndex = useContext(ZIndexContext);

  return (
    <ZIndexContext.Provider value={zIndex + 1}>
      {(() => {
        switch (view.type) {
          case "Color": {
            return (
              <ColorView
                id={view.id}
                value={view.props.value}
                onChange={(value) => {
                  onEditorChange(
                    editor.updateView(view.id, {
                      ...view,
                      props: { value },
                    })
                  );
                }}
                onModifier={(modifier) => {
                  onEditorChange(editor.insertModifier(modifier, view.id));
                }}
                onRemove={() => {
                  onEditorChange(editor.removeView(view.id));
                }}
              >
                {modifiers}
              </ColorView>
            );
          }

          case "Spacer": {
            return (
              <SpacerView
                id={view.id}
                onModifier={(modifier) => {
                  onEditorChange(editor.insertModifier(modifier, view.id));
                }}
                onRemove={() => {
                  onEditorChange(editor.removeView(view.id));
                }}
              >
                {modifiers}
              </SpacerView>
            );
          }

          case "Text": {
            return (
              <TextView
                id={view.id}
                value={view.props.value}
                onChange={(value) => {
                  onEditorChange(
                    editor.updateView(view.id, {
                      ...view,
                      props: { value },
                    })
                  );
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

          case "VStack": {
            return (
              <VStackView
                id={view.id}
                content={view.props.children}
                onChild={(child) => {
                  onEditorChange(editor.insertView(child, view.id));
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

          default: {
            return null;
          }
        }
      })()}
    </ZIndexContext.Provider>
  );
}
