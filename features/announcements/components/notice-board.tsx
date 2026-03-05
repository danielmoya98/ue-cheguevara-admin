"use client";

import { Megaphone, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NoticeBoard({ announcements }: { announcements: any[] }) {
    return (
        <section className="bg-white border-2 border-uecg-line">
            <div className="bg-uecg-black text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Megaphone size={16} /> Tablón de Comunicados
                </h2>
                {/* CAMBIO CLAVE: Ruta absoluta garantizada */}
                <Link
                    href="/admin/dashboard?action=new-notice"
                    scroll={false}
                    className="text-[10px] font-black uppercase tracking-widest text-uecg-gray hover:text-white transition-colors border border-uecg-gray hover:border-white px-2 py-1"
                >
                    + Nuevo Aviso
                </Link>
            </div>

            <div className="p-0">
                {announcements.length === 0 ? (
                    <div className="p-8 text-center text-uecg-gray text-xs font-bold uppercase tracking-widest">
                        No hay comunicados recientes.
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {announcements.map((notice) => (
                            <li key={notice.id} className={`p-6 ${notice.isImportant ? 'bg-red-50/30' : 'hover:bg-gray-50'} transition-colors`}>
                                <div className="flex items-start gap-4">
                                    {notice.isImportant && (
                                        <AlertCircle className="text-red-500 shrink-0 mt-1" size={20} strokeWidth={2.5} />
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[9px] font-black uppercase tracking-widest bg-gray-200 text-uecg-black px-2 py-0.5">
                                                Para: {notice.target === 'ALL' ? 'Todos' : notice.target === 'TEACHERS' ? 'Docentes' : 'Estudiantes'}
                                            </span>
                                            <span className="text-[10px] font-bold text-uecg-gray uppercase tracking-widest">
                                                {new Date(notice.createdAt).toLocaleDateString('es-BO')}
                                            </span>
                                        </div>
                                        <h3 className={`text-base font-black uppercase tracking-tight mb-2 ${notice.isImportant ? 'text-red-600' : 'text-uecg-black'}`}>
                                            {notice.title}
                                        </h3>
                                        <p className="text-sm font-medium text-gray-600 leading-relaxed">
                                            {notice.content}
                                        </p>
                                        <span className="block mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            Publicado por: {notice.author.name}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}