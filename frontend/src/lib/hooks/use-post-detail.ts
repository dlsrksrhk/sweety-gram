import {useQuery} from '@tanstack/react-query'
import * as realApi from '@/lib/api/posts'
import * as mockApi from '@/lib/api/posts.mock'

const fetchPostDetail =
    process.env.NEXT_PUBLIC_USE_MOCK === 'true'
        ? mockApi.fetchPostDetail
        : realApi.fetchPostDetail

export function usePostDetail(id: string) {
    return useQuery({
        queryKey: ['posts', id],
        queryFn: () => fetchPostDetail(id),
        enabled: !!id,
    })
}
