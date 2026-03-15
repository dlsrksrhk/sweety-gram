'use client'

import {useInfiniteQuery} from '@tanstack/react-query'
import * as realApi from '@/lib/api/posts'
import * as mockApi from '@/lib/api/posts.mock'

const fetchFeedPosts =
    process.env.NEXT_PUBLIC_USE_MOCK === 'true'
        ? mockApi.fetchFeedPosts
        : realApi.fetchFeedPosts

export function useFeedPosts() {
    return useInfiniteQuery({
        queryKey: ['posts', 'feed'],
        queryFn: ({pageParam}) => fetchFeedPosts(pageParam as string | undefined),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })
}
