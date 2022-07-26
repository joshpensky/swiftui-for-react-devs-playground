import { useContext } from "react";
import { IControl, IView } from "@src/models/Editor";
import { TextView } from "@src/components/blocks/views/TextView";
import { VStackView } from "@src/components/blocks/views/VStackView";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";
import { FontViewModifier } from "@src/components/blocks/modifiers/FontViewModifier";
import { ForegroundColorViewModifier } from "@src/components/blocks/modifiers/ForegroundColorViewModifier";
import { ColorView } from "@src/components/blocks/views/ColorView";
import { SpacerView } from "@src/components/blocks/views/SpacerView";
import { ZIndexContext } from "@src/context/ZIndexContext";

export function Block({ block }: { block: IControl | IView }) {
  let modifiers = null;
  if (block.blockType === "view" && block.modifiers.length) {
    modifiers = (
      <motion.ul className={styles["modifiers"]} layout="position">
        {block.modifiers.map((modifier, mIndex) => {
          return (
            <motion.li
              key={modifier.id}
              className="vm-container"
              layoutId={modifier.id}
              transition={{
                type: "spring",
                bounce: 0,
                duration: 0.25,
              }}
            >
              {(() => {
                switch (modifier.type) {
                  case "font": {
                    return <FontViewModifier block={modifier} />;
                  }
                  case "foregroundColor": {
                    return <ForegroundColorViewModifier block={modifier} />;
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
            return <ColorView block={block}>{modifiers}</ColorView>;
          }
          case "Spacer": {
            return <SpacerView block={block}>{modifiers}</SpacerView>;
          }
          case "Text": {
            return <TextView block={block}>{modifiers}</TextView>;
          }
          case "VStack": {
            return <VStackView block={block}>{modifiers}</VStackView>;
          }
          default: {
            return null;
          }
        }
      })()}
    </ZIndexContext.Provider>
  );
}
