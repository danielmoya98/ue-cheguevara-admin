"use client";

interface SwissSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export default function SwissSwitch({ checked, onChange, disabled }: SwissSwitchProps) {
    return (
        <button
            type="button"
            onClick={() => !disabled && onChange(!checked)}
            disabled={disabled}
            className={`
        relative w-12 h-6 border-2 transition-colors duration-200
        ${checked
                ? "bg-uecg-blue border-uecg-blue"
                : "bg-gray-100 border-gray-300 hover:border-uecg-gray"
            }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
        >
            {/* El "Thumb" o indicador es cuadrado */}
            <span
                className={`
          absolute top-0.5 bottom-0.5 w-4 bg-white transition-all duration-200
          ${checked ? "left-[26px]" : "left-0.5"}
        `}
            />
        </button>
    );
}