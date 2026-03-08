import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 1. Obtenemos la cookie de sesión
    const session = request.cookies.get('uecg_session');
    const { pathname } = request.nextUrl;

    // 2. Definimos rutas públicas (donde NO se necesita estar logueado)
    const isPublicRoute = pathname === '/' || pathname === '/login';

    // 3. SI NO HAY SESIÓN y el usuario intenta entrar a una ruta protegida
    if (!session && !isPublicRoute) {
        // Redirigir al login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 4. SI HAY SESIÓN e intenta ir al login o raíz (ya está logueado)
    if (session && isPublicRoute) {
        // Aquí podrías redirigir al dashboard, pero por ahora lo dejamos pasar
        // o podrías tener una lógica para mandarlo a su dashboard según rol
    }

    // Permitir que la petición continúe
    return NextResponse.next();
}

// 5. Configuramos qué rutas debe vigilar el middleware
export const config = {
    matcher: [
        /*
         * Coincidir con todas las rutas excepto:
         * - api (rutas de API)
         * - _next/static (archivos estáticos)
         * - _next/image (optimización de imágenes)
         * - favicon.ico (icono)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};