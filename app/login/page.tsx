import LoginForm from "@/features/auth/components/login-form";

export default function LoginPage() {
    return (
        <main className="min-h-screen flex flex-col md:flex-row bg-white">

            {/* Sección Izquierda: Identidad Visual (Swiss Style) */}
            <div className="w-full md:w-1/2 bg-uecg-blue p-12 flex flex-col justify-between text-white relative overflow-hidden">
                <div className="z-10">
                    {/* Títulos Display 900 Black */}
                    <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-4">
                        U.E.<br />Che Guevara
                    </h1>
                    <div className="w-20 h-1 bg-white mb-6"></div>
                    <p className="text-sm uppercase tracking-widest font-bold opacity-80">
                        Panel de Administración
                    </p>
                </div>

                <div className="z-10 text-xs font-mono opacity-50">
                    SYSTEM_V1.0 // AUTHORIZED_PERSONNEL_ONLY
                </div>

                {/* Decoración Geométrica Sutil */}
                <div className="absolute -bottom-20 -right-20 w-80 h-80 border-[1px] border-white opacity-10 rounded-none"></div>
                <div className="absolute top-20 right-20 w-40 h-40 border-[1px] border-white opacity-10 rounded-none"></div>
            </div>

            {/* Sección Derecha: Formulario */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-24">
                <div className="w-full max-w-md">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-uecg-black mb-8 border-l-4 border-uecg-blue pl-4">
                        Iniciar Sesión
                    </h2>
                    <LoginForm />
                </div>
            </div>

        </main>
    );
}