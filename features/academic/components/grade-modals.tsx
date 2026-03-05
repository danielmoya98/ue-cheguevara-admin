"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Modal from "@/shared/components/modal";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { createGradeAction, createClassroomAction, deleteClassroomAction } from "../actions/grade.action";
import { AlertTriangle } from "lucide-react";

const initialState = { success: false, message: "" };

export default function GradeModals() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const action = searchParams.get("action");

    // Parámetros útiles
    const gradeId = searchParams.get("gradeId");
    const gradeName = searchParams.get("gradeName");
    const classroomId = searchParams.get("id");

    const handleClose = () => router.push("/admin/academic/grades", { scroll: false });

    // --- STATES PARA ACTIONS ---
    const [gradeState, formActionGrade, isPendingGrade] = useActionState(createGradeAction, initialState);
    const [classState, formActionClass, isPendingClass] = useActionState(createClassroomAction, initialState);

    // Efecto general para Toasts
    useEffect(() => {
        const state = action === 'create-grade' ? gradeState : action === 'create-classroom' ? classState : null;
        if (state && state.message) {
            if (state.success) {
                toast.success(state.message);
                handleClose();
            } else {
                toast.error(state.message);
            }
        }
    }, [gradeState, classState, action]);

    // Función manual para borrar (no usa formulario)
    const handleDeleteClassroom = async () => {
        if (!classroomId) return;
        const result = await deleteClassroomAction(classroomId);
        if (result.success) {
            toast.success(result.message);
            handleClose();
        } else {
            toast.error(result.message || "Error al eliminar");
        }
    };

    const labelClass = "text-xs font-black uppercase tracking-[0.15em] text-uecg-black mb-2 block";
    const inputClass = "w-full border-2 border-gray-300 bg-white p-3 font-bold text-uecg-black placeholder:text-gray-400 focus:border-uecg-blue outline-none transition-colors text-sm";
    const selectWrapperClass = "relative border-2 border-gray-300 bg-white focus-within:border-uecg-blue transition-colors";

    return (
        <>
            {/* MODAL: CREAR GRADO */}
            <Modal title="Nuevo Grado" isOpen={action === "create-grade"} onClose={handleClose}>
                <form action={formActionGrade} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className={labelClass}>Nombre del Grado</label>
                            <input name="name" placeholder="Ej: Primero" className={inputClass} required />
                        </div>
                        <div>
                            <label className={labelClass}>Orden Numérico</label>
                            <input name="numericOrder" type="number" min="1" max="12" placeholder="Ej: 1" className={inputClass} required />
                            <p className="text-[9px] font-bold text-uecg-gray uppercase mt-1">Para ordenar la vista</p>
                        </div>
                        <div>
                            <label className={labelClass}>Nivel</label>
                            <div className={selectWrapperClass}>
                                <select name="level" className="w-full p-3 font-bold text-uecg-black bg-transparent outline-none appearance-none cursor-pointer z-10 relative text-sm">
                                    <option value="PRIMARIA">PRIMARIA</option>
                                    <option value="SECUNDARIA">SECUNDARIA</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-uecg-black font-black text-xs">▼</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 pt-6 border-t-2 border-uecg-line mt-8">
                        <button type="button" onClick={handleClose} className="flex-1 py-4 border-2 border-gray-300 text-xs font-black uppercase tracking-widest text-gray-500 hover:border-uecg-black hover:text-uecg-black transition-all">Cancelar</button>
                        <button type="submit" disabled={isPendingGrade} className="flex-1 py-4 bg-uecg-blue text-white text-xs font-black uppercase tracking-widest hover:bg-uecg-dark transition-all disabled:opacity-50">Guardar</button>
                    </div>
                </form>
            </Modal>

            {/* MODAL: AÑADIR PARALELO */}
            <Modal title={`Añadir Paralelo a ${gradeName || ''}`} isOpen={action === "create-classroom"} onClose={handleClose}>
                <form action={formActionClass} className="space-y-6">
                    {gradeId && <input type="hidden" name="gradeId" value={gradeId} />}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Identificador</label>
                            <input name="name" placeholder="Ej: A" maxLength={2} className={`${inputClass} uppercase`} required />
                        </div>
                        <div>
                            <label className={labelClass}>Capacidad</label>
                            <input name="capacity" type="number" defaultValue="30" min="1" max="50" className={inputClass} required />
                        </div>
                        <div className="col-span-2">
                            <label className={labelClass}>Turno</label>
                            <div className={selectWrapperClass}>
                                <select name="shift" className="w-full p-3 font-bold text-uecg-black bg-transparent outline-none appearance-none cursor-pointer z-10 relative text-sm">
                                    <option value="MAÑANA">MAÑANA</option>
                                    <option value="TARDE">TARDE</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-uecg-black font-black text-xs">▼</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 pt-6 border-t-2 border-uecg-line mt-8">
                        <button type="button" onClick={handleClose} className="flex-1 py-4 border-2 border-gray-300 text-xs font-black uppercase tracking-widest text-gray-500 hover:border-uecg-black transition-all">Cancelar</button>
                        <button type="submit" disabled={isPendingClass} className="flex-1 py-4 bg-uecg-blue text-white text-xs font-black uppercase tracking-widest hover:bg-uecg-dark transition-all disabled:opacity-50">Añadir</button>
                    </div>
                </form>
            </Modal>

            {/* MODAL: ELIMINAR PARALELO */}
            <Modal title="Eliminar Paralelo" isOpen={action === "delete-classroom"} onClose={handleClose}>
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="h-16 w-16 bg-red-50 flex items-center justify-center text-red-600 border-2 border-red-200">
                        <AlertTriangle size={32} strokeWidth={2} />
                    </div>
                    <div>
                        <p className="text-uecg-black font-black uppercase tracking-widest text-lg">¿Borrar Paralelo?</p>
                        <p className="text-uecg-gray text-xs mt-2 font-bold uppercase">Esta acción eliminará el aula.</p>
                    </div>
                    <div className="flex gap-4 w-full pt-4">
                        <button onClick={handleClose} className="flex-1 py-4 border-2 border-uecg-line text-xs font-black uppercase tracking-widest text-uecg-gray hover:border-uecg-black transition-colors">Cancelar</button>
                        <button onClick={handleDeleteClassroom} className="flex-1 py-4 bg-red-600 text-white text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-colors border-2 border-red-600">Sí, Eliminar</button>
                    </div>
                </div>
            </Modal>
        </>
    );
}