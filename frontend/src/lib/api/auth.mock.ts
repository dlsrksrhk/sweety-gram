import type {User} from '@/types/user'

const MOCK_USER: User = {
    id: 'mock-user-1',
    username: 'testuser',
    email: 'test@example.com',
    name: 'Test User',
    avatarUrl: null,
    bio: '안녕하세요, 테스트 계정입니다.',
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    isFollowing: false,
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function login(
    email: string,
    password: string
): Promise<{ user: User; token: string }> {
    await delay(600)
    if (email !== 'test@example.com' || password !== 'password123') {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다')
    }
    return {user: {...MOCK_USER, email}, token: 'mock-token-abc123'}
}

export async function register(
    username: string,
    email: string,
    _password: string
): Promise<{ user: User; token: string }> {
    await delay(600)
    if (username === 'taken') {
        throw new Error('이미 사용 중인 사용자명입니다')
    }
    return {
        user: {...MOCK_USER, username, email, name: username},
        token: 'mock-token-new456',
    }
}

export async function logout(_token: string): Promise<void> {
    await delay(300)
}
