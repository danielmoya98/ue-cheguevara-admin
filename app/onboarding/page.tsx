"use client";

import { useActionState } from "react";
import { completeOnboardingAction } from "@/features/auth/actions/onboarding.action";
import { ShieldAlert } from "lucide-react";

export default function OnboardingPage() {
    const [state, action, isPending] = useActionState(completeOnboardingAction, { success: false, message: "" });

    return (
        <main className="min-h-screen bg-uecg-blue flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white border-2 border-white shadow-2xl p-8 md:p-12 relative overflow-hidden">

                {/* Decoración geométrica */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-50 rounded-none border border-uecg-line transform rotate-45"></div>

                <div className="relative z-10">
                    <div className="text-uecg-blue mb-6">
                        <ShieldAlert size={48} strokeWidth={1.5} />
                    </div>

                    <h1 className="text-3xl font-black uppercase tracking-tighter text-uecg-black leading-none mb-2">
                        Seguridad<br/>Requerida
                    </h1>
                    <p className="text-sm font-medium text-uecg-gray mb-8">
                        Estás accediendo con una contraseña temporal. Por tu seguridad y políticas de la institución, debes crear una nueva contraseña ahora.
                    </p>

                    <form action={action} className="space-y-6">

                        {state?.message && !state.success && (
                            <div className="bg-red-50 text-red-600 border border-red-600 p-3 text-xs font-bold uppercase tracking-widest">
                                {state.message}
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-black uppercase tracking-[0.15em] text-uecg-black mb-2 block">
                                Nueva Contraseña
                            </label>
                            <input
                                name="password"
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                className="w-full border-2 border-gray-300 p-3 text-sm font-bold text-uecg-black focus:border-uecg-blue outline-none transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-black uppercase tracking-[0.15em] text-uecg-black mb-2 block">
                                Confirmar Contraseña
                            </label>
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="Vuelve a escribirla"
                                className="w-full border-2 border-gray-300 p-3 text-sm font-bold text-uecg-black focus:border-uecg-blue outline-none transition-colors"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-4 bg-uecg-black text-white text-xs font-black uppercase tracking-widest hover:bg-uecg-blue transition-colors mt-4 disabled:opacity-50"
                        >
                            {isPending ? "Guardando..." : "Actualizar y Entrar"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}