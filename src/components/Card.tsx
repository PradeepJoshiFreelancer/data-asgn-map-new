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
      className={`className="w-[85vw] min-h-[60vh] mx-auto my-8 p-8 flex flex-col border rounded-xl shadow-lg bg-white w-full max-w-7xl ${animationClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
