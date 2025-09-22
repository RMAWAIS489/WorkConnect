import React from "react";

interface DropdownProps {
  label?: string;
  name?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ label, name, options, value, onChange, className }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full p-2 border rounded-md border-gray-300 bg-transparent outline-none text-gray-800 ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
