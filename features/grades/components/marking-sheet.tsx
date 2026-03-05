"use client";

import { useState, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { saveMarksAction } from "../actions/grade.action";
import { Save, AlertTriangle } from "lucide-react";

interface RosterStudent {
    studentId: string;
    documentId: string;
    name: string;
    score: number | null; // null si aún no tiene nota
    feedback: string;
}

interface MarkingSheetProps {
    evaluationId: string;
    maxScore: number;
    initialRoster: RosterStudent[];
}

const initialState = { success: false, message: "" };

export default function MarkingSheet({ evaluationId, maxScore, initialRoster }: MarkingSheetProps) {
    // Estado local para la planilla
    const [roster, setRoster] = useState<RosterStudent[]>(initialRoster);
    const [state, formAction, isPending] = useActionState(saveMarksAction, initialState);

    useEffect(() => {
        if (state && state.message) {
            if (state.success) {
                toast.success(state.message);
            } else {
                toast.error(state.message);
            }
        }
    }, [state]);

    // Manejar cambio de nota
    const handleScoreChange = (studentId: string, value: string) => {
        // Permitir borrar el input o ingresar números válidos
        let newScore = value === "" ? null : parseFloat(value);

        // Evitar que pongan más del máximo permitido
        if (newScore !== null && newScore > maxScore) {
            newScore = maxScore;
        }

        setRoster(current =>
            current.map(student =>
                student.studentId === studentId ? { ...student, score: newScore } : student
            )
        );
    };

    // Manejar observaciones
    const handleFeedbackChange = (studentId: string, feedback: string) => {
        setRoster(current =>
            current.map(student =>
                student.studentId === studentId ? { ...student, feedback } : student
            )
        );
    };

    // Estadísticas
    const gradedCount = roster.filter(s => s.score !== null).length;
    const passedCount = roster.filter(s => s.score !== null && s.score >= 51).length;
    const failedCount = roster.filter(s => s.score !== null && s.score < 51).length;

    return (
        <form action={formAction} className="space-y-6 animate-in fade-in duration-300">
            {/* Enviamos el JSON con las notas válidas (excluyendo nulls) */}
            <input
                type="hidden"
                name="data"
                value={JSON.stringify({
                    evaluationId,
                    marks: roster.filter(s => s.score !== null).map(s => ({
                        studentId: s.studentId,
                        score: s.score,
                        feedback: s.feedback
                    }))
                })}
            />

            {/* Panel de Estadísticas y Guardado */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50 p-4 border-2 border-uecg-line">
                <div className="flex flex-wrap gap-4 text-xs font-black uppercase tracking-widest">
                    <span className="text-uecg-gray">Calificados: {gradedCount} / {roster.length}</span>
                    <span className="text-green-600">Aprobados: {passedCount}</span>
                    <span className="text-red-600">Reprobados: {failedCount}</span>
                </div>

                <button
                    type="submit"
                    disabled={isPending || gradedCount === 0}
                    className="flex items-center gap-2 px-8 py-3 bg-uecg-black text-white font-black uppercase tracking-widest text-xs hover:bg-uecg-blue transition-colors border-2 border-uecg-black disabled:opacity-50"
                >
                    <Save size={16} strokeWidth={2.5} />
                    {isPending ? "Guardando..." : "Guardar Notas"}
                </button>
            </div>

            {/* Planilla de Notas (Estilo Excel Suizo) */}
            <div className="w-full overflow-x-auto border-2 border-uecg-black bg-white">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                    <tr className="bg-uecg-black text-white border-b-2 border-uecg-black">
                        <th className="p-4 text-xs font-black uppercase tracking-widest w-12 text-center">Nº</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest">Estudiante</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest w-32 text-center">
                            Nota <span className="text-[10px] text-gray-400 block">Máx: {maxScore}</span>
                        </th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest w-1/3">Observación / Feedback</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-200">
                    {roster.map((student, index) => {
                        // Lógica visual: Si reprobó, poner rojo. Si aprobó, azul.
                        const isFailing = student.score !== null && student.score < 51;
                        const isGraded = student.score !== null;

                        return (
                            <tr key={student.studentId} className={`transition-colors ${isFailing ? 'bg-red-50/50' : 'hover:bg-gray-50'}`}>
                                <td className="p-4 text-center font-mono text-xs font-bold text-uecg-gray border-r-2 border-gray-200">
                                    {index + 1}
                                </td>
                                <td className="p-4 border-r-2 border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-black text-sm uppercase text-uecg-black block leading-none">{student.name}</span>
                                            <span className="text-[10px] font-mono text-uecg-gray mt-1 block">CI: {student.documentId}</span>
                                        </div>
                                        {isFailing && <AlertTriangle size={14} className="text-red-500 mr-2" />}
                                    </div>
                                </td>
                                <td className="p-4 border-r-2 border-gray-200 relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max={maxScore}
                                        placeholder="--"
                                        value={student.score === null ? "" : student.score}
                                        onChange={(e) => handleScoreChange(student.studentId, e.target.value)}
                                        className={`
                                                w-full text-center text-lg font-black bg-transparent outline-none transition-colors py-2 border-b-2
                                                ${!isGraded ? 'border-gray-300 text-uecg-black focus:border-uecg-blue' :
                                            isFailing ? 'border-red-500 text-red-600' : 'border-uecg-blue text-uecg-blue'}
                                            `}
                                    />
                                </td>
                                <td className="p-4">
                                    <input
                                        type="text"
                                        placeholder="Opcional..."
                                        value={student.feedback}
                                        onChange={(e) => handleFeedbackChange(student.studentId, e.target.value)}
                                        className="w-full border-b-2 border-transparent hover:border-gray-300 bg-transparent p-2 text-xs font-bold text-uecg-black uppercase placeholder:text-gray-400 focus:border-uecg-blue outline-none transition-colors"
                                    />
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </form>
    );
}