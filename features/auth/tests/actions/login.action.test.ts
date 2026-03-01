import { describe, it, expect, vi } from 'vitest'
import { loginAction } from '../../actions/login.action'
import { authService } from '../../services/auth.service'
import { redirect } from 'next/navigation'

// Mock del Servicio
vi.mock('../../services/auth.service', () => ({
    authService: {
        login: vi.fn()
    }
}))

// Mock de Navegación (ya está en setup, pero importamos 'redirect' para espiarlo)
// Nota: en setup mockeamos el módulo, aquí solo verificamos la llamada.

describe('Login Action', () => {
    it('debe retornar error de validación si los datos están vacíos', async () => {
        const formData = new FormData() // Vacío

        const result = await loginAction({}, formData)

        expect(result?.success).toBe(false)
        expect(result?.errors).toHaveProperty('email')
        expect(result?.errors).toHaveProperty('password')
    })

    it('debe llamar al servicio y redireccionar si los datos son válidos', async () => {
        // Simulamos que el servicio responde bien
        vi.mocked(authService.login).mockResolvedValue({
            id: '1',
            name: 'Test',
            email: 'test@test.com',
            role: 'admin'
        })

        const formData = new FormData()
        formData.append('email', 'admin@uecg.edu.bo')
        formData.append('password', '123456')

        // Ejecutamos la acción.
        // NOTA: Como 'redirect' lanza un error "NEXT_REDIRECT" internamente,
        // Vitest podría fallar si no lo manejamos, pero nuestro mock en setup evita el throw real.
        await loginAction({}, formData)

        // Verificamos que se llamó al servicio
        expect(authService.login).toHaveBeenCalled()

        // Verificamos la redirección
        expect(redirect).toHaveBeenCalledWith('/admin/dashboard')
    })

    it('debe retornar mensaje de error si el servicio falla (credenciales mal)', async () => {
        // Simulamos error en el servicio
        vi.mocked(authService.login).mockRejectedValue(new Error('Credenciales inválidas'))

        const formData = new FormData()
        formData.append('email', 'admin@uecg.edu.bo')
        formData.append('password', '123456')

        const result = await loginAction({}, formData)

        expect(result?.success).toBe(false)
        expect(result?.message).toBe('Credenciales inválidas')
        expect(redirect).not.toHaveBeenCalled()
    })
})