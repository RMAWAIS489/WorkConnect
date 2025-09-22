import { cn } from "@/app/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"|"danger"|"success"|"edit"|"delete"|"purple"|"close"|"profile";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  beforeIcon?: ReactNode; 
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  isLoading = false,
  disabled,
  beforeIcon, 
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline: " bg-gray-500 text-white hover:bg-gray-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
    delete: "bg-red-400 text-white hover:bg-red-600",
    success: "bg-green-600 text-white hover:bg-green-700",
    edit:" bg-teal-500  text-white  hover:bg-teal-600 ",
    purple:"bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700",
    close:"text-gray-500 hover:text-gray-800",
    profile: " text-gray-700 hover:text-blue-600",


  };

  const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full "></span>
      ) : (
        <>
          {beforeIcon && <span className="mr-2">{beforeIcon}</span>} 
          {props.children}
        </>
      )}
    </button>
  );
}
