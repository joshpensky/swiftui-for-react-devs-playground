import { createContext, Dispatch, SetStateAction } from "react";
import { Editor } from "../models/NewEditor";

export const EditorContext = createContext<
  [Editor, Dispatch<SetStateAction<Editor>>]
>([new Editor({ scope: {}, tree: [] }), () => {}]);
