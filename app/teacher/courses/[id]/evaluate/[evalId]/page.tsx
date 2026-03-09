import Link from "next/link";
import { ChevronLeft, FileSpreadsheet, Calendar, User } from "lucide-react";
import MarkingSheet from "@/features/grades/components/marking-sheet";
import { apiFetch } from "@/app/lib/api-client";

export const dynamic = "force-dynamic";

export default async function TeacherEvaluatePage(props: { params: Promise<{ id: string, evalId: string }> }) {
    const params = await props.params;
    const courseId = params.id;
    const evaluationId = params.evalId;

    let data;
    try {
        // Reutilizamos el endpoint mágico que construimos para el administrador
        data = await apiFetch<any>(`/grades/evaluations/${evaluationId}/roster`);
    } catch (error) {
        return (
            <div className="p-16 text-center border-4 border-dashed border-red-300 bg-white">
                <span className="font-black uppercase tracking-widest text-sm text-red-600 block mb-2">Evaluación No Encontrada</span>
                <span className="text-xs font-bold text-gray-500 uppercase block mb-6">El examen solicitado no existe o fue eliminado de la API.</span>
                <Link href={`/teacher/courses/${courseId}`} className="inline-block text-xs font-black uppercase tracking-widest text-white bg-uecg-black px-6 py-3 hover:bg-uecg-blue transition-colors border-2 border-uecg-black">
                    Volver al Curso
                </Link>
            </div>
        );
    }

    const { evaluation, roster } = data;
    const course = evaluation.course;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">

            {/* Header de la Evaluación */}
            <div className="border-b-4 border-uecg-black pb-6">
                <Link
                    href={`/teacher/courses/${courseId}`}
                    className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-uecg-gray hover:text-uecg-blue mb-4 transition-colors"
                >
                    <ChevronLeft size={14} strokeWidth={3} />
                    Volver al Curso
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-uecg-blue text-white flex items-center justify-center shadow-sm">
                            <FileSpreadsheet size={32} strokeWidth={1.5} />
                        </div>
                        <div>
                            <span className="inline-block bg-uecg-black text-white px-2 py-1 text-[10px] font-black uppercase tracking-widest mb-2">
                                {evaluation.term.replace('_', ' ')}
                            </span>
                            <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter leading-none">
                                {evaluation.title}
                            </h1>
                            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-uecg-gray mt-3">
                                <span className="flex items-center gap-1.5"><Calendar size={14} strokeWidth={2.5} /> {new Date(evaluation.date).toLocaleDateString('es-BO')}</span>
                                <span className="flex items-center gap-1.5"><User size={14} strokeWidth={2.5} /> {course.subject?.name} - {course.classroom?.grade?.name} "{course.classroom?.name}"</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-uecg-line p-4 text-center min-w-[140px] shadow-sm">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-uecg-gray mb-1">Puntaje Máximo</span>
                        <span className="block text-3xl font-black text-uecg-black font-mono leading-none">{evaluation.maxScore}</span>
                    </div>
                </div>

                {evaluation.description && (
                    <div className="mt-6 bg-blue-50 border-l-4 border-uecg-blue p-4">
                        <p className="text-sm font-bold text-uecg-black uppercase tracking-wide">{evaluation.description}</p>
                    </div>
                )}
            </div>

            {/* LA MAGIA: Reutilizamos el componente cliente de la planilla */}
            <MarkingSheet
                evaluationId={evaluationId}
                maxScore={evaluation.maxScore}
                initialRoster={roster}
            />

        </div>
    );
}