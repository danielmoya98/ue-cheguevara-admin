"use client";

import { Subject } from "@/app/generated/prisma/client";
import { Plus, Edit, Trash2, Clock, BookOpen } from "lucide-react";
import Link from "next/link";

interface SubjectCatalogProps {
    subjects: Subject[];
}

export default function SubjectCatalog({ subjects }: SubjectCatalogProps) {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">

            {/* Header Interno y Buscador */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 border border-uecg-line">
                <div className="flex items-center gap-3">
                    <div className="bg-uecg-blue text-white p-2">
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-uecg-black">Catálogo Global</h3>
                        <p className="text-[10px] font-bold text-uecg-gray uppercase tracking-widest">{subjects.length} Materias Registradas</p>
                    </div>
                </div>

                <Link
                    href="/admin/academic?action=create-subject"
                    scroll={false}
                    className="flex items-center gap-2 px-6 py-3 bg-uecg-black text-white font-black uppercase text-xs tracking-widest hover:bg-uecg-blue transition-colors border-2 border-uecg-black hover:border-uecg-blue"
                >
                    <Plus size={16} strokeWidth={3} />
                    Nueva Materia
                </Link>
            </div>

            {/* Grid de Materias */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                {subjects.length === 0 && (
                    <div className="col-span-full p-12 text-center border-2 border-dashed border-gray-300 bg-gray-50">
                        <span className="font-black uppercase tracking-widest text-sm text-uecg-gray">No hay materias registradas</span>
                    </div>
                )}

                {subjects.map((subject) => (
                    <div
                        key={subject.id}
                        className={`group relative bg-white border-2 transition-all duration-300 flex flex-col justify-between h-40 overflow-hidden ${subject.isActive ? 'border-uecg-line hover:border-uecg-black' : 'border-dashed border-gray-300 opacity-60'}`}
                    >
                        {/* Franja de Color Dinámica */}
                        <div
                            className="absolute top-0 left-0 w-2 h-full"
                            style={{ backgroundColor: subject.color }}
                        />

                        {/* Contenido Superior */}
                        <div className="p-5 pl-6 relative z-10 flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-mono font-bold text-uecg-black bg-gray-100 px-2 py-1 border border-gray-200">
                                    {subject.code}
                                </span>
                                {!subject.isActive && (
                                    <span className="text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-50 px-1 border border-red-100">Inactiva</span>
                                )}
                            </div>
                            <h4 className="text-base font-black uppercase leading-tight text-uecg-black line-clamp-2">
                                {subject.name}
                            </h4>
                        </div>

                        {/* Footer de la Tarjeta (Acciones y Horas) */}
                        <div className="pl-6 pr-4 py-3 bg-gray-50 border-t-2 border-uecg-line flex justify-between items-center relative z-10">
                            <div className="flex items-center gap-1 text-[10px] font-black uppercase text-uecg-gray tracking-widest">
                                <Clock size={12} strokeWidth={3} />
                                {subject.weeklyHours} Hrs
                            </div>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link
                                    href={`/admin/academic?action=edit-subject&id=${subject.id}`}
                                    scroll={false}
                                    className="p-1.5 text-uecg-blue hover:bg-uecg-blue hover:text-white border border-transparent hover:border-uecg-blue transition-colors"
                                >
                                    <Edit size={14} strokeWidth={2.5} />
                                </Link>
                                <Link
                                    href={`/admin/academic?action=delete-subject&id=${subject.id}`}
                                    scroll={false}
                                    className="p-1.5 text-red-500 hover:bg-red-500 hover:text-white border border-transparent hover:border-red-500 transition-colors"
                                >
                                    <Trash2 size={14} strokeWidth={2.5} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}