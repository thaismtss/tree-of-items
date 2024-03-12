import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id="checkbox"
        name="checkbox"
        className="
            peer relative appearance-none w-4 h-4 border-2 border-gray-600 rounded-sm mt-1 bg-white cursor-pointer
            focus:outline-none focus:ring-offset-0 focus:ring-1 focus:ring-gray-200 focus:checked:ring-blue-200
            hover:bg-gray-200 hover:checked:bg-blue-600
            checked:bg-blue-500 checked:border-0
          "
        {...props}
      />
      <svg
        className="absolute w-4 h-4 pointer-events-none hidden peer-checked:block stroke-white mt-1 outline-none"
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
      <label htmlFor="checkbox" className="ml-2 text-gray-700 cursor-pointer">
        {label}
      </label>
    </div>
  );
}
