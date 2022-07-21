import { IView } from "../../pages";
import styles from "./styles.module.scss";

export function Preview({ view }: { view?: IView }) {
  return (
    <div className={styles["phone"]}>
      <div className={styles["left-buttons"]} />
      <div className={styles["screen"]}>
        {view &&
          (() => {
            const styles: Record<string, any> = {};
            [...view.modifiers].reverse().forEach((modifier) => {
              switch (modifier.type) {
                case "font": {
                  switch (modifier.props.value) {
                    case "title": {
                      styles["--font"] = "32px sans-serif";
                      break;
                    }
                    default: {
                      styles["--font"] = "16px sans-serif";
                      break;
                    }
                  }
                  break;
                }
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
