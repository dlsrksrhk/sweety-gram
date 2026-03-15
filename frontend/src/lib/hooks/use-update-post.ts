import {useMutation, useQueryClient} from '@tanstack/react-query'
import * as realApi from '@/lib/api/posts'
import * as mockApi from '@/lib/api/posts.mock'

const updatePost =
    process.env.NEXT_PUBLIC_USE_MOCK === 'true'
        ? mockApi.updatePost
        : realApi.updatePost

export function useUpdatePost(id: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (caption: string) => updatePost(id, caption),
        onSuccess: (updated) => {
            queryClient.setQueryData(['posts', id], updated)
        },
    })
}
