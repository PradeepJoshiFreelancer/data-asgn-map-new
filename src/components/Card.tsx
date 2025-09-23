import React from "react";

interface CardProps {
  children: React.ReactNode;
  animationClass?: string; // New prop for animation style
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`border rounded-xl shadow-lg bg-white w-full max-w-screen-xl mx-auto p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
