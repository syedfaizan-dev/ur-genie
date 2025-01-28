import React, { FC } from "react";
import classNames from "classnames";

// // Define the types for the props
// interface InputProps {
//   label?: string;
//   placeholder?: string;
//   type?: string;
//   value?: string | number;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   error?: string;
//   disabled?: boolean;
//   size?: "sm" | "md" | "lg";
//   [key: string]: any; // To allow additional props
//   theme?: "dark" | "light"
// }

// const Input: FC<InputProps> = ({
const Input = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  disabled = false,
  size = "md",
  theme = "light",
  className = "",
  ...rest
}) => {
  const inputStyles = classNames(
    `w-full rounded border focus:outline-none transition duration-200 `,
    {
      "p-1 text-sm": size === "sm",
      "p-2 text-base": size === "md",
      "p-3 text-lg": size === "lg",
      "bg-gray-200 text-gray-800 border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-400": theme === "light" && !error && !disabled,
      "bg-zinc-800 border-zinc-600 focus:border-zinc-800 focus:ring focus:ring-zinc-700": theme === "dark" && !error && !disabled,
      "border-red-400 bg-red-50 text-red-700 focus:border-red-500 focus:ring-red-200":
        error,
      "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400": disabled,
    }
  );

  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1 text-sm font-semibold ">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        className={`${inputStyles} ${className}`}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Input;
