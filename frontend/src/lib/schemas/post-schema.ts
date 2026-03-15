import {z} from 'zod'

export const createPostSchema = z.object({
    caption: z.string().max(2200, '캡션은 최대 2,200자까지 입력할 수 있습니다'),
})

export type CreatePostFormData = z.infer<typeof createPostSchema>
