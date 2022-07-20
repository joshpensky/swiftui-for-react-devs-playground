import { CSSProperties } from "react";
import { ViewModel } from "../../pages";
import styles from "./styles.module.scss";

export function Preview({ view }: { view?: ViewModel }) {
  return (
    <div className={styles["phone"]}>
      <div className={styles["left-buttons"]} />
      <div className={styles["screen"]}>
        {view &&
          (() => {
            const styles: Record<string, any> = {};
            [...view.modifiers].reverse().forEach((modifier) => {
              switch (modifier.type) {
                case "foregroundColor": {
                  styles["--color"] = modifier.props.value;
                  break;
                }
                default: {
                  break;
                }
              }
            });

            switch (view.type) {
              case "Text": {
                return <p style={styles}>{view.props.value}</p>;
              }
              default:
                return null;
            }
          })()}
      </div>
    </div>
  );
}
