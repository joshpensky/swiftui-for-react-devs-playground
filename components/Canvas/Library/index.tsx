import {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { ForegroundColorViewModifier } from "../../ForegroundColorViewModifier";
import { TextView } from "../../TextView";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import styles from "./styles.module.scss";
import { FontViewModifier } from "../../FontViewModifier";

export function Library({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) {
  const dragHandleRef = useRef(null);
  const controls = useDragControls();
  const [tab, setTab] = useState("views");
  const [viewTab, setViewTab] = useState("text");
  const [viewModifierTab, setViewModifierTab] = useState("font");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <Dialog.Trigger asChild>
        <button className={styles["modal-trigger"]} aria-label="Open library">
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
                  <Tabs.List
                    className={styles["tabs"]}
                    aria-label="Block Types"
                    style={
                      {
                        "--active-tab": tab === "views" ? 0 : 1,
                      } as CSSProperties
                    }
                  >
                    <Tabs.Trigger className={styles["tab-item"]} value="views">
                      Views
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      className={styles["tab-item"]}
                      value="view-modifiers"
                    >
                      View Modifiers
                    </Tabs.Trigger>
                  </Tabs.List>

                  <Tabs.Content value="views">
                    <Tabs.Root
                      className={styles["tab-view"]}
                      value={viewTab}
                      onValueChange={setViewTab}
                      orientation="vertical"
                    >
                      <Tabs.List className={styles["block-list"]}>
                        <Tabs.Trigger value="text">Text</Tabs.Trigger>
                      </Tabs.List>

                      <div className={styles["block-preview"]}>
                        <Tabs.Content value="text">
                          <header className={styles["block-preview__header"]}>
                            <h3>Text</h3>
                            <p>Display text content.</p>
                          </header>
                          <div className={styles["block-preview__body"]}>
                            <TextView
                              preview
                              value=""
                              onDrag={() => onOpenChange(false)}
                            />
                          </div>
                        </Tabs.Content>
                      </div>
                    </Tabs.Root>
                  </Tabs.Content>

                  <Tabs.Content value="view-modifiers">
                    <Tabs.Root
                      className={styles["tab-view"]}
                      value={viewModifierTab}
                      onValueChange={setViewModifierTab}
                      orientation="vertical"
                    >
                      <Tabs.List className={styles["block-list"]}>
                        <Tabs.Trigger value="font">Font</Tabs.Trigger>
                        <Tabs.Trigger value="foregroundColor">
                          Foreground Color
                        </Tabs.Trigger>
                      </Tabs.List>

                      <div className={styles["block-preview"]}>
                        <Tabs.Content value="font">
                          <header className={styles["block-preview__header"]}>
                            <h3>Font</h3>
                            <p>Set the default font for text in this view.</p>
                          </header>
                          <div className={styles["block-preview__body"]}>
                            <FontViewModifier
                              preview
                              value="body"
                              onDrag={() => onOpenChange(false)}
                            />
                          </div>
                        </Tabs.Content>
                        <Tabs.Content value="foregroundColor">
                          <header className={styles["block-preview__header"]}>
                            <h3>Foreground Color</h3>
                            <p>Set the color of foreground elements.</p>
                          </header>
                          <div className={styles["block-preview__body"]}>
                            <ForegroundColorViewModifier
                              preview
                              value="red"
                              onDrag={() => onOpenChange(false)}
                            />
                          </div>
                        </Tabs.Content>
                      </div>
                    </Tabs.Root>
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
