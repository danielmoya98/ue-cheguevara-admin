"use client";

import { useActionState } from "react";
import { completeOnboardingAction } from "@/features/auth/actions/onboarding.action";
import { ShieldAlert, Lock, Check, KeyRound } from "lucide-react";

export default function OnboardingPage() {
    const [state, action, isPending] = useActionState(completeOnboardingAction, { success: false, message: "" });

    return (
        <main className="min-h-screen bg-uecg-blue flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white border-4 border-uecg-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 relative overflow-hidden">

                {/* Decoración suiza geométrica */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-50 rotate-45 border border-uecg-line"></div>

                <div className="relative z-10">
                    <div className="text-uecg-blue mb-6">
                        <ShieldAlert size={56} strokeWidth={2} />
                    </div>

                    <h1 className="text-4xl font-black uppercase tracking-tighter text-uecg-black leading-[0.9] mb-4">
                        SEGURIDAD<br/>OBLIGATORIA
                    </h1>

                    <p className="text-[11px] font-black uppercase tracking-widest text-uecg-gray mb-8 border-l-4 border-uecg-blue pl-4">
                        Detectamos un inicio de sesión con clave temporal. Crea una contraseña personal para continuar.
                    </p>

                    <form action={action} className="space-y-5">
                        {state?.message && !state.success && (
                            <div className="bg-red-50 text-red-600 border-2 border-red-600 p-4 text-[10px] font-black uppercase tracking-widest animate-shake">
                                {state.message}
                            </div>
                        )}

                        {/* NUEVO INPUT: Contraseña Actual */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-uecg-black flex items-center gap-2">
                                <KeyRound size={12} /> Contraseña Actual (Temporal)
                            </label>
                            <input
                                name="oldPassword"
                                type="password"
                                placeholder="******"
                                className="w-full border-2 border-gray-300 p-4 text-sm font-bold text-uecg-black focus:border-uecg-blue outline-none transition-all placeholder:text-gray-200"
                                required
                            />
                        </div>

                        {/* Input: Nueva Contraseña */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-uecg-black flex items-center gap-2">
                                <Lock size={12} /> Nueva Contraseña
                            </label>
                            <input
                                name="password"
                                type="password"
                                placeholder="******"
                                className="w-full border-2 border-gray-300 p-4 text-sm font-bold text-uecg-black focus:border-uecg-blue outline-none transition-all placeholder:text-gray-200"
                                required
                            />
                        </div>

                        {/* Input: Confirmar Contraseña */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-uecg-black flex items-center gap-2">
                                <Check size={12} /> Confirmar Nueva Contraseña
                            </label>
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="******"
                                className="w-full border-2 border-gray-300 p-4 text-sm font-bold text-uecg-black focus:border-uecg-blue outline-none transition-all placeholder:text-gray-200"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-5 bg-uecg-black text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-uecg-blue transition-all mt-4 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {isPending ? "PROCESANDO..." : "ACTIVAR MI CUENTA"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}