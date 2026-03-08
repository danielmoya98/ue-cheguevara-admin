"use client";

import { Printer } from "lucide-react";

export interface BulletinData {
    student: {
        documentId: string; // <-- Aquí está el CI en tu base de datos
        user: {
            name: string;
        };
    };
    classroom: {
        name: string;
        grade: {
            name: string;
            level: string;
        };
    };
    academicYear: number;
    grades: {
        subjectName: string;
        t1: number | null;
        t2: number | null;
        t3: number | null;
        final: number | null;
    }[];
}

export default function BulletinPrintable({ data }: { data: BulletinData }) {

    // Función nativa para llamar al diálogo de impresión del navegador
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="relative">
            {/* Botón Flotante para Imprimir (Se oculta al imprimir) */}
            <div className="flex justify-end mb-4 print:hidden">
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-uecg-black text-white px-6 py-3 font-black uppercase text-xs tracking-widest hover:bg-uecg-blue transition-colors border-2 border-uecg-black"
                >
                    <Printer size={16} strokeWidth={2.5} />
                    Imprimir / Guardar PDF
                </button>
            </div>

            {/* HOJA DEL BOLETÍN
                Usamos print:fixed print:inset-0 para que al imprimir,
                esta hoja cubra toda la pantalla tapando el menú lateral.
            */}
            <div className="bg-white border-2 border-uecg-line p-10 shadow-sm print:fixed print:inset-0 print:border-none print:shadow-none print:z-[9999] print:bg-white mx-auto max-w-4xl">

                {/* ENCABEZADO OFICIAL */}
                <div className="text-center border-b-4 border-uecg-black pb-6 mb-8">
                    <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter leading-none mb-2">
                        Unidad Educativa Central
                    </h1>
                    <h2 className="text-xl font-bold text-uecg-gray uppercase tracking-widest mb-4">
                        Boletín Oficial de Calificaciones
                    </h2>
                    <div className="inline-block border-2 border-uecg-black px-4 py-1 text-sm font-black uppercase tracking-widest">
                        Gestión {data.academicYear}
                    </div>
                </div>

                {/* DATOS DEL ESTUDIANTE */}
                <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-50 border-2 border-uecg-line p-6">
                    <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-uecg-gray mb-1">Estudiante</span>
                        <span className="block text-lg font-black text-uecg-black uppercase">{data.student.user.name}</span>
                        <span className="block text-xs font-bold text-gray-500 uppercase mt-1">CI: {data.student.documentId}</span>
                    </div>
                    <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-uecg-gray mb-1">Curso y Nivel</span>
                        <span className="block text-lg font-black text-uecg-black uppercase">
                            {data.classroom.grade.name} "{data.classroom.name}"
                        </span>
                        <span className="block text-xs font-bold text-gray-500 uppercase mt-1">
                            Nivel {data.classroom.grade.level}
                        </span>
                    </div>
                </div>

                {/* TABLA DE CALIFICACIONES */}
                <table className="w-full text-left border-collapse border-2 border-uecg-black mb-12">
                    <thead>
                    <tr className="bg-uecg-black text-white">
                        <th className="p-3 text-xs font-black uppercase tracking-[0.15em] border border-uecg-black w-1/3">Materia</th>
                        <th className="p-3 text-[10px] font-black uppercase tracking-widest border border-uecg-black text-center w-16">1er Trim</th>
                        <th className="p-3 text-[10px] font-black uppercase tracking-widest border border-uecg-black text-center w-16">2do Trim</th>
                        <th className="p-3 text-[10px] font-black uppercase tracking-widest border border-uecg-black text-center w-16">3er Trim</th>
                        <th className="p-3 text-xs font-black uppercase tracking-widest border border-uecg-black bg-uecg-blue text-center w-24">Final</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-uecg-line">
                    {data.grades.map((grade, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="p-3 font-bold text-sm text-uecg-black border border-uecg-line uppercase">
                                {grade.subjectName}
                            </td>
                            <td className="p-3 font-mono font-bold text-center border border-uecg-line text-sm text-gray-600">
                                {grade.t1 !== null ? grade.t1 : '-'}
                            </td>
                            <td className="p-3 font-mono font-bold text-center border border-uecg-line text-sm text-gray-600">
                                {grade.t2 !== null ? grade.t2 : '-'}
                            </td>
                            <td className="p-3 font-mono font-bold text-center border border-uecg-line text-sm text-gray-600">
                                {grade.t3 !== null ? grade.t3 : '-'}
                            </td>
                            <td className={`p-3 font-mono font-black text-center border-2 border-uecg-black text-lg ${grade.final !== null && grade.final < 51 ? 'text-red-600 bg-red-50' : 'text-uecg-blue bg-blue-50'}`}>
                                {grade.final !== null ? grade.final : '-'}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* FIRMAS */}
                <div className="grid grid-cols-2 gap-10 mt-20 pt-10">
                    <div className="text-center">
                        <div className="w-48 mx-auto border-t-2 border-uecg-black pt-2">
                            <span className="block text-xs font-black uppercase tracking-widest text-uecg-black">Firma Dirección</span>
                            <span className="block text-[10px] font-bold text-uecg-gray uppercase mt-1">Sello Institucional</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="w-48 mx-auto border-t-2 border-uecg-black pt-2">
                            <span className="block text-xs font-black uppercase tracking-widest text-uecg-black">Sello del Tutor</span>
                            <span className="block text-[10px] font-bold text-uecg-gray uppercase mt-1">Conformidad</span>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-12 text-[9px] font-bold uppercase tracking-widest text-gray-400">
                    Documento generado por el Sistema UECG el {new Date().toLocaleDateString('es-BO')}
                </div>
            </div>
        </div>
    );
}