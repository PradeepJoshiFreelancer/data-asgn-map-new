import React from "react";

interface CardProps {
  children: React.ReactNode;
  animationClass?: string; // New prop for animation style
}

const Card: React.FC<CardProps> = ({ children, animationClass = "" }) => {
  return (
    <div
      className={`border rounded-xl shadow-lg p-6 bg-white w-full max-w-4xl mx-auto transition-transform duration-500 ease-in-out ${animationClass}`}
    >
      {children}
    </div>
  );
};

export default Card;
