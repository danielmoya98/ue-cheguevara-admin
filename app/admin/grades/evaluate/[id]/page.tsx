import { gradeService } from "@/features/grades/services/grade.service";
import Link from "next/link";
import { ChevronLeft, FileSpreadsheet, Calendar, User } from "lucide-react";
import MarkingSheet from "@/features/grades/components/marking-sheet";

export default async function EvaluatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: evaluationId } = await params;

    // Obtener la evaluación y la lista de alumnos mezclada con sus notas
    let data;
    try {
        data = await gradeService.getMarkingRoster(evaluationId);
    } catch (error) {
        return (
            <div className="p-12 text-center border-2 border-dashed border-red-300 bg-red-50">
                <span className="font-black uppercase tracking-widest text-sm text-red-600 block">Evaluación No Encontrada</span>
                <Link href="/admin/academic" className="mt-4 inline-block text-xs font-bold text-uecg-blue hover:underline">
                    Volver al Inicio
                </Link>
            </div>
        );
    }

    const { evaluation, roster } = data;
    const course = evaluation.course;

    return (
        <div className="space-y-6 relative">

            {/* Header de la Evaluación */}
            <div className="border-b-4 border-uecg-black pb-6">
                <Link
                    // Asumimos que más adelante tendremos un dashboard para cada curso
                    href={`/admin/academic/classrooms/${course.classroomId}`}
                    className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-uecg-gray hover:text-uecg-blue mb-4 transition-colors"
                >
                    <ChevronLeft size={14} strokeWidth={3} />
                    Volver al Curso
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
                                <span className="flex items-center gap-1"><Calendar size={12}/> {evaluation.date.toLocaleDateString('es-BO')}</span>
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

            {/* Planilla de Calificaciones (Componente Cliente) */}
            <MarkingSheet
                evaluationId={evaluationId}
                maxScore={evaluation.maxScore}
                initialRoster={roster}
            />

        </div>
    );
}