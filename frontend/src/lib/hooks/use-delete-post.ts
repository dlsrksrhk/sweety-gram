import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useRouter} from 'next/navigation'
import * as realApi from '@/lib/api/posts'
import * as mockApi from '@/lib/api/posts.mock'

const deletePost =
    process.env.NEXT_PUBLIC_USE_MOCK === 'true'
        ? mockApi.deletePost
        : realApi.deletePost

export function useDeletePost(id: string) {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn: () => deletePost(id),
        onSuccess: () => {
            queryClient.removeQueries({queryKey: ['posts', id]})
            queryClient.invalidateQueries({queryKey: ['posts', 'feed']})
            router.push('/feed')
        },
    })
}
