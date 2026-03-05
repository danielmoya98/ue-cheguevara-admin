"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Modal from "@/shared/components/modal";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { enrollStudentAction } from "../actions/student.action";

const initialState = { success: false, message: "" };

interface EnrollmentModalProps {
    classrooms: any[]; // La lista de paralelos agrupados
}

export default function EnrollmentModal({ classrooms }: EnrollmentModalProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const studentId = searchParams.get("id");
    const isOpen = searchParams.get("action") === "enroll" && !!studentId;

    const [state, formAction, isPending] = useActionState(enrollStudentAction, initialState);

    const handleClose = () => router.push("/admin/students", { scroll: false });

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
    const selectWrapperClass = "relative border-2 border-gray-300 bg-white focus-within:border-uecg-blue transition-colors";

    // Año actual por defecto
    const currentYear = new Date().getFullYear();

    return (
        <Modal title="Matricular Estudiante" isOpen={isOpen} onClose={handleClose}>
            <form action={formAction} className="space-y-6">
                <input type="hidden" name="studentId" value={studentId || ""} />

                <div className="bg-blue-50 border-l-4 border-uecg-blue p-4 mb-6">
                    <p className="text-sm font-bold text-uecg-black">Gestión {currentYear}</p>
                    <p className="text-xs text-uecg-gray mt-1">Al matricular, el estudiante será asignado a la malla curricular de esta aula inmediatamente.</p>
                </div>

                <div>
                    <label className={labelClass}>Seleccionar Curso (Aula)</label>
                    <div className={selectWrapperClass}>
                        <select name="classroomId" className="w-full p-3 font-bold text-uecg-black bg-transparent outline-none appearance-none cursor-pointer z-10 relative text-sm" required defaultValue="">
                            <option value="" disabled>Elige el paralelo correspondiente...</option>

                            {/* Agrupamos por Nivel y Grado para que sea fácil de encontrar */}
                            {classrooms.map((grade) => (
                                <optgroup key={grade.id} label={`${grade.name} de ${grade.level}`}>
                                    {grade.classrooms.map((classroom: any) => (
                                        <option key={classroom.id} value={classroom.id}>
                                            Paralelo {classroom.name} (Turno {classroom.shift})
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-uecg-black font-black text-xs">▼</div>
                    </div>
                </div>

                {/* Campo oculto para el año académico */}
                <input type="hidden" name="academicYear" value={currentYear} />

                <div className="flex gap-4 pt-6 border-t-2 border-uecg-line mt-8">
                    <button type="button" onClick={handleClose} className="flex-1 py-4 border-2 border-gray-300 text-xs font-black uppercase tracking-widest text-gray-500 hover:border-uecg-black hover:text-uecg-black transition-all">Cancelar</button>
                    <button type="submit" disabled={isPending} className="flex-1 py-4 bg-uecg-blue text-white text-xs font-black uppercase tracking-widest hover:bg-uecg-dark transition-all disabled:opacity-50 border-2 border-uecg-blue">
                        {isPending ? "Procesando..." : "Confirmar Matrícula"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}