"use client";
import { DataCheckBox } from "@/app/types";
import Checkbox from "@/app/components/ui/Checkbox";
import { useEffect, useState } from "react";

interface TreeNodeProps {
  item: DataCheckBox;
  checkedNodes: { [key: string]: boolean };
  indeterminateNodes: { [key: string]: boolean };
  child?: boolean;
  onCheck: (item: DataCheckBox, checked: boolean) => void;
}

export default function TreeNode({ item, onCheck, checkedNodes, indeterminateNodes }: TreeNodeProps) {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  function handleCheck(item: DataCheckBox) {
    setIsChecked((prev) => !prev);
    onCheck(item, !isChecked);
  }
  
  return (
    <div
      key={item.id}
      style={{ marginLeft: `${item.level * 24}px` }}
      className="flex flex-col gap-1"
    >
      <Checkbox
        label={item.name}
        id={item.id}
        name={item.name}
        hoverBackground
        checked={checkedNodes[item.id] ?? false}
        indeterminate={indeterminateNodes[item.id] ?? false}
        onChange={() => handleCheck(item)}

      />
      {item.children.map((child) => (
        <TreeNode item={child} key={child.id} onCheck={onCheck} checkedNodes={checkedNodes} indeterminateNodes={indeterminateNodes} />
      ))}
    </div>
  );
}
