import type { User } from './user'

export interface Post {
  id: string
  author: User
  imageUrl: string
  caption: string
  likesCount: number
  commentsCount: number
  isLiked: boolean
  createdAt: string
  updatedAt: string
}
