import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { ForegroundColorViewModifier } from "../../ForegroundColorViewModifier";
import { TextView } from "../../TextView";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import styles from "./styles.module.scss";

export function Toolbox({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) {
  const [tab, setTab] = useState("views");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button className={styles["modal-trigger"]} aria-label="Add block">
          +
        </button>
      </Dialog.Trigger>

      <Dialog.Overlay className={styles["modal-overlay"]} />
      <Dialog.Content className={styles["modal"]}>
        <div className={styles["toolbox"]}>
          <Tabs.Root
            value={tab}
            onValueChange={setTab}
            orientation="horizontal"
          >
            <Tabs.List aria-label="Block Types">
              <Tabs.Trigger value="views">Views</Tabs.Trigger>
              <Tabs.Trigger value="view-modifiers">View Modifiers</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="views">
              <ul>
                <li>
                  <TextView
                    preview
                    value=""
                    onDrag={() => onOpenChange(false)}
                  />
                  <p>
                    <strong>Text</strong>
                  </p>
                  <p>Display text content.</p>
                </li>
              </ul>
            </Tabs.Content>
            <Tabs.Content value="view-modifiers">
              <ul>
                <li>
                  <ForegroundColorViewModifier
                    preview
                    value="red"
                    onDrag={() => onOpenChange(false)}
                  />
                  <p>
                    <strong>Foreground Color</strong>
                  </p>
                  <p>Set the color of foreground elements.</p>
                </li>
              </ul>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
