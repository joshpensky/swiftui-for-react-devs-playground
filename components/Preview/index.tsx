import { Fragment } from "react";
import { IView } from "../../pages";
import styles from "./styles.module.scss";

export function Preview({ view }: { view?: IView }) {
  function renderView(view: IView) {
    const modifierStyles: Record<string, any> = {};
    [...view.modifiers].reverse().forEach((modifier) => {
      switch (modifier.type) {
        case "font": {
          switch (modifier.props.value) {
            case "title": {
              modifierStyles["--font"] = "32px sans-serif";
              break;
            }
            default: {
              modifierStyles["--font"] = "16px sans-serif";
              break;
            }
          }
          break;
        }
        case "foregroundColor": {
          modifierStyles["--color"] = modifier.props.value;
          break;
        }
        default: {
          break;
        }
      }
    });

    switch (view.type) {
      case "Text": {
        return <p style={modifierStyles}>{view.props.value}</p>;
      }
      case "VStack": {
        return (
          <div className={styles["vstack"]} style={modifierStyles}>
            {view.props.children.map((view) => (
              <Fragment key={view.id}>{renderView(view)}</Fragment>
            ))}
          </div>
        );
      }
      default:
        return null;
    }
  }

  return (
    <div className={styles["phone"]}>
      <div className={styles["left-buttons"]} />
      <div className={styles["screen"]}>{view && renderView(view)}</div>
    </div>
  );
}
