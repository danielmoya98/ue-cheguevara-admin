import { vi, expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extender los matchers de Vitest con los de jest-dom
expect.extend(matchers)

// Limpieza automática después de cada test
afterEach(() => {
    cleanup()
    vi.clearAllMocks()
})

// Mock de next/navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
    }),
    useSearchParams: () => ({
        get: vi.fn(),
    }),
    redirect: vi.fn(),
    usePathname: vi.fn(),
}))

// Mock de next/headers
vi.mock('next/headers', () => ({
    cookies: () => ({
        set: vi.fn(),
        get: vi.fn(),
        delete: vi.fn(),
    }),
}))