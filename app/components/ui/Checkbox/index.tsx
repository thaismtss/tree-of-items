import { VariantProps, cva, cx } from "class-variance-authority";
import React, { useEffect, useState } from "react";

const inputStyle = cva(
  [
    "peer",
    "relative",
    "appearance-none",
    "w-4",
    "h-4",
    "border-2",
    "border-gray-600",
    "rounded-sm",
    "mt-1",
    "bg-white",
    "cursor-pointer",
    "focus:outline-none",
    "focus:ring-offset-0",
    "focus:ring-2",
    "focus:ring-gray-400",
    "focus:checked:ring-blue-700",
    "hover:bg-gray-200",
    "hover:checked:bg-blue-600",
    "checked:bg-blue-500",
    "checked:border-0",
  ],
  {
    variants: {
      size: {
        small: ["h-5", "w-5"],
        medium: ["h-6", "w-6"],
        large: ["h-7", "w-7"],
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
);

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputStyle> {
  label: string;
  id: string;
  hoverBackground?: boolean;
  initialChecked?: boolean;
  indeterminate?: boolean;
  onChecked: (checked: boolean) => void;
}

export default function Checkbox({
  label,
  id,
  size,
  indeterminate,
  hoverBackground,
  onChecked,
  ...props
}: CheckboxProps) {
  const checkboxRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate ?? false;
    }
  }, [indeterminate]);

  return (
    <div
      className={cx("flex items-center w-full", {
        "hover:bg-gray-200": hoverBackground,
      })}
    >
      <input
        type="checkbox"
        ref={checkboxRef}
        className={inputStyle({ size })}
        checked={props.checked}
        name={id}
        id={id}
        onChange={() => {
          onChecked(!props.checked);
        }}
        {...props}
      />
      <label
        htmlFor={id}
        className="ml-2 text-gray-700 cursor-pointer md:text-xl"
      >
        {label}
      </label>
    </div>
  );
}
