import { describe, it, expect, vi } from 'vitest'
import { authService } from '../../services/auth.service'
import { authRepository } from '../../repositories/auth.repository'

// Mockeamos el repositorio completo
vi.mock('../../repositories/auth.repository', () => ({
    authRepository: {
        findByEmail: vi.fn()
    }
}))

describe('Auth Service', () => {
    it('debe lanzar error si el usuario no existe', async () => {
        // Simulamos que el repo devuelve null
        vi.mocked(authRepository.findByEmail).mockResolvedValue(null)

        await expect(authService.login({
            email: 'inexistente@test.com',
            password: '123'
        })).rejects.toThrow('Credenciales inválidas')
    })

    it('debe lanzar error si el password es incorrecto', async () => {
        // Simulamos que el repo encuentra al usuario
        vi.mocked(authRepository.findByEmail).mockResolvedValue({
            id: '1',
            name: 'Test',
            email: 'admin@test.com',
            password: 'passwordCorrecto',
            role: 'admin'
        })

        // Intentamos loguearnos con password incorrecto
        await expect(authService.login({
            email: 'admin@test.com',
            password: 'passwordIncorrecto'
        })).rejects.toThrow('Credenciales inválidas')
    })

    it('debe retornar el usuario (sin password) si todo es correcto', async () => {
        vi.mocked(authRepository.findByEmail).mockResolvedValue({
            id: '1',
            name: 'Test',
            email: 'admin@test.com',
            password: 'passwordCorrecto',
            role: 'admin'
        })

        const result = await authService.login({
            email: 'admin@test.com',
            password: 'passwordCorrecto'
        })

        expect(result).toHaveProperty('id', '1')
        expect(result).not.toHaveProperty('password') // Importante: no devolver password
    })
})