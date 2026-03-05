"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createStudentProfileAction } from "../actions/student.action";
import { Save } from "lucide-react";

const initialState = { success: false, message: "" };

interface Props {
    availableUsers: { id: string, name: string, email: string }[];
}

export default function StudentProfileForm({ availableUsers }: Props) {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(createStudentProfileAction, initialState);

    useEffect(() => {
        if (state && state.message) {
            if (state.success) {
                toast.success(state.message);
                router.push("/admin/students");
                router.refresh();
            } else {
                toast.error(state.message);
            }
        }
    }, [state]);

    const sectionTitleClass = "text-xl font-black uppercase tracking-widest text-uecg-blue border-b-2 border-uecg-line pb-2 mb-6";
    const labelClass = "text-[10px] font-black uppercase tracking-[0.15em] text-uecg-gray mb-2 block";
    const inputClass = "w-full border-2 border-gray-300 bg-white p-3 font-bold text-uecg-black placeholder:text-gray-400 focus:border-uecg-blue outline-none transition-colors text-sm uppercase";
    const selectWrapperClass = "relative border-2 border-gray-300 bg-white focus-within:border-uecg-blue transition-colors";

    return (
        <form action={formAction} className="space-y-12 bg-white p-8 border border-uecg-line shadow-sm">

            {/* 1. SELECCIÓN DE CUENTA BASE */}
            <section className="bg-gray-50 p-6 border-l-4 border-uecg-black">
                <label className="text-sm font-black uppercase tracking-[0.15em] text-uecg-black mb-2 block">
                    Vincular a Cuenta de Usuario Existente
                </label>
                <div className={selectWrapperClass}>
                    <select name="userId" className="w-full p-4 font-black text-uecg-blue bg-transparent outline-none appearance-none cursor-pointer z-10 relative text-sm" required defaultValue="">
                        <option value="" disabled>Seleccione una cuenta "Huérfana"...</option>
                        {availableUsers.map(u => (
                            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-uecg-black font-black text-xs">▼</div>
                </div>
            </section>

            {/* 2. DATOS PERSONALES */}
            <section>
                <h2 className={sectionTitleClass}>I. Datos Personales</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Documento de Identidad (CI)</label>
                        <input name="documentId" className={inputClass} placeholder="EJ: 1234567" required />
                    </div>
                    <div>
                        <label className={labelClass}>Fecha de Nacimiento</label>
                        <input name="birthDate" type="date" className={inputClass} required />
                    </div>
                    <div>
                        <label className={labelClass}>Género Biológico</label>
                        <div className={selectWrapperClass}>
                            <select name="gender" className="w-full p-3 font-bold text-uecg-black bg-transparent outline-none appearance-none cursor-pointer z-10 relative text-sm" required defaultValue="">
                                <option value="" disabled>Seleccionar...</option>
                                <option value="MASCULINO">MASCULINO</option>
                                <option value="FEMENINO">FEMENINO</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-uecg-black text-[10px]">▼</div>
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Dirección Domiciliaria</label>
                        <input name="address" className={inputClass} placeholder="EJ: AV. LAS AMÉRICAS #123" required />
                    </div>
                </div>
            </section>

            {/* 3. DATOS MÉDICOS */}
            <section>
                <h2 className={sectionTitleClass}>II. Ficha Médica</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Tipo de Sangre (Opcional)</label>
                        <input name="bloodType" className={inputClass} placeholder="EJ: O+" />
                    </div>
                    <div>
                        <label className={labelClass}>Alergias Conocidas (Opcional)</label>
                        <input name="allergies" className={inputClass} placeholder="EJ: PENICILINA, POLEN" />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className={labelClass}>Notas Médicas o Condiciones Especiales</label>
                        <textarea name="medicalNotes" rows={3} className={inputClass} placeholder="Observaciones relevantes para el cuerpo docente o enfermería..." />
                    </div>
                </div>
            </section>

            {/* 4. TUTOR / EMERGENCIA */}
            <section>
                <h2 className={sectionTitleClass}>III. Contacto de Emergencia / Tutor</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Nombre Completo del Tutor</label>
                        <input name="guardianName" className={inputClass} placeholder="EJ: ROBERTO PEREZ" required />
                    </div>
                    <div>
                        <label className={labelClass}>Relación / Parentesco</label>
                        <input name="guardianRelation" className={inputClass} placeholder="EJ: PADRE" required />
                    </div>
                    <div>
                        <label className={labelClass}>Teléfono de Contacto</label>
                        <input name="guardianPhone" className={inputClass} placeholder="EJ: 77123456" required />
                    </div>
                    <div>
                        <label className={labelClass}>Correo del Tutor (Opcional)</label>
                        <input name="guardianEmail" type="email" className={`${inputClass} lowercase`} placeholder="ejemplo@correo.com" />
                    </div>
                </div>
            </section>

            {/* ACTION FOOTER */}
            <div className="pt-6 border-t-4 border-uecg-black flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-3 px-8 py-4 bg-uecg-black text-white font-black uppercase tracking-widest text-sm hover:bg-uecg-blue transition-colors disabled:opacity-50 border-2 border-uecg-black"
                >
                    <Save size={18} strokeWidth={2.5} />
                    {isPending ? "Registrando..." : "Guardar Expediente Completo"}
                </button>
            </div>
        </form>
    );
}