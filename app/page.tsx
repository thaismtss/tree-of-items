"use client";
import { useCallback, useMemo, useState } from "react";
import data from "./../data.json";
import TreeContainer from "./components/app/TreeContainer";
import TreeNode from "./components/app/TreeNode";
import { DataCheckBox } from "./types";
import { getRootNode, findParent, convertToList } from "./_utils";

export default function Home() {
  const [checkedNodes, setCheckedNodes] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [indeterminateNodes, setIndeterminateNodes] = useState<{
    [key: string]: boolean;
  }>({});
  const parsedData = useMemo(() => convertToList(data), []);

  const updatedChildrens = useCallback(
    (
      node: DataCheckBox,
      checked: boolean,
      checkeds: { [key: string]: boolean },
      indeterminates: { [key: string]: boolean }
    ) => {
      if (!checked) {
        delete checkeds[node.id];
      } else {
        checkeds[node.id] = checked;
        delete indeterminates[node.id];
      }

      node.children.forEach((child) => {
        updatedChildrens(
          child,
          checkeds[node.id],
          checkeds,
          indeterminates
        );
      });
    },
    []
  );

  const updatedCheckbox = useCallback(
    (
      rootNode: DataCheckBox,
      node: DataCheckBox,
      checkeds: { [key: string]: boolean },
      indeterminates: { [key: string]: boolean }
    ) => {
      const parent = findParent(rootNode, node);

      if (node.level === 0) {
        const allChildrenChecked = node.children.every(
          (child) => checkeds[child.id]
        );
        if (allChildrenChecked) {
          updatedChildrens(node, true, checkeds, indeterminates);
        }
      }

      if (!parent) {
        return { checkeds, indeterminates };
      }

      const allChildrenChecked = parent.children.every(
        (child) => checkeds[child.id]
      );
      const someChildrenChecked = parent.children.some(
        (child) => checkeds[child.id]
      );
      const someChildrenIndeterminate = parent.children.some(
        (child) => indeterminates[child.id]
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

      return updatedCheckbox(rootNode, parent, checkeds, indeterminates);
    },
    [updatedChildrens]
  );

  const handleCheck = useCallback((item: DataCheckBox) => {
    const isChecked =
      checkedNodes[item.id] === undefined ? true : !checkedNodes[item.id];
    const checkeds = { ...checkedNodes };
    const indeterminates = { ...indeterminateNodes };
    const rootNode = getRootNode(item, parsedData);

    if (!rootNode) return;

    updatedChildrens(item, isChecked, checkeds, indeterminates);
    const { checkeds: updatedCheckeds, indeterminates: updatedIndeterminates } =
      updatedCheckbox(rootNode, item, checkeds, indeterminates);

    setCheckedNodes(updatedCheckeds);
    setIndeterminateNodes(updatedIndeterminates);
  }, [checkedNodes, indeterminateNodes, updatedChildrens, updatedCheckbox, parsedData])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl text-center font-bold relative top-4 bg-white px-4">
        Árvore de Itens
      </h1>
      <div className="flex justify-center mx-auto w-3/5 py-10 border border-gray-400 rounded-lg">
        <div className="flex flex-col gap-2 w-screen mx-4">
          <TreeContainer>
            {parsedData.map((item) => (
              <TreeNode
                key={item.id}
                item={item}
                onCheck={handleCheck}
                checkedNodes={checkedNodes}
                indeterminateNodes={indeterminateNodes}
              />
            ))}
          </TreeContainer>
        </div>
      </div>
    </div>
  );
}
