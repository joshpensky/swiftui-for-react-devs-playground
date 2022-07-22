import { SetStateAction, createContext, useState, Dispatch } from "react";
import cloneDeep from "lodash.clonedeep";
import { IView, IViewModifier } from "../types";
import isEqual from "lodash.isequal";

export type BlockType = "view" | "view-modifier";

interface FindResponse<T> {
  viewPath: number[];
  item: T;
}

type IAnonymousViewModifier = Omit<IViewModifier, "id">;
type IAnonymousView = Omit<IView, "id" | "modifiers"> & {
  modifiers: IAnonymousViewModifier[];
};

export class Editor {
  private _views: IView[];

  constructor(initialViews: IView[] = []) {
    this._views = initialViews;
  }

  get views(): IView[] {
    return this._views;
  }

  get anonymousViews(): IAnonymousView[] {
    const views = cloneDeep(this._views);

    let viewsToVisit: IView[] = [...views];
    while (viewsToVisit.length) {
      const view = viewsToVisit.pop();
      if (!view) {
        break;
      }

      // @ts-ignore
      delete view.id;
      view.modifiers = view.modifiers.map((modifier) => {
        // @ts-ignore
        delete modifier.id;
        return modifier;
      });

      if (view.type === "VStack") {
        viewsToVisit.unshift(...view.props.children);
      }
    }

    return views;
  }

  /**
   * Inserts the given view into the specified parent.
   *
   * @param view the view to insert
   * @param parentId the ID of the parent, or null to insert top-level
   * @returns a cloned editor with the given view
   */
  insertView(view: IView, parentId: string | null): Editor {
    const views = cloneDeep(this._views);

    if (!parentId) {
      views.push(view);
    } else {
      const response = this.findView(parentId);
      if (!response) {
        throw new Error("Parent not found.");
      }

      let currentLevel = views;
      response.viewPath.forEach((index, i) => {
        let currentView = currentLevel[index];
        if (i === response.viewPath.length - 1) {
          if (currentView.type === "VStack") {
            currentView.props.children.push(view);
          } else {
            throw new Error("Can't insert into parent.");
          }
        } else {
          if (currentView.type === "VStack") {
            currentLevel = currentView.props.children;
          } else {
            throw new Error("Invalid path.");
          }
        }
      });
    }

    return new Editor(views);
  }

  /**
   * Inserts the given view modifier onto the specified parent.
   *
   * @param modifier the view modifier to insert
   * @param parentId the ID of the parent
   * @returns a cloned editor with the given view modifier
   */
  insertModifier(modifier: IViewModifier, parentId: string): Editor {
    const views = cloneDeep(this._views);

    const response = this.findView(parentId);
    if (!response) {
      throw new Error("Parent not found.");
    }

    let currentLevel = views;
    response.viewPath.forEach((index, i) => {
      let currentView = currentLevel[index];
      if (i === response.viewPath.length - 1) {
        currentView.modifiers.push(modifier);
      } else {
        if (currentView.type === "VStack") {
          currentLevel = currentView.props.children;
        } else {
          throw new Error("Invalid path.");
        }
      }
    });

    return new Editor(views);
  }

  /**
   * Finds a view in the tree with the given ID.
   *
   * @param id the ID to search for
   * @returns the found view, or null if not found
   */
  findView(id: string): FindResponse<IView> | null {
    // Performs depth-first-search to find view
    let viewsToVisit: FindResponse<IView>[] = this._views.map((view, index) => {
      return { viewPath: [index], item: view };
    });

    while (viewsToVisit.length) {
      const response = viewsToVisit.pop();
      if (!response) {
        break;
      }

      const { viewPath, item } = response;
      if (item.id === id) {
        return { viewPath, item };
      } else if (item.type === "VStack") {
        viewsToVisit.unshift(
          ...item.props.children.map((child, index) => {
            return { viewPath: [...viewPath, index], item: child };
          })
        );
      }
    }

    return null;
  }

  /**
   * Finds a modifier in the tree with the given ID.
   *
   * @param id the ID to search for
   * @returns the found modifier, or null if not found
   */
  findModifier(id: string): FindResponse<IViewModifier> | null {
    // Performs depth-first-search to find view modifier
    let viewsToVisit: FindResponse<IView>[] = this._views.map((view, index) => {
      return { viewPath: [index], item: view };
    });

    while (viewsToVisit.length) {
      const response = viewsToVisit.pop();
      if (!response) {
        break;
      }

      const { viewPath, item } = response;
      let match = item.modifiers.find((modifier) => modifier.id === id);
      if (match) {
        return { viewPath, item: match };
      } else if (item.type === "VStack") {
        viewsToVisit.unshift(
          ...item.props.children.map((child, index) => {
            return { viewPath: [...viewPath, index], item: child };
          })
        );
      }
    }

    return null;
  }

  /**
   * Updates a view in the tree. Does not update modifiers.
   *
   * @param id the ID of the view to update
   * @param view the new view data
   * @returns a cloned editor with the new view
   */
  updateView(id: string, view: IView): Editor {
    const response = this.findView(id);
    if (!response) {
      throw new Error("View not found.");
    }

    const views = cloneDeep(this._views);

    let currentLevel = views;
    response.viewPath.forEach((index, i) => {
      let currentView = currentLevel[index];
      if (i === response.viewPath.length - 1) {
        currentLevel[index] = {
          ...view,
          modifiers: currentView.modifiers, // Don't update the modifiers!
        };
      } else {
        if (currentView.type === "VStack") {
          currentLevel = currentView.props.children;
        } else {
          throw new Error("Invalid path.");
        }
      }
    });

    return new Editor(views);
  }

  /**
   * Updates a view modifier in the tree.
   *
   * @param id the ID of the view modifier to update
   * @param modifier the new view modifier data
   * @returns a cloned editor with the new view modifier
   */
  updateModifier(id: string, modifier: IViewModifier): Editor {
    const response = this.findModifier(id);
    if (!response) {
      throw new Error("View not found.");
    }

    const views = cloneDeep(this._views);

    let currentLevel = views;
    response.viewPath.forEach((index, i) => {
      let currentView = currentLevel[index];
      if (i === response.viewPath.length - 1) {
        currentView.modifiers = currentView.modifiers.map((currentModifier) => {
          if (currentModifier.id === id) {
            return modifier;
          } else {
            return currentModifier;
          }
        });
      } else {
        if (currentView.type === "VStack") {
          currentLevel = currentView.props.children;
        } else {
          throw new Error("Invalid path.");
        }
      }
    });

    return new Editor(views);
  }

  /**
   * Removes a view from the tree.
   *
   * @param id the ID of the view to remove
   * @returns a cloned editor without the given view
   */
  removeView(id: string): Editor {
    const response = this.findView(id);
    if (!response) {
      throw new Error("View not found.");
    }

    const views = cloneDeep(this._views);

    let currentLevel = views;
    response.viewPath.forEach((index, i) => {
      if (i === response.viewPath.length - 1) {
        currentLevel.splice(index, 1);
      } else {
        let view = currentLevel[index];
        if (view.type === "VStack") {
          currentLevel = view.props.children;
        } else {
          throw new Error("Invalid path.");
        }
      }
    });

    return new Editor(views);
  }

  /**
   * Removes a modifier from the tree.
   *
   * @param id the ID of the modifier to remove
   * @returns a cloned editor without the given modifier
   */
  removeModifier(id: string): Editor {
    const response = this.findModifier(id);
    if (!response) {
      throw new Error("View not found.");
    }

    const views = cloneDeep(this._views);

    let currentLevel = views;
    response.viewPath.forEach((index, i) => {
      let view = currentLevel[index];
      if (i === response.viewPath.length - 1) {
        let modifierIndex = view.modifiers.findIndex(
          (modifier) => modifier.id === id
        );
        view.modifiers.splice(modifierIndex, 1);
      } else {
        if (view.type === "VStack") {
          currentLevel = view.props.children;
        } else {
          throw new Error("Invalid path.");
        }
      }
    });

    return new Editor(views);
  }

  /**
   * Checks exact structure equality between two editors.
   *
   * @param editor the other editor to compare
   * @returns whether the editors' structures matches
   */
  equals(editor: Editor): boolean {
    return isEqual(this.anonymousViews, editor.anonymousViews);
  }
}

export const EditorContext = createContext<
  [Editor, Dispatch<SetStateAction<Editor>>]
>([new Editor(), () => {}]);
