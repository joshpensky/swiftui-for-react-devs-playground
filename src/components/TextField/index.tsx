import styles from "./styles.module.scss";

export function TextField({
  id,
  placeholder,
  value,
  disabled,
  onChange,
}: {
  id: string;
  placeholder: string;
  value: string;
  disabled?: boolean;
  onChange(value: string): void;
}) {
  return (
    <div className={styles["input"]}>
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
      />
    </div>
  );
}
