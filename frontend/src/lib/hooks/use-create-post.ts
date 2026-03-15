'use client'

import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useRouter} from 'next/navigation'
import * as realApi from '@/lib/api/posts'
import * as mockApi from '@/lib/api/posts.mock'

const createPost =
    process.env.NEXT_PUBLIC_USE_MOCK === 'true' ? mockApi.createPost : realApi.createPost

export function useCreatePost() {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn: (formData: FormData) => createPost(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['posts', 'feed']})
            router.push('/feed')
        },
    })
}
