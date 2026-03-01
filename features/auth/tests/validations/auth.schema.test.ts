import { describe, it, expect } from 'vitest'
import { loginSchema } from '../../validations/auth.schema'

describe('Auth Validations (loginSchema)', () => {
    it('debe aceptar un email y password válidos', () => {
        const validInput = {
            email: 'admin@uecg.edu.bo',
            password: 'password123'
        }

        const result = loginSchema.safeParse(validInput)
        expect(result.success).toBe(true)
    })

    it('debe rechazar un email inválido', () => {
        const invalidInput = {
            email: 'no-es-un-correo',
            password: 'password123'
        }

        const result = loginSchema.safeParse(invalidInput)
        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.flatten().fieldErrors.email).toBeDefined()
        }
    })

    it('debe rechazar password muy corto', () => {
        const invalidInput = {
            email: 'admin@uecg.edu.bo',
            password: '123' // Menos de 6 caracteres
        }

        const result = loginSchema.safeParse(invalidInput)
        expect(result.success).toBe(false)
    })
})