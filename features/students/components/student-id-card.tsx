"use client";

interface StudentIdCardProps {
    student: any;
    classroom: any;
}

export default function StudentIdCard({ student, classroom }: StudentIdCardProps) {
    // Generamos un QR que contiene el ID único del estudiante
    // Este es el ID que leerá la App Móvil y enviará a nuestra API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${student.id}&margin=0`;

    return (
        <div className="w-[54mm] h-[86mm] bg-white border-2 border-uecg-black relative overflow-hidden flex flex-col print:border-uecg-line break-inside-avoid shadow-sm">

            {/* Cabecera del Carnet */}
            <div className="bg-uecg-black text-white p-3 text-center border-b-4 border-uecg-blue">
                <span className="block text-xs font-black uppercase tracking-widest leading-none">U.E.C.G.</span>
                <span className="block text-[6px] font-bold uppercase tracking-widest mt-1 text-gray-300">Carnet Estudiantil</span>
            </div>

            {/* Foto Placeholder */}
            <div className="flex justify-center mt-4">
                <div className="w-16 h-20 bg-gray-100 border-2 border-uecg-line flex items-center justify-center">
                    <span className="text-xl font-black text-gray-300">{student.user.name.substring(0, 2).toUpperCase()}</span>
                </div>
            </div>

            {/* Datos del Estudiante */}
            <div className="text-center px-2 mt-3 flex-1">
                <h2 className="text-xs font-black uppercase tracking-tight text-uecg-black leading-tight line-clamp-2">
                    {student.user.name}
                </h2>
                <span className="block text-[8px] font-bold text-uecg-gray uppercase tracking-widest mt-1">
                    CI: {student.user.ci}
                </span>
                <div className="mt-2 inline-block border border-uecg-line px-2 py-0.5">
                    <span className="block text-[9px] font-black uppercase text-uecg-blue">
                        {classroom.grade.name} "{classroom.name}"
                    </span>
                </div>

                {student.medicalConditions && (
                    <span className="block text-[7px] font-bold text-red-500 uppercase mt-2 leading-tight">
                        Alerta Médica: {student.medicalConditions}
                    </span>
                )}
            </div>

            {/* Código QR en la base */}
            <div className="bg-gray-50 p-3 border-t-2 border-uecg-line flex flex-col items-center justify-center">
                <img src={qrCodeUrl} alt={`QR ${student.user.name}`} className="w-16 h-16 object-contain mix-blend-multiply" />
                <span className="text-[6px] font-mono text-gray-400 mt-1 uppercase">ID: {student.id.split('-')[0]}</span>
            </div>
        </div>
    );
}