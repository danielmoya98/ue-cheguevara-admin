import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        environment: 'jsdom', // Simula un navegador para tests de React
        globals: true, // Permite usar 'describe', 'it', 'expect' sin importarlos
        setupFiles: './vitest.setup.ts', // Archivo de configuración inicial
        alias: {
            '@': resolve(__dirname, './') // Asegura que el alias @ apunte a la raíz
        }
    },
})