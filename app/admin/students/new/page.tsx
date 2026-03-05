import { studentService } from "@/features/students/services/student.service";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";
import StudentProfileForm from "@/features/students/components/student-profile-form";

export default async function NewStudentPage() {
    // 1. Obtener la lista de usuarios que necesitan perfil
    const orphanUsers = await studentService.getOrphanStudents();

    return (
        <div className="space-y-6 relative max-w-4xl mx-auto">

            {/* Header */}
            <div className="border-b-4 border-uecg-black pb-6">
                <Link
                    href="/admin/students"
                    className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-uecg-gray hover:text-uecg-blue mb-4 transition-colors"
                >
                    <ChevronLeft size={14} strokeWidth={3} />
                    Volver al Directorio
                </Link>

                <div>
                    <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter leading-none">
                        Nuevo Expediente
                    </h1>
                    <p className="text-uecg-gray font-bold text-xs uppercase tracking-widest mt-2">
                        Registro de información personal, médica y de tutores.
                    </p>
                </div>
            </div>

            {/* Si no hay usuarios disponibles, mostramos un mensaje */}
            {orphanUsers.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-gray-300 bg-gray-50">
                    <span className="font-black uppercase tracking-widest text-sm text-uecg-black block mb-2">
                        No hay cuentas pendientes
                    </span>
                    <span className="text-xs text-uecg-gray">
                        Primero debes crear un Usuario con rol "Estudiante" desde la sección de Gestión de Usuarios.
                    </span>
                    <Link
                        href="/admin/users?action=create"
                        className="mt-4 inline-block px-6 py-3 bg-uecg-blue text-white text-[10px] font-black uppercase tracking-widest"
                    >
                        Crear Cuenta Base
                    </Link>
                </div>
            ) : (
                /* El Formulario Interactivo */
                <StudentProfileForm availableUsers={orphanUsers} />
            )}

        </div>
    );
}