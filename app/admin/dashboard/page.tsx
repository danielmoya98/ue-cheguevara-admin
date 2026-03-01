import { Users, BookOpen, Bell } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-8">

            {/* Título de Sección */}
            <div>
                <h1 className="text-4xl font-black text-uecg-black uppercase tracking-tighter mb-2">
                    Resumen General
                </h1>
                <p className="text-uecg-gray font-medium">
                    Bienvenido al sistema de gestión académica.
                </p>
            </div>

            {/* Grid de Tarjetas - Swiss Style (Bordes, sin sombras) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Card 1 */}
                <div className="bg-white border border-uecg-line p-6 flex flex-col justify-between h-40 hover:border-uecg-blue transition-colors group">
                    <div className="flex justify-between items-start">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-uecg-gray group-hover:text-uecg-blue">
                            Estudiantes
                        </h3>
                        <Users className="text-uecg-blue" size={24} />
                    </div>
                    <div className="text-4xl font-black text-uecg-black">
                        1,240
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white border border-uecg-line p-6 flex flex-col justify-between h-40 hover:border-uecg-blue transition-colors group">
                    <div className="flex justify-between items-start">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-uecg-gray group-hover:text-uecg-blue">
                            Docentes
                        </h3>
                        <BookOpen className="text-uecg-blue" size={24} />
                    </div>
                    <div className="text-4xl font-black text-uecg-black">
                        85
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white border border-uecg-line p-6 flex flex-col justify-between h-40 hover:border-uecg-blue transition-colors group">
                    <div className="flex justify-between items-start">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-uecg-gray group-hover:text-uecg-blue">
                            Notificaciones
                        </h3>
                        <Bell className="text-uecg-blue" size={24} />
                    </div>
                    <div className="text-4xl font-black text-uecg-black">
                        3
                    </div>
                </div>

            </div>

            {/* Área de contenido vacío para demostrar estructura */}
            <div className="bg-white border border-uecg-line p-8 h-96 flex items-center justify-center border-dashed">
                <p className="text-uecg-gray font-mono text-sm">

                </p>
            </div>
        </div>
    );
}