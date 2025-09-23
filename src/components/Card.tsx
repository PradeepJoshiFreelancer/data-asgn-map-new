import React from "react";

interface CardProps {
  children: React.ReactNode;
  animationClass?: string; // add this
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  animationClass = "",
  className = "",
}) => {
  return (
    <div
      className={`border rounded-xl shadow-lg bg-white w-full max-w-7xl mx-auto p-8 ${animationClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
