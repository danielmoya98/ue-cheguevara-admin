import Link from "next/link";
import { ChevronLeft, FileSpreadsheet, Calendar, User, AlertCircle } from "lucide-react";
import MarkingSheet from "@/features/grades/components/marking-sheet";
import { apiFetch } from "../../../../lib/api-client";

export default async function EvaluatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: evaluationId } = await params;

    let data: any = null;
    let errorMessage = "";

    try {
        // Llamamos al endpoint mágico de NestJS que nos da la evaluación y los alumnos
        data = await apiFetch<any>(`/grades/evaluations/${evaluationId}/roster`);
    } catch (error: any) {
        // En lugar de ocultar el error, lo guardamos para mostrarlo
        errorMessage = error.message || "Fallo desconocido al obtener la planilla de evaluación";
    }

    // SI HAY UN ERROR, MOSTRAMOS LA PANTALLA ROJA DE DEPURACIÓN
    if (errorMessage || !data) {
        return (
            <div className="p-8 border-4 border-red-500 bg-red-50 space-y-6">
                <div className="flex items-center gap-2 text-red-600 font-black uppercase text-2xl tracking-tighter">
                    <AlertCircle size={32} strokeWidth={3} />
                    Error Cargando Planilla (NestJS)
                </div>

                <div className="bg-white p-4 border-l-4 border-red-500">
                    <h3 className="font-black text-uecg-black uppercase text-sm mb-1">El frontend intentó llamar a:</h3>
                    <code className="text-red-600 bg-red-50 px-2 py-1 text-xs font-bold block mb-2">GET /api/v1/grades/evaluations/{evaluationId}/roster</code>
                    <p className="text-xs text-uecg-gray font-mono mt-4 border-t-2 border-dashed border-red-200 pt-4">Mensaje del Backend:</p>
                    <p className="text-sm font-black text-red-700 uppercase">{errorMessage}</p>
                </div>

                <Link href="/admin/grades" className="mt-4 inline-block text-xs font-black uppercase text-uecg-black border-2 border-uecg-black px-4 py-2 hover:bg-uecg-black hover:text-white transition-colors">
                    Volver a Mis Materias
                </Link>
            </div>
        );
    }

    // SI NO HAY ERROR, PINTAMOS LA PLANILLA NORMALMENTE
    const { evaluation, roster } = data;
    const course = evaluation.course;
    const evalDate = new Date(evaluation.date);

    return (
        <div className="space-y-6 relative">

            <div className="border-b-4 border-uecg-black pb-6">
                <Link
                    href={`/admin/grades/course/${course.id}`}
                    className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-uecg-gray hover:text-uecg-blue mb-4 transition-colors"
                >
                    <ChevronLeft size={14} strokeWidth={3} />
                    Volver al Cuaderno
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-uecg-blue text-white flex items-center justify-center">
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
                                <span className="flex items-center gap-1"><Calendar size={12}/> {evalDate.toLocaleDateString('es-BO')}</span>
                                <span className="flex items-center gap-1"><User size={12}/> {course.subject.name} - {course.classroom.grade.name} "{course.classroom.name}"</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-100 border-2 border-gray-200 p-3 text-center min-w-[120px]">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-uecg-gray mb-1">Puntaje Máximo</span>
                        <span className="block text-2xl font-black text-uecg-black font-mono leading-none">{evaluation.maxScore}</span>
                    </div>
                </div>

                {evaluation.description && (
                    <div className="mt-6 bg-blue-50 border-l-4 border-uecg-blue p-4">
                        <p className="text-sm font-bold text-uecg-black uppercase">{evaluation.description}</p>
                    </div>
                )}
            </div>

            {/* Planilla de Calificaciones */}
            <MarkingSheet
                evaluationId={evaluationId}
                maxScore={evaluation.maxScore}
                initialRoster={roster}
            />

        </div>
    );
}