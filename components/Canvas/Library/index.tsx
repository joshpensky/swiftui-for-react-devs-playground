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
import { VStackView } from "../../VStackView";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import styles from "./styles.module.scss";
import { FontViewModifier } from "../../FontViewModifier";
import { LibraryPreview } from "./LibraryPreview";

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
              <Dialog.Title className="sr-only">Library</Dialog.Title>

              <motion.div
                className={styles["handle"]}
                ref={dragHandleRef}
                dragListener
                onPointerDown={(evt) => controls.start(evt)}
              />

              <div className={styles["content"]}>
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
                        <Tabs.Trigger value="vstack">
                          Vertical Stack
                        </Tabs.Trigger>
                      </Tabs.List>

                      <div className={styles["block-preview"]}>
                        <Tabs.Content value="text">
                          <LibraryPreview
                            title="Text"
                            description="Display text content."
                            docs="https://developer.apple.com/documentation/swiftui/text"
                          >
                            <TextView
                              preview
                              value=""
                              onDrag={() => onOpenChange(false)}
                            />
                          </LibraryPreview>
                        </Tabs.Content>

                        <Tabs.Content value="vstack">
                          <LibraryPreview
                            title="Vertical Stack"
                            description="Align views vertically."
                            docs="https://developer.apple.com/documentation/swiftui/vstack"
                          >
                            <VStackView
                              preview
                              content={[]}
                              onDrag={() => onOpenChange(false)}
                            />
                          </LibraryPreview>
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
                          <LibraryPreview
                            title="Font"
                            description="Set the default font for text in this view."
                            docs="https://developer.apple.com/documentation/swiftui/view/font(_:)"
                          >
                            <FontViewModifier
                              preview
                              value="body"
                              onDrag={() => onOpenChange(false)}
                            />
                          </LibraryPreview>
                        </Tabs.Content>

                        <Tabs.Content value="foregroundColor">
                          <LibraryPreview
                            title="Foreground Color"
                            description="Set the color of foreground elements."
                            docs="https://developer.apple.com/documentation/SwiftUI/View/foregroundColor(_:)"
                          >
                            <ForegroundColorViewModifier
                              preview
                              value="red"
                              onDrag={() => onOpenChange(false)}
                            />
                          </LibraryPreview>
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
