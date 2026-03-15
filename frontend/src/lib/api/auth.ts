import type {User} from '@/types/user'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function login(
    email: string,
    password: string
): Promise<{ user: User; token: string }> {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
    })
    if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { message?: string }
        throw new Error(data.message ?? '로그인에 실패했습니다')
    }
    return res.json()
}

export async function register(
    username: string,
    email: string,
    password: string
): Promise<{ user: User; token: string }> {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, email, password}),
    })
    if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { message?: string }
        throw new Error(data.message ?? '회원가입에 실패했습니다')
    }
    return res.json()
}

export async function logout(token: string): Promise<void> {
    await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`},
    })
}
