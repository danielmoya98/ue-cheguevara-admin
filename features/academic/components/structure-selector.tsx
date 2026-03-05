"use client";

import { AcademicLevel, ShiftType } from "../types/academic.types";
import { Sun, Moon, Sunset, Layers } from "lucide-react";

interface StructureSelectorProps {
    level: AcademicLevel;
    shift: ShiftType;
    onLevelChange: (l: AcademicLevel) => void;
    onShiftChange: (s: ShiftType) => void;
}

export default function StructureSelector({ level, shift, onLevelChange, onShiftChange }: StructureSelectorProps) {
    return (
        <div className="bg-white border border-uecg-line p-4 flex flex-col md:flex-row justify-between gap-4">

            {/* SELECTOR DE NIVEL (1-6 Prim vs Sec) */}
            <div className="flex gap-1">
                {(["primaria", "secundaria"] as AcademicLevel[]).map((l) => (
                    <button
                        key={l}
                        onClick={() => onLevelChange(l)}
                        className={`
              px-6 py-3 text-xs font-black uppercase tracking-widest border-2 transition-all
              ${level === l
                            ? "bg-uecg-black text-white border-uecg-black"
                            : "bg-gray-50 text-uecg-gray border-gray-200 hover:border-uecg-blue hover:text-uecg-blue"
                        }
            `}
                    >
                        {l}
                    </button>
                ))}
            </div>

            {/* SELECTOR DE TURNO (Preparado para futuro) */}
            <div className="flex items-center gap-2 border-l border-uecg-line pl-4">
                <span className="text-[10px] font-bold uppercase text-uecg-gray hidden md:block">Turno:</span>

                <button
                    onClick={() => onShiftChange("morning")}
                    className={`p-2 border-2 ${shift === "morning" ? "border-uecg-blue text-uecg-blue bg-blue-50" : "border-gray-200 text-gray-400 grayscale"}`}
                    title="Mañana"
                >
                    <Sun size={20} />
                </button>

                <button
                    onClick={() => onShiftChange("afternoon")}
                    className={`p-2 border-2 ${shift === "afternoon" ? "border-uecg-blue text-uecg-blue bg-blue-50" : "border-gray-200 text-gray-400 grayscale"}`}
                    title="Tarde (Futuro)"
                >
                    <Sunset size={20} />
                </button>

                <button
                    onClick={() => onShiftChange("night")}
                    className={`p-2 border-2 ${shift === "night" ? "border-uecg-blue text-uecg-blue bg-blue-50" : "border-gray-200 text-gray-400 grayscale"}`}
                    title="Noche (Futuro)"
                >
                    <Moon size={20} />
                </button>
            </div>
        </div>
    );
}