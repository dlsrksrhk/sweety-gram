export interface User {
    id: string
    username: string
    email: string
    name: string
    avatarUrl: string | null
    bio: string | null
    followersCount: number
    followingCount: number
    postsCount: number
    isFollowing: boolean
}
