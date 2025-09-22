import React from "react";

interface TextAreaFieldProps {
  label?: string;
  labelIcon?: React.ReactNode;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name: string;
  className?: string;
  labelClassName?: string;
  error?: string;
  resize?: "none" | "y" | "x" | "both";
  row?:number,
  required?:boolean,
  id?:string

}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  labelIcon,
  placeholder,
  value,
  onChange,
  name,
  className = "",
  labelClassName = "",
  error,
  resize = "y",
  row=0,
  required=false,
  id=""
}) => {
  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className={`flex items-center text-gray-700 font-semibold mb-1 ${labelClassName}`}>
          {labelIcon && <span className="mr-2">{labelIcon}</span>}
          {label}
        </label>
      )}

      {/* Text Area */}
      <div className="relative">
        <textarea
          name={name}
          placeholder={placeholder}
          className={`w-full bg-transparent outline-none text-gray-800 
          ${resize === "none" ? "resize-none" : resize === "y" ? "resize-y" : resize === "x" ? "resize-x" : "resize"} 
          ${error ? "border-red-500" : "border-gray-300"} 
          ${className}`}
          value={value}
          onChange={onChange}
          rows={row}
          id={id}
          required={required}
        ></textarea>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default TextAreaField;
