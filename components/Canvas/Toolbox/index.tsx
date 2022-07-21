import { Dispatch, SetStateAction, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
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
  const dragHandleRef = useRef(null);
  const controls = useDragControls();
  const [tab, setTab] = useState("views");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <Dialog.Trigger asChild>
        <button className={styles["modal-trigger"]} aria-label="Add block">
          +
        </button>
      </Dialog.Trigger>

      {open && <div className={styles["modal-overlay"]} />}
      <AnimatePresence>
        {open && (
          <Dialog.Content
            asChild
            forceMount
            onOpenAutoFocus={(evt) => evt.preventDefault()}
          >
            <motion.div
              key="toolbox"
              className={styles["modal"]}
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              drag="y"
              dragListener={false}
              dragControls={controls}
              dragConstraints={{ top: 0 }}
              dragElastic={{ top: 0, bottom: 0.2 }}
              onDragEnd={(evt, info) => {
                if (info.offset.y > 1) {
                  onOpenChange(false);
                }
              }}
            >
              <motion.div
                className={styles["handle"]}
                ref={dragHandleRef}
                dragListener
                onPointerDown={(evt) => controls.start(evt)}
              />
              <div className={styles["toolbox"]}>
                <Tabs.Root
                  value={tab}
                  onValueChange={setTab}
                  orientation="horizontal"
                >
                  <Tabs.List aria-label="Block Types">
                    <Tabs.Trigger value="views">Views</Tabs.Trigger>
                    <Tabs.Trigger value="view-modifiers">
                      View Modifiers
                    </Tabs.Trigger>
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
            </motion.div>
          </Dialog.Content>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
