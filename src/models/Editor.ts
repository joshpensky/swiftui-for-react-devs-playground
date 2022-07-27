import cloneDeep from "lodash.clonedeep";
import isEqual from "lodash.isequal";

//////////////////////////////
// Base Structures
//////////////////////////////

export type Color = "red" | "green" | "blue";

export type Font = "body" | "title";

export type SystemImage = "checkmark";

//////////////////////////////
// View Modifiers
//////////////////////////////

export interface IBaseViewModifier {
  id: string;
  blockType: "modifier";
}

export interface IForegroundColorViewModifier extends IBaseViewModifier {
  type: "foregroundColor";
  args: {
    color: Color;
  };
}

export interface IFontViewModifier extends IBaseViewModifier {
  type: "font";
  args: {
    value: Font;
  };
}

export interface IBackgroundViewModifier extends IBaseViewModifier {
  type: "background";
  args: {
    content: (IControl | IView)[];
  };
}

export type IViewModifier =
  | IBackgroundViewModifier
  | IFontViewModifier
  | IForegroundColorViewModifier;

//////////////////////////////
// Views
//////////////////////////////

export interface IBaseView {
  id: string;
  blockType: "view";
  modifiers: IViewModifier[];
}

export interface IZStackView extends IBaseView {
  type: "ZStack";
  args: {
    content: (IControl | IView)[];
  };
}

export interface IVStackView extends IBaseView {
  type: "VStack";
  args: {
    content: (IControl | IView)[];
  };
}

export interface ITextView extends IBaseView {
  type: "Text";
  args: {
    value: string;
  };
}

export interface ISpacerView extends IBaseView {
  type: "Spacer";
  args: {};
}

export interface IImageView extends IBaseView {
  type: "Image";
  args: {
    systemName: SystemImage;
  };
}

export interface IHStackView extends IBaseView {
  type: "HStack";
  args: {
    content: (IControl | IView)[];
  };
}

export interface IForEachView extends IBaseView {
  type: "ForEach";
  args: {
    data: string;
    id: string;
    content: (IControl | IView)[];
  };
}

export interface IColorView extends IBaseView {
  type: "Color";
  args: {
    value: Color;
  };
}

export type IView =
  | IColorView
  | IForEachView
  | IHStackView
  | IImageView
  | ISpacerView
  | ITextView
  | IVStackView
  | IZStackView;

//////////////////////////////
// Controls
//////////////////////////////

export interface IBaseControl {
  id: string;
  blockType: "control";
}

export interface IIfControl extends IBaseControl {
  type: "if";
  args: {
    condition: string;
    content: (IControl | IView)[];
  };
}

export type IControl = IIfControl;

//////////////////////////////
// Editor Types
//////////////////////////////

export interface EditorState {
  scope: Record<string, any>;
  tree: (IControl | IView)[];
}

interface FindResponse {
  path: { type: "block" | "modifier"; index: number }[];
  item: IControl | IView | IViewModifier;
}

type IAnonymousViewModifier = Omit<IViewModifier, "id">;

type IAnonymousView = Omit<IView, "id" | "modifiers"> & {
  modifiers: IAnonymousViewModifier[];
};

type IAnonymousControl = Omit<IControl, "id">;

export class Editor {
  private _state: EditorState;

  constructor(initialState: EditorState) {
    this._state = initialState;
  }

  get state() {
    return this._state;
  }

  /**
   * Removes IDs from all blocks and modifiers in the tree to produce
   * an "anonymous" tree for equality comparison.
   */
  private get anonymousTree(): (IAnonymousControl | IAnonymousView)[] {
    const tree = cloneDeep(this._state.tree);

    let blocksToVisit: (IControl | IView | IViewModifier)[] = [...tree];
    while (blocksToVisit.length) {
      const blockOrModifier = blocksToVisit.pop();
      if (!blockOrModifier) {
        break;
      }

      // @ts-ignore
      delete blockOrModifier.id;
      if ("content" in blockOrModifier.args) {
        blocksToVisit.unshift(...blockOrModifier.args.content);
      }
      if (blockOrModifier.blockType === "view") {
        blocksToVisit.unshift(...blockOrModifier.modifiers);
      }
    }

    return tree;
  }

  /**
   * Sets the scope to the given one.
   *
   * @param scope the updated scope
   * @returns a cloned editor with the updated scope
   */
  setScope(scope: Record<string, any>): Editor {
    const state = cloneDeep(this._state);
    state.scope = scope;
    return new Editor(state);
  }

  /**
   * Inserts the given control, view, or view modifier into the specified parent.
   *
   * @param blockOrModifier the block or modifier to insert
   * @param parentId the ID of the parent, or null to insert into root tree
   * @returns a cloned editor with the given inserted block or modifier
   */
  insert(
    blockOrModifier: IControl | IView | IViewModifier,
    parentId: string | null
  ): Editor {
    const state = cloneDeep(this._state);
    const editor = new Editor(state);

    if (!parentId) {
      const parent = editor._state;
      if (blockOrModifier.blockType === "modifier") {
        throw new Error("Cannot add modifier to root state.");
      } else {
        parent.tree.push(blockOrModifier);
      }
    } else {
      const parent = editor.select(parentId);
      if (!parent) {
        throw new Error("Parent not found.");
      }

      if (blockOrModifier.blockType === "modifier") {
        let modifier = blockOrModifier;
        if (parent.item.blockType === "modifier") {
          throw new Error("Cannot add modifier to modifier.");
        } else if (parent.item.blockType === "control") {
          throw new Error("Cannot add modifier to control.");
        } else {
          parent.item.modifiers.push(modifier);
        }
      } else {
        let block = blockOrModifier;
        if (!("content" in parent.item.args)) {
          throw new Error("Invalid parent.");
        } else {
          parent.item.args.content.push(block);
        }
      }
    }

    return editor;
  }

  /**
   * Finds a control, view, or view modifier in the tree with the given ID.
   *
   * @param id the ID to search for
   * @returns the found item, or null if not found
   */
  select(id: string): FindResponse | null {
    // Performs depth-first-search to find view
    let blocksToVisit: FindResponse[] = this._state.tree.map((block, index) => {
      return { path: [{ type: "block", index }], item: block };
    });

    while (blocksToVisit.length) {
      const response = blocksToVisit.pop();
      if (!response) {
        break;
      }

      const { path, item } = response;
      if (item.id === id) {
        return { path, item };
      }

      if ("content" in item.args) {
        blocksToVisit.unshift(
          ...item.args.content.map((child, index) => {
            return {
              path: [...path, { type: "block" as const, index }],
              item: child,
            };
          })
        );
      }

      if (item.blockType === "view") {
        blocksToVisit.unshift(
          ...item.modifiers.map((modifier, modifierIndex) => {
            return {
              path: [
                ...path,
                { type: "modifier" as const, index: modifierIndex },
              ],
              item: modifier,
            };
          })
        );
      }
    }

    return null;
  }

  /**
   * Checks whether the given block or modifier type exists within the given parent.
   *
   * @param type the type of block or modifier to check for
   * @param parentId the ID of the parent to check within, or null to check from the top-level
   * @returns whether the given block or modifier is contained
   */
  contains(
    type: (IControl | IView | IViewModifier)["type"],
    parentId: string | null
  ): boolean {
    let blocksToVisit: (IControl | IView | IViewModifier)[];
    if (!parentId) {
      blocksToVisit = [...this._state.tree];
    } else {
      const response = this.select(parentId);
      if (!response) {
        throw new Error("Parent not found.");
      } else {
        blocksToVisit = [];
        if ("content" in response.item.args) {
          blocksToVisit.unshift(...response.item.args.content);
        }
        if (response.item.blockType === "view") {
          blocksToVisit.unshift(...response.item.modifiers);
        }
      }
    }

    while (blocksToVisit.length) {
      const blockOrModifier = blocksToVisit.pop();
      if (!blockOrModifier) {
        break;
      }

      if (blockOrModifier.type === type) {
        return true;
      } else if (blockOrModifier.blockType !== "modifier") {
        if ("content" in blockOrModifier.args) {
          blocksToVisit.unshift(...blockOrModifier.args.content);
        }
        if (blockOrModifier.blockType === "view") {
          blocksToVisit.unshift(...blockOrModifier.modifiers);
        }
      }
    }

    return false;
  }

  /**
   * Updates the arguments of a control, view, or view modifier in the tree.
   *
   * @param id the ID of the block or modifier to update
   * @param blockOrModifier the updated block or modifier data
   * @returns a cloned editor with the updated block or modifier
   */
  update(
    id: string,
    blockOrModifier: IControl | IView | IViewModifier
  ): Editor {
    const state = cloneDeep(this._state);
    const editor = new Editor(state);

    const response = editor.select(id);
    if (!response) {
      throw new Error("Not found.");
    }

    if (response.item.blockType !== blockOrModifier.blockType) {
      throw new Error("Block type doesn't match.");
    } else if (response.item.id !== blockOrModifier.id) {
      throw new Error("ID doesn't match.");
    }

    // Update arguments
    response.item.args = blockOrModifier.args;

    return editor;
  }

  /**
   * Moves a block or modifier with the given ID to the given parent.
   *
   * @param id the ID of the block or modifier to move
   * @param parentId the ID of the parent, or null to move top-level
   * @returns a cloned editor with the moved block or modifier
   */
  move(id: string, parentId: string | null): Editor {
    let response = this.select(id);
    if (!response) {
      throw new Error("Not found.");
    }

    let editor = this.delete(id);
    editor = editor.insert(response.item, parentId);
    return editor;
  }

  /**
   * Removes a control, view, or view modifier from the tree.
   *
   * @param id the ID of the block or modifier to remove
   * @returns a cloned editor without the given block or modifier
   */
  delete(id: string): Editor {
    const response = this.select(id);
    if (!response) {
      throw new Error("Not found.");
    }

    const state = cloneDeep(this._state);

    let currentLevel: (IControl | IView | IViewModifier)[] = state.tree;
    response.path.forEach(({ type, index }, i) => {
      const isLast = i === response.path.length - 1;
      if (isLast) {
        currentLevel.splice(index, 1);
      } else {
        const nextPath = response.path[i + 1];
        const block = currentLevel[index];

        if ("modifier" === nextPath.type) {
          if (block.blockType === "view") {
            currentLevel = block.modifiers;
          } else {
            throw new Error("Invalid path.");
          }
        } else if ("content" in block.args) {
          currentLevel = block.args.content;
        } else {
          throw new Error("Invalid path.");
        }
      }
    });

    return new Editor(state);
  }

  /**
   * Checks exact structure equality between two editor trees.
   *
   * @param editor the other editor to compare
   * @returns whether the editors' tree structures match
   */
  equals(editor: Editor) {
    return isEqual(this.anonymousTree, editor.anonymousTree);
  }
}
