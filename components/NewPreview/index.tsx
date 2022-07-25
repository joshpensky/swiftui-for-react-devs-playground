import get from "lodash.get";
import Image from "next/image";
import { CSSProperties, Fragment } from "react";
import { IControl, IView } from "../../models/NewEditor.test";
import styles from "./styles.module.scss";

export function Block({
  block,
  scope,
}: {
  block: IControl | IView;
  scope: Record<string, any>;
}) {
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
            return null;
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
              style={{ "--color": value } as CSSProperties}
            />
          );
        }

        case "ForEach": {
          const { data: dataVariable, id, scopeVariable, content } = block.args;

          const data = get(scope, dataVariable);
          if (!Array.isArray(data)) {
            // TODO: throw up error;
            return null;
          }

          return (
            <div className={styles["foreach"]}>
              {data.map((item) => {
                let scopeWithData = { ...scope, [scopeVariable]: item };
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
            <div className={styles["hstack"]}>
              {content.map((block) => (
                <Block key={block.id} block={block} scope={scope} />
              ))}
            </div>
          );
        }

        case "Image": {
          const { systemName } = block.args;
          return (
            <Image
              src={`/systemImages/${systemName}.png`}
              alt=""
              width={20}
              height={20}
            />
          );
        }

        case "Text": {
          const { value } = block.args;
          let displayValue = value;
          if (typeof get(scope, value) === "string") {
            displayValue = get(scope, value);
          }
          return <p className={styles["text"]}>{displayValue}</p>;
        }

        case "ZStack": {
          const { content } = block.args;
          return (
            <div className={styles["zstack"]}>
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

  return null;
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
