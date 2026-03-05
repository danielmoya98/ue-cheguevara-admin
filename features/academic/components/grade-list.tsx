"use client";

import { Grade, Classroom } from "@/app/generated/prisma/client";
import { Plus, Trash2, Users } from "lucide-react";
import Link from "next/link";

// Extendemos el tipo Grade para incluir los classrooms que devuelve Prisma
type GradeWithClassrooms = Grade & { classrooms: Classroom[] };

interface GradeListProps {
    grades: GradeWithClassrooms[];
}

export default function GradeList({ grades }: GradeListProps) {
    // Agrupamos por nivel para la vista
    const primariaGrades = grades.filter(g => g.level === "PRIMARIA");
    const secundariaGrades = grades.filter(g => g.level === "SECUNDARIA");

    const renderLevelSection = (title: string, levelGrades: GradeWithClassrooms[], colorClass: string) => (
        <div className="space-y-4">
            <h2 className={`text-xl font-black uppercase tracking-widest ${colorClass} border-b-2 border-uecg-line pb-2`}>
                {title}
            </h2>

            {levelGrades.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-gray-300 bg-gray-50">
                    <span className="font-black uppercase tracking-widest text-xs text-uecg-gray">No hay grados registrados</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {levelGrades.map(grade => (
                        <div key={grade.id} className="bg-white border-2 border-uecg-line hover:border-uecg-black transition-colors flex flex-col">
                            {/* Cabecera del Grado */}
                            <div className="p-4 bg-gray-50 border-b-2 border-uecg-line flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-black uppercase text-uecg-black leading-none">{grade.name}</h3>
                                    <span className="text-[10px] font-bold text-uecg-gray uppercase tracking-widest">Grado {grade.numericOrder}</span>
                                </div>
                                <div className="bg-white border-2 border-uecg-line px-2 py-1 flex items-center gap-1">
                                    <Users size={12} className="text-uecg-blue" />
                                    <span className="text-xs font-black">{grade.classrooms.length}</span>
                                </div>
                            </div>

                            {/* Lista de Paralelos */}
                            <div className="p-4 flex-1 flex flex-wrap gap-2 content-start">
                                {grade.classrooms.length === 0 ? (
                                    <p className="text-xs text-uecg-gray font-bold italic w-full text-center py-2">Sin paralelos</p>
                                ) : (
                                    grade.classrooms.map(classroom => (
                                        <div key={classroom.id} className="group relative bg-white border-2 border-uecg-line hover:border-uecg-blue transition-colors flex items-stretch">
                                            {/* ESTE LINK ES EL NUEVO: Nos lleva al dashboard del aula */}
                                            <Link
                                                href={`/admin/academic/classrooms/${classroom.id}`}
                                                className="px-3 py-2 flex items-center gap-2"
                                            >
                                                <span className="font-black text-sm text-uecg-black">{classroom.name}</span>
                                                <span className="text-[9px] font-bold text-uecg-gray uppercase tracking-widest">{classroom.shift.slice(0,3)}</span>
                                            </Link>

                                            {/* Botón borrar paralelo (aparece en hover) */}
                                            <Link
                                                href={`/admin/academic/grades?action=delete-classroom&id=${classroom.id}`}
                                                scroll={false}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                                            >
                                                <Trash2 size={10} strokeWidth={3} />
                                            </Link>
                                        </div>
                                    ))
                                )}
                            </div>
                            {/* Botón Añadir Paralelo */}
                            <div className="p-3 border-t-2 border-uecg-line bg-gray-50">
                                <Link
                                    href={`/admin/academic/grades?action=create-classroom&gradeId=${grade.id}&gradeName=${grade.name}`}
                                    scroll={false}
                                    className="w-full flex justify-center items-center gap-2 py-2 border-2 border-dashed border-gray-300 text-xs font-black uppercase tracking-widest text-uecg-gray hover:border-uecg-blue hover:text-uecg-blue transition-colors bg-white"
                                >
                                    <Plus size={14} strokeWidth={3} />
                                    Añadir Paralelo
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in duration-300">
            {/* Header Interno y Botón Crear Grado */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 border border-uecg-line">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-uecg-black">Estructura Escolar</h3>
                    <p className="text-[10px] font-bold text-uecg-gray uppercase tracking-widest">Organización de Grados y Aulas</p>
                </div>

                <Link
                    href="/admin/academic/grades?action=create-grade"
                    scroll={false}
                    className="flex items-center gap-2 px-6 py-3 bg-uecg-black text-white font-black uppercase text-xs tracking-widest hover:bg-uecg-blue transition-colors border-2 border-uecg-black hover:border-uecg-blue"
                >
                    <Plus size={16} strokeWidth={3} />
                    Nuevo Grado
                </Link>
            </div>

            {/* Renderizar Niveles */}
            {renderLevelSection("Nivel Primario", primariaGrades, "text-uecg-blue")}
            {renderLevelSection("Nivel Secundario", secundariaGrades, "text-uecg-black")}
        </div>
    );
}