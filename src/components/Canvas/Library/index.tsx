import {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useRef,
  useState,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { PlusIcon } from "@radix-ui/react-icons";
import * as Tabs from "@radix-ui/react-tabs";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { FontViewModifier } from "@src/components/blocks/modifiers/FontViewModifier";
import { ForegroundColorViewModifier } from "@src/components/blocks/modifiers/ForegroundColorViewModifier";
import { ColorView } from "@src/components/blocks/views/ColorView";
import { ForEachView } from "@src/components/blocks/views/ForEachView";
import { SpacerView } from "@src/components/blocks/views/SpacerView";
import { TextView } from "@src/components/blocks/views/TextView";
import { VStackView } from "@src/components/blocks/views/VStackView";
import { LibraryPreview } from "./LibraryPreview";
import styles from "./styles.module.scss";

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
  const [viewTab, setViewTab] = useState("color");
  const [viewModifierTab, setViewModifierTab] = useState("font");
  const [controlTab, setControlTab] = useState("if");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <Dialog.Trigger asChild>
        <button className={styles["modal-trigger"]} aria-label="Open library">
          <PlusIcon />
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
                        "--active-tab":
                          tab === "views" ? 0 : tab === "modifiers" ? 1 : 2,
                      } as CSSProperties
                    }
                  >
                    <Tabs.Trigger className={styles["tab-item"]} value="views">
                      Views
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      className={styles["tab-item"]}
                      value="modifiers"
                    >
                      View Modifiers
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      className={styles["tab-item"]}
                      value="controls"
                    >
                      Controls
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
                        <Tabs.Trigger value="color">Color</Tabs.Trigger>
                        <Tabs.Trigger value="foreach">For Each</Tabs.Trigger>
                        <Tabs.Trigger value="spacer">Spacer</Tabs.Trigger>
                        <Tabs.Trigger value="text">Text</Tabs.Trigger>
                        <Tabs.Trigger value="vstack">
                          Vertical Stack
                        </Tabs.Trigger>
                      </Tabs.List>

                      <div className={styles["block-preview"]}>
                        <Tabs.Content value="color">
                          <LibraryPreview
                            title="Color"
                            description="A representation of a color that adapts to a given context."
                            docs="https://developer.apple.com/documentation/swiftui/color"
                          >
                            <ColorView onDrag={() => onOpenChange(false)} />
                          </LibraryPreview>
                        </Tabs.Content>

                        <Tabs.Content value="foreach">
                          <LibraryPreview
                            title="For Each"
                            description="A structure that computes views on demand from an underlying collection of identified data."
                            docs="https://developer.apple.com/documentation/swiftui/foreach"
                          >
                            <ForEachView onDrag={() => onOpenChange(false)} />
                          </LibraryPreview>
                        </Tabs.Content>

                        <Tabs.Content value="spacer">
                          <LibraryPreview
                            title="Spacer"
                            description="A flexible space that expands along the major axis of its containing stack layout, or on both axes if not contained in a stack."
                            docs="https://developer.apple.com/documentation/swiftui/spacer"
                          >
                            <SpacerView onDrag={() => onOpenChange(false)} />
                          </LibraryPreview>
                        </Tabs.Content>

                        <Tabs.Content value="text">
                          <LibraryPreview
                            title="Text"
                            description="A view that displays one or more lines of read-only text."
                            docs="https://developer.apple.com/documentation/swiftui/text"
                          >
                            <TextView onDrag={() => onOpenChange(false)} />
                          </LibraryPreview>
                        </Tabs.Content>

                        <Tabs.Content value="vstack">
                          <LibraryPreview
                            title="Vertical Stack"
                            description="A view that arranges its children in a vertical line."
                            docs="https://developer.apple.com/documentation/swiftui/vstack"
                          >
                            <VStackView onDrag={() => onOpenChange(false)} />
                          </LibraryPreview>
                        </Tabs.Content>
                      </div>
                    </Tabs.Root>
                  </Tabs.Content>

                  <Tabs.Content value="modifiers">
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
                              onDrag={() => onOpenChange(false)}
                            />
                          </LibraryPreview>
                        </Tabs.Content>
                      </div>
                    </Tabs.Root>
                  </Tabs.Content>

                  <Tabs.Content value="controls">
                    <Tabs.Root
                      className={styles["tab-view"]}
                      value={controlTab}
                      onValueChange={setControlTab}
                      orientation="vertical"
                    >
                      <Tabs.List className={styles["block-list"]}>
                        <Tabs.Trigger value="if">If Statement</Tabs.Trigger>
                      </Tabs.List>

                      <div className={styles["block-preview"]} />
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
