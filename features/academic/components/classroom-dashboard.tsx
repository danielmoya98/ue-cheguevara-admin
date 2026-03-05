"use client";

import { Plus, Trash2, BookOpen, UserCircle } from "lucide-react";
import Link from "next/link";

interface ClassroomDashboardProps {
    classroomId: string;
    courses: any[];
}

export default function ClassroomDashboard({ classroomId, courses }: ClassroomDashboardProps) {
    const totalHours = courses.reduce((acc, course) => acc + course.subject.weeklyHours, 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Barra de Herramientas */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 border border-uecg-line">
                <div className="flex items-center gap-4">
                    <div className="bg-uecg-black text-white p-3">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-uecg-black">Malla Curricular Activa</h3>
                        <p className="text-[10px] font-bold text-uecg-gray uppercase tracking-widest">
                            {courses.length} Asignaturas • {totalHours} Horas Totales
                        </p>
                    </div>
                </div>

                <Link
                    href={`/admin/academic/classrooms/${classroomId}?action=assign`}
                    scroll={false}
                    className="flex items-center gap-2 px-6 py-3 bg-uecg-blue text-white font-black uppercase text-xs tracking-widest hover:bg-uecg-dark transition-colors border-2 border-uecg-blue"
                >
                    <Plus size={16} strokeWidth={3} />
                    Asignar Materia
                </Link>
            </div>

            {/* Grilla de Asignaturas */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {courses.length === 0 && (
                    <div className="col-span-full p-12 text-center border-2 border-dashed border-gray-300 bg-white">
                        <span className="font-black uppercase tracking-widest text-sm text-uecg-gray">La malla curricular está vacía</span>
                    </div>
                )}

                {courses.map((course) => (
                    <div key={course.id} className="bg-white border-2 border-uecg-line flex flex-col relative group hover:border-uecg-black transition-colors">

                        {/* Indicador de Color de la Materia */}
                        <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: course.subject.color }} />

                        {/* Info de la Materia */}
                        <div className="p-4 pl-6 border-b-2 border-uecg-line flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-mono font-bold text-uecg-black bg-gray-100 px-2 py-1 mb-2 inline-block">
                                    {course.subject.code}
                                </span>
                                <h4 className="text-base font-black uppercase text-uecg-black leading-tight">
                                    {course.subject.name}
                                </h4>
                                <span className="text-xs text-uecg-gray font-bold uppercase mt-1 block">
                                    {course.subject.weeklyHours} Hrs / Semana
                                </span>
                            </div>

                            {/* Botón Quitar (Hover) */}
                            <Link
                                href={`/admin/academic/classrooms/${classroomId}?action=remove&courseId=${course.id}`}
                                scroll={false}
                                className="text-red-500 bg-red-50 p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                            >
                                <Trash2 size={16} strokeWidth={2.5} />
                            </Link>
                        </div>

                        {/* Info del Docente */}
                        <div className="p-3 pl-6 bg-gray-50 flex items-center gap-3">
                            <UserCircle size={24} className={course.teacher ? "text-uecg-blue" : "text-gray-400"} />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-uecg-gray">Docente Asignado</span>
                                <span className={`text-sm font-bold uppercase ${course.teacher ? "text-uecg-black" : "text-red-500 italic"}`}>
                                    {course.teacher ? course.teacher.name : "Por asignar"}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}