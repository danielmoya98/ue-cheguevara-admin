import { studentService } from "@/features/students/services/student.service";
import Link from "next/link";
import { ChevronLeft, UserCircle, AlertTriangle, Phone, MapPin, Edit } from "lucide-react";

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Obtener los datos completos del estudiante
    const profile = await studentService.getStudentById(id);

    if (!profile) {
        return (
            <div className="p-12 text-center border-2 border-dashed border-red-300 bg-red-50">
                <span className="font-black uppercase tracking-widest text-sm text-red-600 block">Expediente No Encontrado</span>
                <Link href="/admin/students" className="mt-4 inline-block text-xs font-bold text-uecg-blue hover:underline">
                    Volver al Directorio
                </Link>
            </div>
        );
    }

    // Calculamos la edad actual
    const age = new Date().getFullYear() - profile.birthDate.getFullYear();
    // Identificamos la matrícula activa
    const activeEnrollment = profile.enrollments.find(e => e.status === "ACTIVE" && e.academicYear === new Date().getFullYear());

    return (
        <div className="space-y-8 relative max-w-5xl mx-auto animate-in fade-in duration-300">

            {/* Header del Expediente */}
            <div className="flex flex-col md:flex-row justify-between items-start border-b-4 border-uecg-black pb-6">
                <div>
                    <Link
                        href="/admin/students"
                        className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-uecg-gray hover:text-uecg-blue mb-4 transition-colors"
                    >
                        <ChevronLeft size={14} strokeWidth={3} />
                        Volver al Directorio
                    </Link>

                    <div className="flex items-end gap-6">
                        <div className="w-24 h-24 bg-gray-100 text-uecg-gray flex items-center justify-center border-4 border-uecg-black">
                            <UserCircle size={64} strokeWidth={1} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-uecg-black uppercase tracking-tighter leading-none mb-1">
                                {profile.user.name}
                            </h1>
                            <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-uecg-gray mt-2">
                                <span className="bg-gray-100 px-2 py-1 border border-gray-200">CI: {profile.documentId}</span>
                                <span className="bg-gray-100 px-2 py-1 border border-gray-200">ID: #{profile.id.slice(0, 8)}</span>
                                <span className="bg-gray-100 px-2 py-1 border border-gray-200">{profile.user.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estado Académico Actual (Arriba a la derecha) */}
                <div className="mt-6 md:mt-0 text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-uecg-gray block mb-1">Estado {new Date().getFullYear()}</span>
                    {activeEnrollment ? (
                        <div className="inline-block border-4 border-uecg-blue bg-blue-50 p-3 text-left">
                            <span className="block text-xl font-black uppercase text-uecg-blue leading-none mb-1">
                                {activeEnrollment.classroom.grade.name} {activeEnrollment.classroom.name}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-uecg-black">
                                Turno {activeEnrollment.classroom.shift}
                            </span>
                        </div>
                    ) : (
                        <div className="inline-block border-4 border-orange-500 bg-orange-50 p-3">
                            <span className="block text-xl font-black uppercase text-orange-600 leading-none">NO MATRICULADO</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Grid de Información (Ficha Kárdex) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Columna Izquierda: Datos Personales y Médicos */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Sección: Datos Biográficos */}
                    <section className="bg-white border-2 border-uecg-line relative">
                        <div className="bg-uecg-black text-white px-4 py-2 flex justify-between items-center">
                            <h2 className="text-sm font-black uppercase tracking-widest">Datos Biográficos</h2>
                            {/* Futuro: Link para editar */}
                            <button className="text-gray-300 hover:text-white transition-colors" title="Editar Perfil">
                                <Edit size={14} strokeWidth={2.5} />
                            </button>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-8">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-uecg-gray block mb-1">Fecha de Nacimiento</label>
                                <span className="text-sm font-bold uppercase text-uecg-black">
                                    {profile.birthDate.toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    <span className="text-uecg-blue ml-2">({age} años)</span>
                                </span>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-uecg-gray block mb-1">Género</label>
                                <span className="text-sm font-bold uppercase text-uecg-black">{profile.gender}</span>
                            </div>
                            <div className="col-span-2 flex items-start gap-2">
                                <MapPin size={16} className="text-uecg-blue mt-0.5 shrink-0" />
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-uecg-gray block mb-1">Dirección Domiciliaria</label>
                                    <span className="text-sm font-bold uppercase text-uecg-black">{profile.address}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección: Ficha Médica */}
                    <section className={`bg-white border-2 relative ${profile.allergies || profile.medicalNotes ? 'border-red-200' : 'border-uecg-line'}`}>
                        <div className={`${profile.allergies || profile.medicalNotes ? 'bg-red-50 text-red-600 border-b-2 border-red-200' : 'bg-gray-100 text-uecg-black border-b-2 border-uecg-line'} px-4 py-2 flex items-center gap-2`}>
                            {profile.allergies || profile.medicalNotes ? <AlertTriangle size={16} strokeWidth={2.5} /> : null}
                            <h2 className="text-sm font-black uppercase tracking-widest">Información Médica</h2>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-8">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-uecg-gray block mb-1">Tipo de Sangre</label>
                                <span className={`text-sm font-bold uppercase ${profile.bloodType ? 'text-red-600' : 'text-uecg-black'}`}>
                                    {profile.bloodType || "NO ESPECIFICADO"}
                                </span>
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-uecg-gray block mb-1">Alergias</label>
                                <span className={`text-sm font-bold uppercase ${profile.allergies ? 'text-red-600 font-black' : 'text-uecg-black'}`}>
                                    {profile.allergies || "NINGUNA CONOCIDA"}
                                </span>
                            </div>
                            {profile.medicalNotes && (
                                <div className="col-span-2 bg-red-50 p-4 border-l-4 border-red-500">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-red-500 block mb-1">Notas Especiales</label>
                                    <p className="text-sm font-bold text-red-900 uppercase leading-snug">{profile.medicalNotes}</p>
                                </div>
                            )}
                        </div>
                    </section>

                </div>

                {/* Columna Derecha: Tutor e Historial */}
                <div className="space-y-8">

                    {/* Sección: Tutor / Emergencia */}
                    <section className="bg-uecg-blue text-white border-4 border-uecg-black relative">
                        <div className="px-4 py-3 border-b-2 border-blue-800 flex items-center gap-2 bg-black/20">
                            <Phone size={16} strokeWidth={2.5} />
                            <h2 className="text-sm font-black uppercase tracking-widest">Contacto de Emergencia</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-blue-200 block mb-1">Nombre del Tutor</label>
                                <span className="text-lg font-black uppercase">{profile.guardianName}</span>
                                <span className="text-[10px] bg-white text-uecg-blue px-2 py-0.5 font-black uppercase tracking-widest ml-2 align-middle">
                                    {profile.guardianRelation}
                                </span>
                            </div>
                            <div className="pt-2 border-t border-blue-800">
                                <label className="text-[10px] font-black uppercase tracking-widest text-blue-200 block mb-1">Teléfono</label>
                                <span className="text-xl font-mono font-bold tracking-widest">{profile.guardianPhone}</span>
                            </div>
                            {profile.guardianEmail && (
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-blue-200 block mb-1">Correo Electrónico</label>
                                    <span className="text-xs font-mono font-bold">{profile.guardianEmail}</span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Sección: Historial Académico */}
                    <section className="bg-white border-2 border-uecg-line">
                        <div className="bg-gray-100 text-uecg-black px-4 py-2 border-b-2 border-uecg-line">
                            <h2 className="text-sm font-black uppercase tracking-widest">Historial de Matrículas</h2>
                        </div>
                        <div className="p-0">
                            {profile.enrollments.length === 0 ? (
                                <p className="text-xs text-uecg-gray font-bold p-6 text-center italic">Sin registros académicos.</p>
                            ) : (
                                <ul className="divide-y divide-uecg-line">
                                    {profile.enrollments.map(enrollment => (
                                        <li key={enrollment.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                                            <div>
                                                <span className="block text-sm font-black uppercase text-uecg-black">
                                                    Gestión {enrollment.academicYear}
                                                </span>
                                                <span className="text-[10px] font-bold text-uecg-gray uppercase tracking-widest mt-0.5 block">
                                                    {enrollment.classroom.grade.name} "{enrollment.classroom.name}"
                                                </span>
                                            </div>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 border ${enrollment.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-uecg-gray border-gray-300'}`}>
                                                {enrollment.status === 'ACTIVE' ? 'Activo' : 'Histórico'}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>
                </div>

            </div>
        </div>
    );
}