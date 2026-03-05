"use client";

import { useActionState, useEffect } from "react";
import Modal from "@/shared/components/modal";
import { toast } from "sonner";
import { createAnnouncementAction } from "../actions/announcement.action";
import { useRouter } from "next/navigation";

const initialState = { success: false, message: "" };

export default function CreateAnnouncementModal({ isOpen }: { isOpen: boolean }) {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(createAnnouncementAction, initialState);

    const handleClose = () => {
        // Cierra el modal quitando el parámetro de la URL
        router.push("/admin/dashboard", { scroll: false });
    };

    useEffect(() => {
        if (state && state.message) {
            if (state.success) {
                toast.success(state.message);
                handleClose();
            } else {
                toast.error(state.message);
            }
        }
    }, [state]);

    const labelClass = "text-xs font-black uppercase tracking-widest text-uecg-gray mb-1 block";
    const inputClass = "w-full border-2 border-gray-300 p-3 text-sm font-bold text-uecg-black focus:border-uecg-blue outline-none transition-colors";

    return (
        <Modal title="Emitir Nuevo Comunicado" isOpen={isOpen} onClose={handleClose}>
            <form action={formAction} className="space-y-6">

                <div>
                    <label className={labelClass}>Título del Aviso</label>
                    <input
                        name="title"
                        placeholder="Ej: Suspensión de clases por feriado"
                        required
                        className={`${inputClass} uppercase`}
                    />
                </div>

                <div>
                    <label className={labelClass}>Público Objetivo (Audiencia)</label>
                    <div className="relative">
                        <select name="target" className={`${inputClass} appearance-none bg-transparent relative z-10 cursor-pointer uppercase`}>
                            <option value="ALL">Toda la Institución (Docentes y Estudiantes)</option>
                            <option value="TEACHERS">Solo Plantel Docente</option>
                            <option value="STUDENTS">Solo Estudiantes / Padres de Familia</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-uecg-black font-black text-xs z-0">▼</div>
                    </div>
                    <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-widest">
                        Solo los roles seleccionados recibirán la notificación.
                    </p>
                </div>

                <div>
                    <label className={labelClass}>Cuerpo del Mensaje</label>
                    <textarea
                        name="content"
                        rows={5}
                        placeholder="Escriba los detalles del comunicado aquí..."
                        required
                        className={`${inputClass} resize-none`}
                    />
                </div>

                <div className="flex items-center gap-3 bg-red-50 p-4 border-2 border-red-200">
                    <input
                        type="checkbox"
                        id="isImportant"
                        name="isImportant"
                        value="true"
                        className="w-5 h-5 accent-red-600 cursor-pointer"
                    />
                    <label htmlFor="isImportant" className="text-xs font-black uppercase tracking-widest text-red-700 cursor-pointer">
                        Marcar como Urgente / Importante
                    </label>
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
                        {isPending ? "Publicando..." : "Publicar y Notificar"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}