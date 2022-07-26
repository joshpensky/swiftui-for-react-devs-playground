import { createContext, Dispatch, SetStateAction } from "react";
import { Editor } from "@src/models/Editor";

export const EditorContext = createContext<
  [Editor, Dispatch<SetStateAction<Editor>>]
>([new Editor({ scope: {}, tree: [] }), () => {}]);
