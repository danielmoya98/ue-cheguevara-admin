"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useEffect, useTransition } from "react";

export default function StudentSearch({ initialQuery }: { initialQuery: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Estado local para lo que el usuario escribe
    const [query, setQuery] = useState(initialQuery);

    // useTransition permite que la actualización de la URL no bloquee la interfaz
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        // Configuramos el Debounce (espera 300ms después de la última tecla)
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams(searchParams);

            if (query) {
                params.set("q", query);
            } else {
                params.delete("q");
            }

            startTransition(() => {
                // Usamos replace en lugar de push para no llenar el historial del navegador con cada letra
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            });
        }, 300);

        // Limpiamos el timeout si el usuario sigue escribiendo
        return () => clearTimeout(timeoutId);
    }, [query, pathname, router, searchParams]);

    return (
        <div className="flex-1 relative">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isPending ? 'text-uecg-blue animate-pulse' : 'text-uecg-gray'}`}>
                <Search size={16} strokeWidth={3} />
            </div>
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="BUSCAR POR NOMBRE O CARNET..."
                className="w-full pl-12 pr-4 py-3 border-none bg-transparent font-bold text-uecg-black text-xs uppercase placeholder:text-gray-400 focus:outline-none transition-colors"
            />
        </div>
    );
}