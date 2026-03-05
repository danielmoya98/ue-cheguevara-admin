"use client";

import { useState } from "react";
import { Grade, Subject } from "../types/academic.types";
import { Layers, ArrowRight, X } from "lucide-react";

interface CurriculumBuilderProps {
    grade: Grade;
    availableSubjects: Subject[];
}

export default function CurriculumBuilder({ grade, availableSubjects }: CurriculumBuilderProps) {
    // Estado local para simular asignación
    const [assignedSubjects, setAssignedSubjects] = useState<Subject[]>([]);

    const handleAddSubject = (subjectId: string) => {
        const subject = availableSubjects.find(s => s.id === subjectId);
        if (subject && !assignedSubjects.find(s => s.id === subjectId)) {
            setAssignedSubjects([...assignedSubjects, subject]);
        }
    };

    const handleRemoveSubject = (subjectId: string) => {
        setAssignedSubjects(assignedSubjects.filter(s => s.id !== subjectId));
    };

    return (
        <div className="border border-uecg-line bg-white mt-6">
            {/* Header del Constructor */}
            <div className="bg-uecg-black p-4 flex justify-between items-center text-white">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest opacity-70">
                        Configurando Malla Curricular
                    </h3>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-black uppercase tracking-tighter">
                            {grade.name} {grade.level}
                        </h2>
                        {/* Aquí en el futuro mostraríamos el badge del Paralelo */}
                        {grade.parallels && grade.parallels.length > 0 && (
                            <span className="bg-uecg-blue px-2 py-0.5 text-xs font-bold uppercase">
                 Paralelo Único
               </span>
                        )}
                    </div>
                </div>
                <Layers size={24} strokeWidth={1.5} />
            </div>

            <div className="flex flex-col lg:flex-row h-[500px]">

                {/* COLUMNA IZQUIERDA: Materias Disponibles */}
                <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-uecg-line p-4 bg-gray-50 flex flex-col">
                    <h4 className="text-xs font-black uppercase tracking-widest text-uecg-gray mb-4">
                        Catálogo Disponible
                    </h4>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                        {availableSubjects.map(sub => (
                            <button
                                key={sub.id}
                                onClick={() => handleAddSubject(sub.id)}
                                disabled={!!assignedSubjects.find(s => s.id === sub.id)}
                                className="w-full text-left p-3 bg-white border border-gray-200 hover:border-uecg-blue flex justify-between items-center group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div>
                                    <span className="block text-[10px] font-mono text-gray-400">{sub.code}</span>
                                    <span className="block text-xs font-bold text-uecg-black uppercase">{sub.name}</span>
                                </div>
                                <ArrowRight size={14} className="text-uecg-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* COLUMNA DERECHA: Materias Asignadas (Visualización) */}
                <div className="w-full lg:w-2/3 p-6 bg-white flex flex-col">
                    <div className="flex justify-between mb-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-uecg-blue">
                            Materias Asignadas este Año
                        </h4>
                        <span className="text-xs font-mono font-bold text-uecg-gray">
               TOTAL: {assignedSubjects.length}
             </span>
                    </div>

                    {assignedSubjects.length === 0 ? (
                        <div className="flex-1 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm uppercase font-bold tracking-widest">
                            Selecciona materias del panel izquierdo
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto content-start">
                            {assignedSubjects.map(sub => (
                                <div key={sub.id} className="relative p-4 border-2 border-uecg-blue bg-blue-50/20 group">
                                    <button
                                        onClick={() => handleRemoveSubject(sub.id)}
                                        className="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 p-1 transition-all"
                                    >
                                        <X size={12} />
                                    </button>
                                    <span className="text-[10px] font-mono text-uecg-blue font-bold">{sub.code}</span>
                                    <p className="text-sm font-black uppercase text-uecg-black mt-1 leading-tight">
                                        {sub.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-auto pt-6 border-t border-uecg-line flex justify-end">
                        <button className="px-8 py-3 bg-uecg-black text-white font-black uppercase text-xs tracking-widest hover:bg-uecg-blue transition-colors">
                            Guardar Malla Curricular
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}