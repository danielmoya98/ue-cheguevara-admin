import type { Metadata } from "next";
// Asegúrate de importar la fuente correcta si usas Google Fonts (Inter o Jost para Swiss Style)
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Panel Admin - U.E. Che Guevara",
    description: "Sistema de Gestión Académica",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
        {/* suppressHydrationWarning={true}
         Esto silencia el error causado por extensiones como ColorZilla o Grammarly
         que modifican el DOM antes de que React cargue.
      */}
        <body className={`${inter.className} antialiased`} suppressHydrationWarning={true}>
        {children}
        </body>
        </html>
    );
}