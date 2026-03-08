import { sessionService } from "./session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface FetchOptions extends RequestInit {
    requireAuth?: boolean; // Por defecto es true
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { requireAuth = true, ...customConfig } = options;

    const headers = new Headers(customConfig.headers);
    headers.set("Content-Type", "application/json");

    // 1. INYECTAR ACCESS TOKEN (Si la ruta lo requiere)
    if (requireAuth) {
        const token = await sessionService.getAccessToken();
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
    }

    const config: RequestInit = {
        ...customConfig,
        headers,
    };

    // 2. HACER LA PETICIÓN A NESTJS
    let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // 3. INTERCEPTAR ERROR 401 (Token Expirado)
    if (response.status === 401 && requireAuth) {
        const refreshToken = await sessionService.getRefreshToken();

        if (refreshToken) {
            // Intentar refrescar el token
            const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken })
            });

            if (refreshRes.ok) {
                // Éxito al refrescar: Guardar nuevos tokens
                const newTokens = await refreshRes.json();
                await sessionService.setTokens({
                    accessToken: newTokens.accessToken,
                    refreshToken: newTokens.refreshToken
                });

                // REINTENTAR LA PETICIÓN ORIGINAL con el nuevo token
                headers.set("Authorization", `Bearer ${newTokens.accessToken}`);
                response = await fetch(`${API_BASE_URL}${endpoint}`, { ...config, headers });
            } else {
                // Si el refresh falla (ej. expiró después de 7 días), limpiamos sesión
                await sessionService.clearSession();
                throw new Error("SESSION_EXPIRED");
            }
        } else {
            throw new Error("UNAUTHORIZED");
        }
    }

    // 4. MANEJO DE ERRORES GENERALES
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
}