import React from "react";

interface CardProps {
  children?: React.ReactNode;
  className?: string; 
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={`bg-white  shadow-lg rounded-lg p-6 border border-gray-300 hover:shadow-xl transition duration-300 w-full max-w-md mx-auto flex flex-col ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
