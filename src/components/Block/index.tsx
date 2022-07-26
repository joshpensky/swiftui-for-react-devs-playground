import { useContext } from "react";
import { motion } from "framer-motion";
import { FontViewModifier } from "@src/components/blocks/modifiers/FontViewModifier";
import { ForegroundColorViewModifier } from "@src/components/blocks/modifiers/ForegroundColorViewModifier";
import { ColorView } from "@src/components/blocks/views/ColorView";
import { SpacerView } from "@src/components/blocks/views/SpacerView";
import { TextView } from "@src/components/blocks/views/TextView";
import { VStackView } from "@src/components/blocks/views/VStackView";
import { ZIndexContext } from "@src/context/ZIndexContext";
import { IControl, ITemplate, IView } from "@src/models/Editor";
import styles from "./styles.module.scss";
import { IfControl } from "../blocks/controls/IfControl";
import { BackgroundViewModifier } from "../blocks/modifiers/BackgroundViewModifier";
import { CodeTemplate } from "../blocks/templates/CodeTemplate";
import { ContentTemplate } from "../blocks/templates/ContentTemplate";
import { ForEachView } from "../blocks/views/ForEachView";
import { HStackView } from "../blocks/views/HStackView";
import { ImageView } from "../blocks/views/ImageView";

export function Block({
  block,
  scope = {},
}: {
  block: ITemplate | IControl | IView;
  scope: Record<string, any>;
}) {
  let modifiers = null;
  if (block.blockType === "view" && block.modifiers.length) {
    modifiers = (
      <motion.ul className={styles["modifiers"]} /*layout="position"*/>
        {block.modifiers.map((modifier, mIndex) => {
          return (
            <motion.li
              key={modifier.id}
              className="vm-container"
              // layoutId={modifier.id}
              transition={{
                type: "spring",
                bounce: 0,
                duration: 0.25,
              }}
            >
              {(() => {
                switch (modifier.type) {
                  case "background": {
                    return (
                      <BackgroundViewModifier block={modifier} scope={scope} />
                    );
                  }
                  case "font": {
                    return <FontViewModifier block={modifier} scope={scope} />;
                  }
                  case "foregroundColor": {
                    return (
                      <ForegroundColorViewModifier
                        block={modifier}
                        scope={scope}
                      />
                    );
                  }
                  default: {
                    return null;
                  }
                }
              })()}
            </motion.li>
          );
        })}
      </motion.ul>
    );
  }

  const zIndex = useContext(ZIndexContext);

  return (
    <ZIndexContext.Provider value={zIndex + 1}>
      {(() => {
        switch (block.type) {
          // Templates
          case "code": {
            return <CodeTemplate block={block} scope={scope} />;
          }
          case "content": {
            return <ContentTemplate block={block} scope={scope} />;
          }

          // Controls
          case "if": {
            return <IfControl block={block} scope={scope} />;
          }

          // Views
          case "Color": {
            return (
              <ColorView block={block} scope={scope}>
                {modifiers}
              </ColorView>
            );
          }
          case "ForEach": {
            return (
              <ForEachView block={block} scope={scope}>
                {modifiers}
              </ForEachView>
            );
          }
          case "HStack": {
            return (
              <HStackView block={block} scope={scope}>
                {modifiers}
              </HStackView>
            );
          }
          case "Image": {
            return (
              <ImageView block={block} scope={scope}>
                {modifiers}
              </ImageView>
            );
          }
          case "Spacer": {
            return (
              <SpacerView block={block} scope={scope}>
                {modifiers}
              </SpacerView>
            );
          }
          case "Text": {
            return (
              <TextView block={block} scope={scope}>
                {modifiers}
              </TextView>
            );
          }
          case "VStack": {
            return (
              <VStackView block={block} scope={scope}>
                {modifiers}
              </VStackView>
            );
          }

          default: {
            return null;
          }
        }
      })()}
    </ZIndexContext.Provider>
  );
}
