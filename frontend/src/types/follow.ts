import type { User } from './user'

export interface Follow {
  follower: User
  following: User
  createdAt: string
}
