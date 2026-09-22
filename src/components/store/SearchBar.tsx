import React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <input
        aria-label="Search products"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border rounded w-64"
      />
    </div>
  );
}
