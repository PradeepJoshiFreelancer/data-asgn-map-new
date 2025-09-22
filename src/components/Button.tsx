import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary"; // Added for color variants
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  ...props
}) => {
  const baseClasses =
    "px-4 py-2 rounded text-white font-semibold focus:outline-none transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses =
    variant === "primary"
      ? "bg-indigo-600 hover:bg-indigo-700"
      : "bg-pink-500 hover:bg-pink-600";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${props.className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
