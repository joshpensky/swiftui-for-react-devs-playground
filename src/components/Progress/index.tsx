import { CheckIcon } from "@radix-ui/react-icons";
import cx from "classnames";
import styles from "./styles.module.scss";

export function Progress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div
      className={styles["wrapper"]}
      aria-label={`Question ${current} of ${total}`}
    >
      {Array(total)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className={cx(
              styles["item"],
              index < current - 1 && styles["completed"],
              index === current - 1 && styles["current"]
            )}
          >
            {index < current - 1 && <CheckIcon />}
          </div>
        ))}
    </div>
  );
}
