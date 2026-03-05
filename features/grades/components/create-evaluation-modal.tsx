"use client";

import { useActionState, useEffect } from "react";
import Modal from "@/shared/components/modal";
import { toast } from "sonner";
import { createEvaluationAction } from "../actions/grade.action";
// IMPORTANTE: Añadimos usePathname
import { useRouter, usePathname } from "next/navigation";

const initialState = { success: false, message: "", evaluationId: "" };

export default function CreateEvaluationModal({ courseId, isOpen }: { courseId: string, isOpen: boolean }) {
    const router = useRouter();
    const pathname = usePathname(); // Detecta mágicamente en qué ruta estamos
    const [state, formAction, isPending] = useActionState(createEvaluationAction, initialState);

    // Verificamos si estamos en la vista del administrador
    const isAdmin = pathname.startsWith("/admin");

    // FUNCIÓN INTERNA PARA CERRAR (Navega a la ruta correcta según el rol)
    const handleClose = () => {
        const returnUrl = isAdmin
            ? `/admin/grades/course/${courseId}`
            : `/teacher/courses/${courseId}`;

        router.push(returnUrl, { scroll: false });
    };

    useEffect(() => {
        if (state && state.message) {
            if (state.success) {
                toast.success(state.message);

                // REDIRECCIÓN MÁGICA a la planilla dependiendo de quién lo creó
                if (state.evaluationId) {
                    const evaluateUrl = isAdmin
                        ? `/admin/grades/evaluate/${state.evaluationId}`
                        : `/teacher/courses/${courseId}/evaluate/${state.evaluationId}`;

                    router.push(evaluateUrl);
                } else {
                    handleClose(); // Cierra si por alguna razón no hay ID
                }
            } else {
                toast.error(state.message);
            }
        }
    }, [state, router, courseId, isAdmin]);

    const labelClass = "text-xs font-black uppercase tracking-widest text-uecg-gray mb-1 block";
    const inputClass = "w-full border-2 border-gray-300 p-3 text-sm font-bold text-uecg-black uppercase focus:border-uecg-blue outline-none transition-colors";

    return (
        <Modal title="Nueva Evaluación" isOpen={isOpen} onClose={handleClose}>
            <form action={formAction} className="space-y-6">
                <input type="hidden" name="courseId" value={courseId} />

                <div>
                    <label className={labelClass}>Título de la Evaluación</label>
                    <input name="title" placeholder="Ej: Primer Parcial" required className={inputClass} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Fecha Programada</label>
                        <input type="date" name="date" required className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Trimestre Académico</label>
                        <div className="relative">
                            <select name="term" className={`${inputClass} appearance-none bg-transparent relative z-10 cursor-pointer`}>
                                <option value="TRIMESTRE_1">1er Trimestre</option>
                                <option value="TRIMESTRE_2">2do Trimestre</option>
                                <option value="TRIMESTRE_3">3er Trimestre</option>
                                <option value="RECUPERATORIO">Recuperatorio</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-uecg-black font-black text-xs z-0">▼</div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t-2 border-uecg-line mt-6 flex gap-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 py-4 border-2 border-gray-300 text-xs font-black uppercase tracking-widest text-gray-500 hover:border-uecg-black hover:text-uecg-black transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex-1 py-4 bg-uecg-blue text-white text-xs font-black uppercase tracking-widest hover:bg-uecg-dark transition-colors disabled:opacity-50 border-2 border-uecg-blue"
                    >
                        {isPending ? "Creando..." : "Crear y Calificar"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}