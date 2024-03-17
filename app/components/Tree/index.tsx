import { DataCheckBox } from "@/app/types";
import TreeNode from "../TreeNode";
import { findParent, getRootNode } from "@/utils";
import { use, useCallback, useEffect, useState } from "react";
import Checkbox from "../ui/Checkbox";

export interface TreeProps {
  data: DataCheckBox[];
  showControl?: boolean;
}

export default function Tree({ data, showControl }: TreeProps) {
  const [selectAll, setSelectAll] = useState(false);
  const [checkedNodes, setCheckedNodes] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [indeterminateNodes, setIndeterminateNodes] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    selectAllNodes();
  }, [selectAll]);

const selectAllNodes = useCallback(() => {
  const updatedNodes = (items: DataCheckBox[]) => {
    let selections = {} as  {[key: string]: boolean};
    items.forEach((item) => {
      selections[item.id] = selectAll;
      if (item.children) {
        const childSelections = updatedNodes(item.children);
        selections = { ...selections, ...childSelections };
      }
    });
    return selections;
  };

  const selections = updatedNodes(data);
  setCheckedNodes((prev) => {
    return { ...prev, ...selections };
  });
}, [data, selectAll]);


  const updatedChildrens = useCallback(
    (
      node: DataCheckBox,
      checked: boolean,
      checkeds: { [key: string]: boolean },
      indeterminates: { [key: string]: boolean }
    ) => {
      let newCheckeds = { ...checkeds };
      let newIndeterminates = { ...indeterminates };

      if (!checked) {
        delete newCheckeds[node.id];
      } else {
        newCheckeds[node.id] = checked;
        delete newIndeterminates[node.id];
      }

      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          const {
            newCheckeds: updatedCheckeds,
            newIndeterminates: updatedIndeterminates,
          } = updatedChildrens(child, checked, newCheckeds, newIndeterminates);
          newCheckeds = { ...updatedCheckeds };
          newIndeterminates = {
            ...updatedIndeterminates,
          };
        });
      }
      return { newCheckeds, newIndeterminates };
    },
    []
  );

  const updatedParents = useCallback(
    (
      rootNode: DataCheckBox,
      node: DataCheckBox,
      checkeds: { [key: string]: boolean },
      indeterminates: { [key: string]: boolean }
    ) => {
      let newCheckeds = { ...checkeds };
      let newIndeterminates = { ...indeterminates };
      const parent = findParent(rootNode, node);

      if (!parent) {
        return { newCheckeds, newIndeterminates };
      }

      const allChildrenChecked = parent.children.every(
        (child) => newCheckeds[child.id]
      );
      const someChildrenChecked = parent.children.some(
        (child) => newCheckeds[child.id]
      );
      const someChildrenIndeterminate = parent.children.some(
        (child) => newIndeterminates[child.id]
      );
      if (allChildrenChecked) {
        delete indeterminates[parent.id];
        checkeds[parent.id] = true;
      } else {
        delete checkeds[parent.id];
      }

      if (
        (someChildrenChecked && !allChildrenChecked) ||
        someChildrenIndeterminate
      ) {
        indeterminates[parent.id] = true;
      } else {
        delete indeterminates[parent.id];
      }

      return updatedParents(rootNode, parent, checkeds, indeterminates);
    },
    []
  );

  const handleCheck = useCallback(
    (item: DataCheckBox) => {
      const isChecked =
        checkedNodes[item.id] === undefined ? true : !checkedNodes[item.id];
      let checkeds = { ...checkedNodes };
      let indeterminates = { ...indeterminateNodes };
      const rootNode = getRootNode(item, data);

      if (!rootNode) return;

      const {
        newCheckeds: newCheckedsChildrens,
        newIndeterminates: newIndeterminatesChildrens,
      } = updatedChildrens(item, isChecked, checkeds, indeterminates);

      const {
        newCheckeds: newCheckedsParents,
        newIndeterminates: newIndeterminatesParents,
      } = updatedParents(
        rootNode,
        item,
        newCheckedsChildrens,
        newIndeterminatesChildrens
      );

      checkeds = { ...newCheckedsChildrens, ...newCheckedsParents };
      indeterminates = {
        ...newIndeterminatesChildrens,
        ...newIndeterminatesParents,
      };

      setCheckedNodes(checkeds);
      setIndeterminateNodes(indeterminates);
    },
    [checkedNodes, indeterminateNodes, updatedChildrens, updatedParents, data]
  );


  return (
    <div className="flex flex-col gap-1">
      {showControl && (
        <div className="flex bg-gray-200 p-4 mb-4 rounded-md">
          <div className="ml-3">
            <Checkbox
              id="selectAll"
              label="Selecionar Todos"
              checked={selectAll}
              onChecked={setSelectAll}
            />
          </div>
        </div>
      )}
      {data.map((item) => (
        <TreeNode
          key={item.id}
          item={item}
          onCheck={handleCheck}
          checkedNodes={checkedNodes}
          indeterminateNodes={indeterminateNodes}
        />
      ))}
    </div>
  );
}
