import React, { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

const Label: FC<LabelProps> = ({ children, className, ...props }) => {
  return (
    <label
      className={twMerge(
        // Default classes that apply by default
        "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400",

        // User-defined className that can override the default margin
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;
