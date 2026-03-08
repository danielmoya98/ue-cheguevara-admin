import { cookies } from "next/headers";

interface SessionTokens {
    accessToken: string;
    refreshToken: string;
}

export const sessionService = {
    // Guarda los tokens recibidos de NestJS en cookies seguras
    setTokens: async (tokens: SessionTokens) => {
        const cookieStore = await cookies();

        // Access Token: Expira rápido, seguro
        cookieStore.set("access_token", tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 15, // 15 minutos (Debe coincidir con tu NestJS)
        });

        // Refresh Token: Expira tarde, ultra seguro
        cookieStore.set("refresh_token", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 días
        });
    },

    getAccessToken: async () => {
        return (await cookies()).get("access_token")?.value;
    },

    getRefreshToken: async () => {
        return (await cookies()).get("refresh_token")?.value;
    },

    clearSession: async () => {
        const cookieStore = await cookies();
        cookieStore.delete("access_token");
        cookieStore.delete("refresh_token");
    }
};