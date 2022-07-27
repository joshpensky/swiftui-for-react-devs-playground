import { PropsWithChildren } from "react";
import { CheckIcon, TriangleDownIcon } from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import { TextField } from "@src/components/TextField";
import styles from "./styles.module.scss";

export const WRITE_IN_OPTION_KEY = "__custom";

export function Root({
  children,
  id,
  option,
  setOption,
  disabled,
  writeInOptions,
}: PropsWithChildren<{
  id: string;
  option: string;
  setOption(option: string): void;
  disabled: boolean;
  writeInOptions?: {
    value: string;
    setValue(value: string): void;
  };
}>) {
  return (
    <div className={styles["selector"]}>
      <Select.Root name={id} value={option} onValueChange={setOption}>
        <Select.Trigger
          id={id}
          className={styles["select-trigger"]}
          aria-label="Text Input"
          disabled={disabled}
        >
          <Select.Value
            aria-label={
              writeInOptions && option === WRITE_IN_OPTION_KEY
                ? "Custom"
                : option
            }
          >
            {writeInOptions && option === WRITE_IN_OPTION_KEY ? (
              <pre className={styles["select-value"]}>
                &quot;
                {writeInOptions.value.replace(/(^")|("$)/g, "") || "Content"}
                &quot;
              </pre>
            ) : (
              option
            )}
          </Select.Value>
          <Select.Icon className={styles["select-icon"]}>
            <TriangleDownIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Content className={styles["select-content"]}>
          <Select.Viewport>
            {writeInOptions && <WriteInOption />}
            {children}
          </Select.Viewport>
        </Select.Content>
      </Select.Root>

      {writeInOptions && option === WRITE_IN_OPTION_KEY && (
        <div className={styles["select-input"]}>
          <pre>&quot;</pre>
          <TextField
            id={`${id}-input`}
            value={writeInOptions.value}
            disabled={disabled}
            placeholder="Content"
            onChange={writeInOptions.setValue}
          />
          <pre>&quot;</pre>
        </div>
      )}
    </div>
  );
}

export function Option({
  value,
  children,
  textValue,
}: PropsWithChildren<{
  value: string;
  textValue: string;
}>) {
  return (
    <Select.Item
      className={styles["select-content__item"]}
      key={value}
      value={value}
      textValue={textValue}
    >
      <div className={styles["select-content__item__inner"]}>
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator
          className={styles["select-content__item__indicator"]}
        >
          <CheckIcon />
        </Select.ItemIndicator>
      </div>
    </Select.Item>
  );
}

function WriteInOption() {
  return (
    <Select.Item
      className={styles["select-content__item"]}
      value={WRITE_IN_OPTION_KEY}
      textValue="Custom"
    >
      <div className={styles["select-content__item__inner"]}>
        <Select.ItemText>
          &quot;
          <span className={styles["placeholder"]}>Custom</span>
          &quot;
        </Select.ItemText>
        <Select.ItemIndicator
          className={styles["select-content__item__indicator"]}
        >
          <CheckIcon />
        </Select.ItemIndicator>
      </div>
    </Select.Item>
  );
}
