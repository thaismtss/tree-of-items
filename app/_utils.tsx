import { Data, DataCheckBox } from "./types";

export function convertToList(data: Data): DataCheckBox[] {
    const dataToArr = Object.values(data);
    return dataToArr.map((item) => {
      return {
        id: item.id,
        name: item.name,
        level: item.level,
        children: convertToList(item.children),
      };
    });
  }

export function findParent(
    parent: DataCheckBox,
    node: DataCheckBox
  ): DataCheckBox | null {
    if (parent.children.includes(node)) {
      return parent;
    } else {
      for (const child of parent.children) {
        const foundParent = findParent(child, node);
        if (foundParent) {
          return foundParent;
        }
      }
      return null;
    }
  }

  export function getRootNode(
    node: DataCheckBox,
    data: DataCheckBox[]
  ): DataCheckBox | undefined {
    if (node.level === 0) {
      return node;
    }

    for (const item of data) {
      const parent = findParent(item, node);
      if (parent) {
        return getRootNode(parent, data);
      }
    }
  }
