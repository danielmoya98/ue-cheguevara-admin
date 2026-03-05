"use client";

import Link from "next/link";
import { UserPlus, UserCircle, Search, FileText } from "lucide-react";

interface StudentTableProps {
    students: any[]; // Usaremos el tipo inferido de Prisma luego
}

export default function StudentTable({ students }: StudentTableProps) {
    return (
        <div className="w-full overflow-x-auto border border-uecg-line bg-white">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-gray-50 border-b border-uecg-line">
                    <th className="p-4 text-xs font-black uppercase tracking-[0.15em] text-uecg-blue w-20">CI / Doc</th>
                    <th className="p-4 text-xs font-black uppercase tracking-[0.15em] text-uecg-blue">Estudiante</th>
                    <th className="p-4 text-xs font-black uppercase tracking-[0.15em] text-uecg-blue">Curso Actual</th>
                    <th className="p-4 text-xs font-black uppercase tracking-[0.15em] text-uecg-blue">Tutor</th>
                    <th className="p-4 text-xs font-black uppercase tracking-[0.15em] text-uecg-blue text-right">Acciones</th>
                </tr>
                </thead>

                <tbody className="divide-y divide-uecg-line">
                {students.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="p-12 text-center">
                            <div className="flex flex-col items-center justify-center text-uecg-gray">
                                <div className="bg-gray-100 p-4 rounded-full mb-3">
                                    <Search size={32} strokeWidth={1.5} className="text-gray-400" />
                                </div>
                                <span className="font-black uppercase tracking-widest text-sm text-uecg-black">No hay estudiantes</span>
                                <span className="text-xs mt-1">Intenta buscar otro nombre o verifica que tengan el perfil creado.</span>
                            </div>
                        </td>
                    </tr>
                ) : (
                    students.map((student) => {
                        // Obtenemos la inscripción activa de este año (si existe)
                        const activeEnrollment = student.enrollments?.[0];
                        const classroom = activeEnrollment?.classroom;

                        return (
                            <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="p-4 font-mono text-xs text-uecg-gray font-bold">
                                    {student.documentId}
                                </td>

                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gray-100 p-2 text-uecg-gray">
                                            <UserCircle size={24} strokeWidth={1.5} />
                                        </div>
                                        <div className="flex flex-col">
                                                <span className="font-bold text-uecg-black uppercase text-sm leading-tight">
                                                    {student.user.name}
                                                </span>
                                            <span className="text-[10px] text-uecg-gray font-mono">
                                                    {student.user.email}
                                                </span>
                                        </div>
                                    </div>
                                </td>

                                <td className="p-4">
                                    {classroom ? (
                                        <div className="flex flex-col">
                                                <span className="bg-uecg-blue text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wide inline-block w-max">
                                                    {classroom.name} - {classroom.grade.name} {classroom.grade.level.slice(0,3)}
                                                </span>
                                            <span className="text-[9px] text-uecg-gray font-bold uppercase tracking-widest mt-1">
                                                    Turno {classroom.shift}
                                                </span>
                                        </div>
                                    ) : (
                                        <span className="bg-orange-100 text-orange-800 border border-orange-200 px-2 py-1 text-[10px] font-bold uppercase tracking-wide">
                                                SIN MATRÍCULA
                                            </span>
                                    )}
                                </td>

                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-uecg-black uppercase">{student.guardianName}</span>
                                        <span className="text-[10px] text-uecg-gray uppercase tracking-widest font-mono">{student.guardianPhone}</span>
                                    </div>
                                </td>

                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {/* Botón para Matricular (Abrirá un modal) */}
                                        <Link
                                            href={`/admin/students?action=enroll&id=${student.id}`}
                                            scroll={false}
                                            className="p-2 text-uecg-blue bg-blue-50 hover:bg-uecg-blue hover:text-white transition-colors border border-blue-100 hover:border-uecg-blue"
                                            title="Matricular a un Curso"
                                        >
                                            <UserPlus size={16} strokeWidth={2.5} />
                                        </Link>

                                        {/* Botón para ver el Expediente (Perfil completo) */}
                                        <Link
                                            href={`/admin/students/${student.id}`}
                                            className="p-2 text-uecg-black bg-gray-100 hover:bg-uecg-black hover:text-white transition-colors border border-gray-200 hover:border-uecg-black"
                                            title="Ver Expediente"
                                        >
                                            <FileText size={16} strokeWidth={2.5} />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>
        </div>
    );
}