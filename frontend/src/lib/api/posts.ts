import type {Post} from '@/types/post'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface FeedPostsResponse {
    posts: Post[]
    nextCursor?: string
}

function getToken(): string | null {
    try {
        return JSON.parse(localStorage.getItem('auth-storage') ?? '{}')?.state?.token ?? null
    } catch {
        return null
    }
}

export async function fetchFeedPosts(cursor?: string): Promise<FeedPostsResponse> {
    const url = cursor
        ? `${BASE_URL}/api/posts/feed?cursor=${cursor}`
        : `${BASE_URL}/api/posts/feed`
    const token = getToken()
    const res = await fetch(url, {
        headers: token ? {Authorization: `Bearer ${token}`} : {},
    })
    if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { message?: string }
        throw new Error(data.message ?? '피드를 불러오는데 실패했습니다')
    }
    return res.json()
}

export async function createPost(formData: FormData): Promise<Post> {
    const token = getToken()
    const res = await fetch(`${BASE_URL}/api/posts`, {
        method: 'POST',
        headers: token ? {Authorization: `Bearer ${token}`} : {},
        body: formData,
    })
    if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { message?: string }
        throw new Error(data.message ?? '게시물 작성에 실패했습니다')
    }
    return res.json()
}

export async function fetchPostDetail(id: string): Promise<Post> {
    const token = getToken()
    const res = await fetch(`${BASE_URL}/api/posts/${id}`, {
        headers: token ? {Authorization: `Bearer ${token}`} : {},
    })
    if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { message?: string }
        throw new Error(data.message ?? '게시물을 불러오는데 실패했습니다')
    }
    return res.json()
}

export async function updatePost(id: string, caption: string): Promise<Post> {
    const token = getToken()
    const res = await fetch(`${BASE_URL}/api/posts/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
        },
        body: JSON.stringify({caption}),
    })
    if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { message?: string }
        throw new Error(data.message ?? '게시물 수정에 실패했습니다')
    }
    return res.json()
}

export async function deletePost(id: string): Promise<void> {
    const token = getToken()
    const res = await fetch(`${BASE_URL}/api/posts/${id}`, {
        method: 'DELETE',
        headers: token ? {Authorization: `Bearer ${token}`} : {},
    })
    if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { message?: string }
        throw new Error(data.message ?? '게시물 삭제에 실패했습니다')
    }
}

export async function toggleLike(postId: string, isLiked: boolean): Promise<void> {
    const token = getToken()
    const res = await fetch(`${BASE_URL}/api/posts/${postId}/likes`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: token ? {Authorization: `Bearer ${token}`} : {},
    })
    if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { message?: string }
        throw new Error(data.message ?? '좋아요 처리에 실패했습니다')
    }
}
