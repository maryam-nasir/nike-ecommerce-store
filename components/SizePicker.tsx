"use client";

import { useState } from "react";

const SIZES = [
  "5", "5.5", "6", "6.5", "7", "7.5",
  "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"
];

export default function SizePicker() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2" role="listbox" aria-label="Choose size">
      {SIZES.map((size) => {
        const isSelected = selected === size;
        const disabled = ["10.5", "11.5"].includes(size);
        return (
          <button
            key={size}
            type="button"
            role="option"
            aria-selected={isSelected}
            disabled={disabled}
            onClick={() => !disabled && setSelected(size)}
            className={`h-11 rounded-md border text-body ${
              disabled
                ? "cursor-not-allowed border-light-300 text-dark-500"
                : isSelected
                ? "border-dark-900 bg-dark-900 text-white"
                : "border-light-300 bg-light-100 text-dark-900 hover:border-dark-900"
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}


