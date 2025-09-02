"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  loading?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  fullWidth = false,
  type = "button",
}: ButtonProps) {
  const sizeClasses = {
    sm: "h-10 px-6 text-sm",
    md: "h-12 px-8 text-base", 
    lg: "h-14 px-12 text-lg",
  };

  const variantClasses = {
    primary: disabled || loading
      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
      : "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/25 hover:shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98]",
    secondary: disabled || loading
      ? "bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700"
      : "bg-white/5 text-white border border-white/20 hover:bg-white/10 hover:border-white/30",
    ghost: disabled || loading
      ? "text-gray-500 cursor-not-allowed"
      : "text-white hover:text-red-400 hover:bg-white/5",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center
        font-semibold rounded-lg
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-red-500/50
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}