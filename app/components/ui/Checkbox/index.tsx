import { VariantProps, cva, cx } from "class-variance-authority";
import React from "react";

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

const svgStyle = cva([
  "absolute",
  "pointer-events-none",
  "hidden",
  "peer-checked:block",
  "stroke-white",
  "mt-1",
  "pl-1",
  "outline-none",
], {
  variants: {
    size: {
      small: ["w-4", "h-4"],
      medium: ["w-5", "h-5"],
      large: ["w-6", "h-6"],
    },
  },
  defaultVariants: {
    size: "medium",
  },
  
})

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof inputStyle> {
  label: string;
  hoverBackground?: boolean;
}

export default function Checkbox({ label, size, hoverBackground, ...props }: CheckboxProps) {
  return (
    <div className={cx("flex items-center w-full", {
      "hover:bg-gray-200": hoverBackground,
    })}>
      <input
        type="checkbox"
        checked={props.checked}
        className={inputStyle({ size })}
        {...props}
      />
      <svg
        className={svgStyle({ size })}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <label
        htmlFor={props.id}
        className="ml-2 text-gray-700 cursor-pointer text-xl"
      >
        {label}
      </label>
    </div>
  );
}
