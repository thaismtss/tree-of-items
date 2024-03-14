"use client";
import { useState } from "react";
import data from "./../data.json";
import TreeContainer from "./components/app/TreeContainer";
import TreeNode from "./components/app/TreeNode";
import { DataCheckBox } from "./types";

interface Data {
  [key: string]: {
    id: string;
    name: string;
    level: number;
    children: Data;
  };
}

function parsedData(data: Data): DataCheckBox[] {
  const dataToArr = Object.values(data);
  return dataToArr.map((item) => {
    return {
      id: item.id,
      name: item.name,
      level: item.level,
      children: parsedData(item.children),
      checked: false,
    };
  });
}

export default function Home() {
  const [checkedNodes, setCheckedNodes] = useState<{ [key: string]: boolean }>(
    {}
  );
  const newData = parsedData(data);

  function handleCheck(item: DataCheckBox, checked: boolean) {
    const setChildren = (node: DataCheckBox) => {
      let updatedSelection = { ...checkedNodes };
      updatedSelection[node.id] = checked;

      if (node.children.length) {
        node.children.forEach((child) => {
          updatedSelection = {
            ...updatedSelection,
            ...setChildren(child),
          };
        });
      }
      return updatedSelection;

    };

    const currentNode = newData.find((child) => child.id === item.id);
    if (!currentNode) {
      return;
    }

    const newCheckedNodes = setChildren(currentNode);
    setCheckedNodes(newCheckedNodes);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl text-center font-bold relative top-4 bg-white px-4">
        Árvore de Itens
      </h1>
      <div className="flex justify-center mx-auto w-3/5 py-10 border border-gray-400 rounded-lg">
        <div className="flex flex-col gap-2 w-screen mx-4">
          <TreeContainer>
            {newData.map((item) => (
              <TreeNode
                key={item.id}
                item={item}
                onCheck={handleCheck}
                checkedNodes={checkedNodes}
              />
            ))}
          </TreeContainer>
        </div>
      </div>
    </div>
  );
}
