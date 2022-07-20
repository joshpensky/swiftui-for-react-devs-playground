import type { NextPage } from "next";
import { useMemo, useState } from "react";
import { useDrop } from "react-dnd";
import isEqual from "lodash.isequal";
import {
  Color,
  ForegroundColorViewModifier,
} from "../components/ForegroundColorViewModifier";
import { TextView } from "../components/TextView";
import styles from "./styles/index.module.scss";

interface ForegroundColorViewModifierModel {
  type: "foregroundColor";
  props: {
    value: Color;
  };
}

export type ViewModifierModel = ForegroundColorViewModifierModel;

interface TextViewModel {
  type: "Text";
  props: {
    value: string;
  };
  modifiers: ViewModifierModel[];
}

export type ViewModel = TextViewModel;

const Home: NextPage = () => {
  const [views, setViews] = useState<ViewModel[]>([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "view",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    drop(item, monitor) {
      setViews((views) => [...views, item as ViewModel]);
    },
  }));

  const matched = useMemo(() => {
    return isEqual(views, [
      {
        type: "Text",
        props: { value: "Lorem ipsum dolor sit amet." },
        modifiers: [
          {
            type: "foregroundColor",
            props: {
              value: "blue",
            },
          },
        ],
      },
    ]);
  }, [views]);

  return (
    <div className={styles["page"]}>
      <h1>How would you write the following code in SwiftUI?</h1>

      <code className={styles["code"]}>
        <pre>
          {`<p style={{ color: ‘blue’ }}>
  Lorem ipsum dolor sit amet.
</p>`}
        </pre>
      </code>

      <div className={styles["play-area"]}>
        <div
          ref={drop}
          className={styles["canvas"]}
          style={{ boxShadow: isOver ? "inset 0 0 0 3px #2868E4" : "none" }}
        >
          {!views.length && <p>Drag views onto the canvas.</p>}

          {views.map((view, index) => {
            switch (view.type) {
              case "Text": {
                return (
                  <TextView
                    key={index}
                    value={view.props.value}
                    onChange={(value) => {
                      setViews((views) => {
                        return [
                          ...views.slice(0, index),
                          { ...views[index], props: { value } },
                          ...views.slice(index + 1),
                        ];
                      });
                    }}
                    onModifier={(modifier) => {
                      setViews((views) => {
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
                      setViews((views) => {
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
                                setViews((views) => {
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
                                setViews((views) => {
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

        <div className={styles["toolbox"]}>
          <h2>Views</h2>
          <ul>
            <li>
              <TextView preview value="" />
              <p>
                <strong>Text</strong>
              </p>
              <p>Display text content.</p>
            </li>
          </ul>

          <h2>View Modifiers</h2>
          <ul>
            <li>
              <ForegroundColorViewModifier preview value="red" />
              <p>
                <strong>Foreground Color</strong>
              </p>
              <p>Set the color of foreground elements.</p>
            </li>
          </ul>
        </div>
      </div>

      <p>{matched ? "✅ Good" : "❌ Bad"}</p>

      <details>
        <summary>JSON representation</summary>
        <pre>{JSON.stringify(views, null, 2)}</pre>
      </details>
    </div>
  );
};

export default Home;
