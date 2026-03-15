import {z} from 'zod'

export const loginSchema = z.object({
    email: z.string().email('유효한 이메일을 입력하세요'),
    password: z.string().min(8, '비밀번호는 최소 8자 이상입니다'),
})
export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z.object({
    username: z
        .string()
        .min(3, '사용자명은 최소 3자 이상입니다')
        .max(20, '사용자명은 최대 20자입니다')
        .regex(/^[a-zA-Z0-9_]+$/, '영문, 숫자, 언더스코어만 사용 가능합니다'),
    email: z.string().email('유효한 이메일을 입력하세요'),
    password: z.string().min(8, '비밀번호는 최소 8자 이상입니다'),
})
export type RegisterFormData = z.infer<typeof registerSchema>
