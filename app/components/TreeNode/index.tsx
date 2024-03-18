"use client";
import { DataCheckBox } from "@/app/types";
import Checkbox from "@/app/components/ui/Checkbox";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface TreeNodeProps {
  item: DataCheckBox;
  checkedNodes: { [key: string]: boolean };
  indeterminateNodes: { [key: string]: boolean };
  child?: boolean;
  onCheck: (item: DataCheckBox, checked: boolean) => void;
}

export default function TreeNode({
  item,
  onCheck,
  checkedNodes,
  indeterminateNodes,
}: TreeNodeProps) {
  const [expanded, setExpanded] = useState<boolean>(true);

  function handleCheck(item: DataCheckBox) {
    const isChecked = !checkedNodes[item.id];
    onCheck(item, !isChecked);
  }

  function handleExpanded() {
    setExpanded((prev) => !prev);
  }

  return (
    <ul
      style={{ marginLeft: `${item.level * 20}px` }}
      className="flex flex-col gap-1"
    >
      <li className="flex items-center gap-2">
        <div className="cursor-pointer w-6" onClick={handleExpanded}>
          {item.children.length > 0 && (
            <>{expanded ? <ChevronDown /> : <ChevronRight />}</>
          )}
        </div>

        <Checkbox
          label={item.name}
          id={item.id}
          name={item.name}
          hoverBackground
          checked={checkedNodes[item.id] ?? false}
          indeterminate={indeterminateNodes[item.id] ?? false}
          onChecked={() => handleCheck(item)}
        />
      </li>

      {expanded &&
        item.children && item.children.map((child) => (
          <TreeNode
            item={child}
            key={child.id}
            onCheck={onCheck}
            checkedNodes={checkedNodes}
            indeterminateNodes={indeterminateNodes}
          />
        ))}
    </ul>
  );
}
