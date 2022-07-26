import { Fragment, PropsWithChildren } from "react";
import styles from "./styles.module.scss";

export function LibraryPreview({
  children,
  title,
  description,
  docs,
}: PropsWithChildren<{
  title: string;
  description: string;
  docs: string;
}>) {
  return (
    <Fragment>
      <header className={styles["header"]}>
        <div className={styles["header__meta"]}>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>

        <a href={docs} target="_blank" rel="noopener noreferrer">
          Docs
        </a>
      </header>
      <div className={styles["body"]}>{children}</div>
    </Fragment>
  );
}
