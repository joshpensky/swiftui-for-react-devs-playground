import { useContext } from "react";
import { motion } from "framer-motion";
import { FontViewModifier } from "@src/components/blocks/modifiers/FontViewModifier";
import { ForegroundColorViewModifier } from "@src/components/blocks/modifiers/ForegroundColorViewModifier";
import { ColorView } from "@src/components/blocks/views/ColorView";
import { SpacerView } from "@src/components/blocks/views/SpacerView";
import { TextView } from "@src/components/blocks/views/TextView";
import { VStackView } from "@src/components/blocks/views/VStackView";
import { ZIndexContext } from "@src/context/ZIndexContext";
import { IControl, IView } from "@src/models/Editor";
import styles from "./styles.module.scss";
import { ForEachView } from "../blocks/views/ForEachView";

export function Block({
  block,
  scope = {},
}: {
  block: IControl | IView;
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
