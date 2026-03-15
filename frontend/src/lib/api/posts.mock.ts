import type {Post} from '@/types/post'
import type {FeedPostsResponse} from './posts'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const MOCK_AUTHOR = {
    id: 'mock-user-1',
    username: 'testuser',
    email: 'test@example.com',
    name: 'Test User',
    avatarUrl: null,
    bio: '안녕하세요!',
    followersCount: 12,
    followingCount: 8,
    postsCount: 15,
    isFollowing: false,
}

function makePosts(page: number, count: number): Post[] {
    return Array.from({length: count}, (_, i) => {
        const idx = (page - 1) * count + i + 1
        return {
            id: `post-${idx}`,
            author: {...MOCK_AUTHOR, id: `user-${(idx % 3) + 1}`, username: `user${(idx % 3) + 1}`},
            imageUrl: `https://picsum.photos/seed/post${idx}/600/600`,
            caption: idx % 3 === 0
                ? `게시물 ${idx}번째 캡션입니다. 오늘도 좋은 하루 보내세요! 🌟`
                : `게시물 ${idx}번째 캡션입니다.`,
            likesCount: idx * 3,
            commentsCount: idx,
            isLiked: idx % 2 === 0,
            createdAt: new Date(Date.now() - idx * 3_600_000).toISOString(),
            updatedAt: new Date(Date.now() - idx * 3_600_000).toISOString(),
        }
    })
}

export async function fetchFeedPosts(cursor?: string): Promise<FeedPostsResponse> {
    await delay(600)
    if (!cursor) {
        return {posts: makePosts(1, 15), nextCursor: 'page2'}
    }
    if (cursor === 'page2') {
        return {posts: makePosts(2, 15), nextCursor: undefined}
    }
    return {posts: [], nextCursor: undefined}
}

export async function createPost(_formData: FormData): Promise<Post> {
    await delay(500)
    return {
        id: `post-new-${Date.now()}`,
        author: MOCK_AUTHOR,
        imageUrl: 'https://picsum.photos/seed/new/600/600',
        caption: (_formData.get('caption') as string) ?? '',
        likesCount: 0,
        commentsCount: 0,
        isLiked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
}

export async function fetchPostDetail(id: string): Promise<Post> {
    await delay(400)
    const idx = parseInt(id.replace('post-', ''), 10) || 1
    return {
        id,
        author: {...MOCK_AUTHOR, id: `user-${(idx % 3) + 1}`, username: `user${(idx % 3) + 1}`},
        imageUrl: `https://picsum.photos/seed/post${idx}/600/600`,
        caption: `게시물 ${idx}번째 캡션입니다. 오늘도 좋은 하루 보내세요! 🌟`,
        likesCount: idx * 3,
        commentsCount: idx,
        isLiked: idx % 2 === 0,
        createdAt: new Date(Date.now() - idx * 3_600_000).toISOString(),
        updatedAt: new Date(Date.now() - idx * 3_600_000).toISOString(),
    }
}

export async function updatePost(id: string, caption: string): Promise<Post> {
    await delay(500)
    const idx = parseInt(id.replace('post-', ''), 10) || 1
    return {
        id,
        author: MOCK_AUTHOR,
        imageUrl: `https://picsum.photos/seed/post${idx}/600/600`,
        caption,
        likesCount: idx * 3,
        commentsCount: idx,
        isLiked: idx % 2 === 0,
        createdAt: new Date(Date.now() - idx * 3_600_000).toISOString(),
        updatedAt: new Date().toISOString(),
    }
}

export async function deletePost(_id: string): Promise<void> {
    await delay(500)
}

export async function toggleLike(postId: string, _isLiked: boolean): Promise<void> {
    await delay(500)
    if (postId === 'error-test') throw new Error('좋아요 처리에 실패했습니다')
}
