import { CSSProperties, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { IfControl } from "@src/components/blocks/controls/IfControl";
import { BackgroundViewModifier } from "@src/components/blocks/modifiers/BackgroundViewModifier";
import { FontViewModifier } from "@src/components/blocks/modifiers/FontViewModifier";
import { ForegroundColorViewModifier } from "@src/components/blocks/modifiers/ForegroundColorViewModifier";
import { ColorView } from "@src/components/blocks/views/ColorView";
import { ForEachView } from "@src/components/blocks/views/ForEachView";
import { HStackView } from "@src/components/blocks/views/HStackView";
import { ImageView } from "@src/components/blocks/views/ImageView";
import { SpacerView } from "@src/components/blocks/views/SpacerView";
import { TextView } from "@src/components/blocks/views/TextView";
import { VStackView } from "@src/components/blocks/views/VStackView";
import { LibraryPreview } from "./LibraryPreview";
import styles from "./styles.module.scss";

export function Library() {
  const [tab, setTab] = useState("views");
  const [viewTab, setViewTab] = useState("color");
  const [viewModifierTab, setViewModifierTab] = useState("background");
  const [controlTab, setControlTab] = useState("if");

  return (
    <div className={styles["content"]}>
      <Tabs.Root value={tab} onValueChange={setTab} orientation="horizontal">
        <div className={styles["header"]}>
          <Tabs.List
            className={styles["tabs"]}
            aria-label="Block Types"
            style={
              {
                "--active-tab":
                  tab === "views" ? 0 : tab === "controls" ? 1 : 2,
              } as CSSProperties
            }
          >
            <Tabs.Trigger className={styles["tab-item"]} value="views">
              Views
            </Tabs.Trigger>
            <Tabs.Trigger className={styles["tab-item"]} value="controls">
              Controls
            </Tabs.Trigger>
            <Tabs.Trigger className={styles["tab-item"]} value="modifiers">
              Modifiers
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        <Tabs.Content value="views">
          <ul className={styles["block-list"]}>
            <li>
              <ColorView />
            </li>
            <li>
              <ForEachView />
            </li>
            <li>
              <HStackView />
            </li>
            <li>
              <ImageView />
            </li>
            <li>
              <SpacerView />
            </li>
            <li>
              <TextView />
            </li>
            <li>
              <VStackView />
            </li>
          </ul>
        </Tabs.Content>

        <Tabs.Content value="controls">
          <ul className={styles["block-list"]}>
            <li>
              <IfControl />
            </li>
          </ul>
        </Tabs.Content>

        <Tabs.Content value="modifiers">
          <ul className={styles["block-list"]}>
            <li>
              <BackgroundViewModifier />
            </li>
            <li>
              <FontViewModifier />
            </li>
            <li>
              <ForegroundColorViewModifier />
            </li>
          </ul>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
