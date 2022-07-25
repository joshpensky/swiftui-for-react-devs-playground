import get from "lodash.get";
import Image from "next/image";
import cx from "classnames";
import { CSSProperties, Fragment } from "react";
import {
  Editor,
  IBackgroundViewModifier,
  IControl,
  IView,
  IViewModifier,
} from "../../models/Editor";
import styles from "./styles.module.scss";

const flexTypes: (IControl | IView | IViewModifier)["type"][] = ["Color"];

export function withBackground(
  scope: Record<string, any>,
  configuration: IBackgroundViewModifier,
  options: { shouldFlex: boolean }
) {
  return function WithBackground(element: JSX.Element) {
    return (
      <div
        className={cx(
          styles["background__root"],
          options.shouldFlex && styles["_flex"]
        )}
      >
        {element}
        <div className={styles["background__element"]}>
          {configuration.args.content.map((block) => (
            <Block key={block.id} block={block} scope={scope} />
          ))}
        </div>
      </div>
    );
  };
}

export function Block({
  block,
  scope,
}: {
  block: IControl | IView;
  scope: Record<string, any>;
}) {
  const scopedEditor = new Editor({ scope, tree: [block] });

  const shouldFlex = flexTypes.some(
    (type) => block.type === type || scopedEditor.contains(type, block.id)
  );

  const modifierStyle: CSSProperties & Record<`--${string}`, any> = {};
  const modifierHocs: ((element: JSX.Element) => JSX.Element)[] = [];

  if (block.blockType === "view") {
    for (let modifier of block.modifiers) {
      switch (modifier.type) {
        case "background": {
          modifierHocs.push(withBackground(scope, modifier, { shouldFlex }));
          break;
        }

        case "font": {
          switch (modifier.args.value) {
            case "body": {
              modifierStyle["--font"] = "16px sans-serif";
              break;
            }
            case "title": {
              modifierStyle["--font"] = "32px sans-serif";
              break;
            }
          }
          break;
        }

        case "foregroundColor": {
          modifierStyle["--color"] = modifier.args.color;
        }
      }
    }
  }

  function renderBlock() {
    switch (block.blockType) {
      case "control": {
        switch (block.type) {
          case "if": {
            const { condition, content } = block.args;

            let conditionValue = false;
            if (typeof get(scope, condition) === "boolean") {
              conditionValue = get(scope, condition);
            } else if (condition === "true") {
              conditionValue = true;
            } else if (condition === "false") {
              conditionValue = false;
            } else {
              // TODO: throw up error
              return <Fragment />;
            }

            if (conditionValue) {
              return (
                <Fragment>
                  {content.map((block) => (
                    <Block key={block.id} block={block} scope={scope} />
                  ))}
                </Fragment>
              );
            }
          }
        }
      }

      case "view": {
        switch (block.type) {
          case "Color": {
            const { value } = block.args;

            return (
              <div
                className={styles["color"]}
                style={{ ...modifierStyle, "--color": value } as CSSProperties}
              />
            );
          }

          case "ForEach": {
            const { data: dataVariable, id, content } = block.args;

            const data = get(scope, dataVariable);
            if (!Array.isArray(data)) {
              // TODO: throw up error;
              return <Fragment />;
            }

            return (
              <div
                className={cx(styles["foreach"], shouldFlex && styles["_flex"])}
                style={modifierStyle}
              >
                {data.map((item) => {
                  let scopeWithData = { ...scope, $0: item };
                  return (
                    <Fragment key={item[id]}>
                      {content.map((block) => (
                        <Block
                          key={block.id}
                          block={block}
                          scope={scopeWithData}
                        />
                      ))}
                    </Fragment>
                  );
                })}
              </div>
            );
          }

          case "HStack": {
            const { content } = block.args;
            return (
              <div
                className={cx(styles["hstack"], shouldFlex && styles["_flex"])}
                style={modifierStyle}
              >
                {content.map((block) => (
                  <Block key={block.id} block={block} scope={scope} />
                ))}
              </div>
            );
          }

          case "Image": {
            const { systemName } = block.args;
            // TODO: convert to SVG so they work with `--color`!
            return (
              <Image
                style={modifierStyle}
                src={`/systemImages/${systemName}.png`}
                alt=""
                width={20}
                height={20}
              />
            );
          }

          case "Spacer": {
            return <div className={styles["spacer"]} />;
          }

          case "Text": {
            const { value } = block.args;
            let displayValue = value;
            if (typeof get(scope, value) === "string") {
              displayValue = get(scope, value);
            }
            return (
              <p className={styles["text"]} style={modifierStyle}>
                {displayValue}
              </p>
            );
          }

          case "VStack": {
            const { content } = block.args;
            return (
              <div
                className={cx(styles["vstack"], shouldFlex && styles["_flex"])}
                style={modifierStyle}
              >
                {content.map((block) => (
                  <Block key={block.id} block={block} scope={scope} />
                ))}
              </div>
            );
          }

          case "ZStack": {
            const { content } = block.args;
            return (
              <div
                className={cx(styles["zstack"], shouldFlex && styles["_flex"])}
                style={modifierStyle}
              >
                {content.map((block) => (
                  <div key={block.id} className={styles["zstack__child"]}>
                    <Block block={block} scope={scope} />
                  </div>
                ))}
              </div>
            );
          }
        }
      }
    }

    return <Fragment />;
  }

  return modifierHocs.reduce((acc, hoc) => hoc(acc), renderBlock());
}

export function Preview({
  block,
  scope,
}: {
  block?: IControl | IView;
  scope: Record<string, any>;
}) {
  return (
    <div className={styles["phone"]}>
      <div className={styles["left-buttons"]} />
      <div className={styles["screen"]}>
        {block && <Block block={block} scope={scope} />}
      </div>
    </div>
  );
}
