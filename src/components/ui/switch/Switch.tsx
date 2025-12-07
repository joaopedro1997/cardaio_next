import React from "react";

interface SwitchProps {
    checked: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
    size?: "sm" | "md";
}

const Switch: React.FC<SwitchProps> = ({
    checked,
    onChange,
    disabled = false,
    className = "",
    size = "md",
}) => {
    const handleToggle = () => {
        if (!disabled && onChange) {
            onChange(!checked);
        }
    };

    const sizes = {
        sm: {
            switch: "w-8 h-4",
            dot: "w-3 h-3",
            translate: "translate-x-4",
        },
        md: {
            switch: "w-11 h-6",
            dot: "w-5 h-5",
            translate: "translate-x-5",
        },
    };

    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={handleToggle}
            disabled={disabled}
            className={`relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${checked ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"
                } ${sizes[size].switch} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
        >
            <span
                className={`${checked ? sizes[size].translate : "translate-x-1"
                    } inline-block transform rounded-full bg-white transition-transform ${sizes[size].dot}`}
            />
        </button>
    );
};

export default Switch;
