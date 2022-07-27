import cx from "classnames";
import styles from "./styles.module.scss";

export function TextField({
  className,
  id,
  placeholder,
  value,
  disabled,
  onChange,
}: {
  className?: string;
  id: string;
  placeholder: string;
  value: string;
  disabled?: boolean;
  onChange(value: string): void;
}) {
  return (
    <div className={cx(styles["input"], className)}>
      <pre aria-hidden="true">{value || placeholder}</pre>
      <input
        id={id}
        name={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(evt) => {
          onChange(evt.target.value);
        }}
        disabled={disabled}
        onMouseDown={(evt) => {
          // Prevent drag from being initiated on input selection
          // https://github.com/react-dnd/react-dnd/blob/8dc48121f842255e8cac229344fa170d3730b839/packages/backend-touch/src/TouchBackendImpl.ts#L30
          evt.stopPropagation();
        }}
      />
    </div>
  );
}
