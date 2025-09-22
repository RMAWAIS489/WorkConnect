import React from "react";

interface InputFieldProps {
  label?: string;
  labelIcon?: React.ReactNode; 
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  iconBefore?: React.ReactNode;
  type?: string;
  name?: string;
  className?: string;
  labelClassName?: string; 
  required?: boolean;
  id?:string
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  labelIcon,
  placeholder,
  value,
  onChange,
  iconBefore,
  type = "text",
  name,
  className = "",
  id="",
  labelClassName= "",
  required = false,
}) => {
  return (
    <div className={`w-full`}>
      {label && (
        <label className={`flex items-center text-gray-700 font-semibold mb-1 ${labelClassName}`}>
          {labelIcon && <span className="mr-2">{labelIcon}</span>} 
          {label}
        </label>
      )}
      <div className={`flex items-center border-gray-300 bg-gray-100 rounded-lg px-4 py-2 w-full ${className}`}>
        {iconBefore && <span className="text-gray-500 mr-2">{iconBefore}</span>}
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          className={`w-full bg-transparent outline-none text-gray-800`}
          value={value}
          onChange={onChange}
          required={required}
          id={id}
        />
      </div>
    </div>
  );
};

export default InputField;
