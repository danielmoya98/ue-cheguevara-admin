"use client";

import { ScheduleSlot, Subject } from "../types/academic.types";
import { Plus, X } from "lucide-react";

// Horas estándar (Configurable en el futuro)
const PERIODS = [
    { start: "08:00", end: "08:45" },
    { start: "08:45", end: "09:30" },
    { start: "09:30", end: "10:00", isBreak: true }, // RECREO
    { start: "10:00", end: "10:45" },
    { start: "10:45", end: "11:30" },
    { start: "11:30", end: "12:15" },
];

const DAYS = ["LUN", "MAR", "MIE", "JUE", "VIE"];

interface ScheduleGridProps {
    slots: ScheduleSlot[];
    subjects: Subject[];
    onSlotClick: (day: string, timeStart: string) => void;
    onRemoveSlot: (slotId: string) => void;
}

export default function ScheduleGrid({ slots, subjects, onSlotClick, onRemoveSlot }: ScheduleGridProps) {

    const getSubjectInSlot = (day: string, start: string) => {
        const slot = slots.find(s => s.day === day && s.startTime === start);
        if (!slot || !slot.subjectId) return null;
        return { slot, subject: subjects.find(sub => sub.id === slot.subjectId) };
    };

    return (
        <div className="overflow-x-auto border border-uecg-line bg-white mt-4">
            <table className="w-full text-center border-collapse">
                <thead>
                <tr className="bg-uecg-black text-white">
                    <th className="p-3 text-[10px] uppercase tracking-widest w-20">Hora</th>
                    {DAYS.map(day => (
                        <th key={day} className="p-3 text-xs font-black uppercase tracking-widest border-l border-gray-700">
                            {day}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {PERIODS.map((period, idx) => (
                    <tr key={idx} className={period.isBreak ? "bg-gray-100" : "border-b border-uecg-line"}>

                        {/* Columna Hora */}
                        <td className="p-2 border-r border-uecg-line text-[10px] font-mono font-bold text-uecg-gray">
                            {period.start}<br/>{period.end}
                        </td>

                        {/* Si es recreo, una sola celda larga */}
                        {period.isBreak ? (
                            <td colSpan={5} className="p-2 text-center text-xs font-black uppercase text-uecg-gray tracking-[0.5em]">
                                DESCANSO / RECREO
                            </td>
                        ) : (
                            /* Celdas de Clases */
                            DAYS.map(day => {
                                const data = getSubjectInSlot(day, period.start);

                                return (
                                    <td key={`${day}-${period.start}`} className="border-l border-uecg-line p-1 h-16 w-32 relative group">
                                        {data?.subject ? (
                                            // SLOT OCUPADO
                                            <div
                                                className="w-full h-full flex flex-col items-center justify-center text-white text-[10px] font-bold uppercase p-1 relative"
                                                style={{ backgroundColor: data.subject.color }}
                                            >
                                                <span>{data.subject.name}</span>
                                                <button
                                                    onClick={() => onRemoveSlot(data.slot.id)}
                                                    className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 hover:text-red-200"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ) : (
                                            // SLOT VACÍO
                                            <button
                                                onClick={() => onSlotClick(day, period.start)}
                                                className="w-full h-full flex items-center justify-center text-gray-200 hover:text-uecg-blue hover:bg-blue-50 transition-colors"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        )}
                                    </td>
                                );
                            })
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}