import { PropsWithChildren } from "react";
import styles from "./styles.module.scss";

export function Hint({ children }: PropsWithChildren) {
  return (
    <p className={styles["hint"]}>
      <strong>Hint:</strong> {children}
    </p>
  );
}
