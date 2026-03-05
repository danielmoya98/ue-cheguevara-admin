"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Modal from "@/shared/components/modal";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { saveSubjectAction } from "../actions/subject.action";
import { Subject } from "@/app/generated/prisma/client"; // Importamos el tipo real de Prisma

const initialState = { success: false, message: "" };

export default function SubjectFormModal({ subjects }: { subjects: Subject[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const mode = searchParams.get("action");
    const subjectId = searchParams.get("id");

    // Identificamos si este modal debe abrirse
    const isOpen = mode === "create-subject" || mode === "edit-subject";

    // Pre-carga de datos si estamos editando
    const currentSubject = subjectId ? subjects.find((s) => s.id === subjectId) : null;

    const [state, action, isPending] = useActionState(saveSubjectAction, initialState);

    const handleClose = () => router.push("/admin/academic", { scroll: false });

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

    const labelClass = "text-xs font-black uppercase tracking-[0.15em] text-uecg-black mb-2 block";
    const inputClass = "w-full border-2 border-gray-300 bg-white p-3 font-bold text-uecg-black placeholder:text-gray-400 focus:border-uecg-blue outline-none transition-colors text-sm";

    return (
        <Modal
            title={mode === "create-subject" ? "Nueva Materia" : "Editar Materia"}
            isOpen={isOpen}
            onClose={handleClose}
        >
            <form action={action} className="space-y-6" key={currentSubject?.id || "new"}>
                {subjectId && <input type="hidden" name="id" value={subjectId} />}

                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                        <label className={labelClass}>Código</label>
                        <input
                            name="code"
                            placeholder="EJ: MAT-01"
                            className={`${inputClass} uppercase`}
                            required
                            defaultValue={currentSubject?.code || ""}
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className={labelClass}>Horas / Semana</label>
                        <input
                            name="weeklyHours"
                            type="number"
                            min="1"
                            max="40"
                            placeholder="Ej: 4"
                            className={inputClass}
                            required
                            defaultValue={currentSubject?.weeklyHours || 4}
                        />
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Nombre de la Materia</label>
                    <input
                        name="name"
                        placeholder="EJ: MATEMÁTICAS AVANZADAS"
                        className={inputClass}
                        required
                        defaultValue={currentSubject?.name || ""}
                    />
                </div>

                <div className="flex items-center gap-6 p-4 border-2 border-gray-100 bg-gray-50">
                    <div className="flex-1">
                        <label className={labelClass}>Color de Identificación</label>
                        <p className="text-[10px] text-uecg-gray uppercase font-bold">Para el horario visual</p>
                    </div>
                    <input
                        name="color"
                        type="color"
                        className="w-14 h-14 border-2 border-uecg-black cursor-pointer p-0 appearance-none bg-transparent"
                        defaultValue={currentSubject?.color || "#000089"}
                    />
                </div>

                {/* Status Switch (Checkbox oculto estilizado) */}
                <label className="flex items-center justify-between p-4 border-2 border-gray-200 cursor-pointer hover:border-uecg-blue transition-colors group">
                    <div>
                        <span className="text-sm font-black uppercase tracking-widest text-uecg-black block">Materia Activa</span>
                        <span className="text-[10px] text-uecg-gray uppercase font-bold">Disponible para asignar a cursos</span>
                    </div>
                    <div className="relative">
                        <input
                            type="checkbox"
                            name="isActive"
                            className="peer sr-only"
                            defaultChecked={currentSubject ? currentSubject.isActive : true}
                        />
                        {/* Custom Swiss Switch */}
                        <div className="w-12 h-6 border-2 border-gray-300 bg-gray-100 peer-checked:bg-uecg-blue peer-checked:border-uecg-blue transition-colors relative">
                            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white transition-all peer-checked:translate-x-6 border border-gray-200 peer-checked:border-transparent"></div>
                        </div>
                    </div>
                </label>

                <div className="flex gap-4 pt-6 border-t-2 border-uecg-line mt-8">
                    <button type="button" onClick={handleClose} className="flex-1 py-4 border-2 border-gray-300 text-xs font-black uppercase tracking-widest text-gray-500 hover:border-uecg-black hover:text-uecg-black transition-all">
                        Cancelar
                    </button>
                    <button type="submit" disabled={isPending} className="flex-1 py-4 bg-uecg-blue border-2 border-uecg-blue text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-uecg-blue transition-all disabled:opacity-50">
                        {isPending ? "Guardando..." : "Guardar Materia"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}