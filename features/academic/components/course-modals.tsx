"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Modal from "@/shared/components/modal";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { assignCourseAction, removeCourseAction } from "../actions/course.action";
import { AlertTriangle } from "lucide-react";

const initialState = { success: false, message: "" };

interface CourseModalsProps {
    classroomId: string;
    subjects: any[]; // Lista de materias disponibles
    teachers: any[]; // Lista de docentes disponibles
}

export default function CourseModals({ classroomId, subjects, teachers }: CourseModalsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const action = searchParams.get("action");
    const courseId = searchParams.get("courseId");

    const handleClose = () => router.push(`/admin/academic/classrooms/${classroomId}`, { scroll: false });

    // --- STATES ---
    const [assignState, formActionAssign, isPendingAssign] = useActionState(assignCourseAction, initialState);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        if (assignState && assignState.message) {
            if (assignState.success) {
                toast.success(assignState.message);
                handleClose();
            } else {
                toast.error(assignState.message);
            }
        }
    }, [assignState]);

    const handleRemove = async () => {
        if (!courseId) return;
        setIsRemoving(true);
        const result = await removeCourseAction(courseId, classroomId);
        setIsRemoving(false);
        if (result.success) {
            toast.success(result.message);
            handleClose();
        } else {
            toast.error(result.message || "Error al remover");
        }
    };

    const labelClass = "text-xs font-black uppercase tracking-[0.15em] text-uecg-black mb-2 block";
    const selectWrapperClass = "relative border-2 border-gray-300 bg-white focus-within:border-uecg-blue transition-colors";

    return (
        <>
            {/* MODAL: ASIGNAR MATERIA */}
            <Modal title="Añadir a la Malla Curricular" isOpen={action === "assign"} onClose={handleClose}>
                <form action={formActionAssign} className="space-y-6">
                    <input type="hidden" name="classroomId" value={classroomId} />

                    <div>
                        <label className={labelClass}>Seleccionar Materia</label>
                        <div className={selectWrapperClass}>
                            {/* CORRECCIÓN: defaultValue="" en el select, y quitamos "selected" del option */}
                            <select name="subjectId" className="w-full p-3 font-bold text-uecg-black bg-transparent outline-none appearance-none cursor-pointer z-10 relative text-sm" required defaultValue="">
                                <option value="" disabled>Elige una materia del catálogo...</option>
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.weeklyHours} Hrs)</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-uecg-black font-black text-xs">▼</div>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Asignar Docente (Opcional)</label>
                        <div className={selectWrapperClass}>
                            {/* Añadimos defaultValue="" aquí también por buena práctica */}
                            <select name="teacherId" className="w-full p-3 font-bold text-uecg-black bg-transparent outline-none appearance-none cursor-pointer z-10 relative text-sm" defaultValue="">
                                <option value="">[ Por Asignar ]</option>
                                {teachers.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-uecg-black font-black text-xs">▼</div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t-2 border-uecg-line mt-8">
                        <button type="button" onClick={handleClose} className="flex-1 py-4 border-2 border-gray-300 text-xs font-black uppercase tracking-widest text-gray-500 hover:border-uecg-black hover:text-uecg-black transition-all">Cancelar</button>
                        <button type="submit" disabled={isPendingAssign} className="flex-1 py-4 bg-uecg-blue text-white text-xs font-black uppercase tracking-widest hover:bg-uecg-dark transition-all disabled:opacity-50">Añadir a Malla</button>
                    </div>
                </form>
            </Modal>

            {/* MODAL: QUITAR MATERIA */}
            <Modal title="Quitar de la Malla" isOpen={action === "remove"} onClose={handleClose}>
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="h-16 w-16 bg-red-50 flex items-center justify-center text-red-600 border-2 border-red-200">
                        <AlertTriangle size={32} strokeWidth={2} />
                    </div>
                    <div>
                        <p className="text-uecg-black font-black uppercase tracking-widest text-lg">¿Remover Asignatura?</p>
                        <p className="text-uecg-gray text-xs mt-2 font-bold uppercase">Esta materia ya no se dictará en este curso.</p>
                    </div>
                    <div className="flex gap-4 w-full pt-4">
                        <button onClick={handleClose} className="flex-1 py-4 border-2 border-uecg-line text-xs font-black uppercase tracking-widest text-uecg-gray hover:border-uecg-black transition-colors">Cancelar</button>
                        <button onClick={handleRemove} disabled={isRemoving} className="flex-1 py-4 bg-red-600 text-white text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-colors border-2 border-red-600 disabled:opacity-50">Sí, Remover</button>
                    </div>
                </div>
            </Modal>
        </>
    );
}