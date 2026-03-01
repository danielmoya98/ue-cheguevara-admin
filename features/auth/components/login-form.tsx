"use client";

import { useActionState } from "react";
import { loginAction } from "../actions/login.action";

const initialState = {
    success: false,
    message: "",
    errors: {} as Record<string, string[]>
};

export default function LoginForm() {
    const [state, action, isPending] = useActionState(loginAction, initialState);

    return (
        <form action={action} className="flex flex-col gap-6 w-full max-w-md">

            {/* Mensaje de Error Global */}
            {state?.message && !state.success && (
                <div className="bg-red-50 border border-red-500 text-red-700 p-4 text-sm font-bold uppercase tracking-wide">
                    {state.message}
                </div>
            )}

            {/* Input Email */}
            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.2em] text-uecg-blue">
                    Correo Institucional
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    className="border border-uecg-line p-3 text-uecg-black focus:outline-none focus:border-uecg-blue transition-colors placeholder:text-gray-300"
                    placeholder="admin@uecg.edu.bo"
                />
                {state?.errors?.email && (
                    <span className="text-xs text-red-600 font-medium">{state.errors.email[0]}</span>
                )}
            </div>

            {/* Input Password */}
            <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-[0.2em] text-uecg-blue">
                    Contraseña
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    className="border border-uecg-line p-3 text-uecg-black focus:outline-none focus:border-uecg-blue transition-colors placeholder:text-gray-300"
                    placeholder="••••••"
                />
                {state?.errors?.password && (
                    <span className="text-xs text-red-600 font-medium">{state.errors.password[0]}</span>
                )}
            </div>

            {/* Botón Swiss Style */}
            <button
                type="submit"
                disabled={isPending}
                className="mt-4 bg-transparent border border-uecg-blue text-uecg-blue hover:bg-uecg-blue hover:text-white transition-all duration-300 ease-out py-3 px-6 uppercase font-bold tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? "Accediendo..." : "Ingresar al Sistema"}
            </button>
        </form>
    );
}