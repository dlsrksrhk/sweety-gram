'use client'

import {useMutation, useQueryClient} from '@tanstack/react-query'
import * as realApi from '@/lib/api/posts'
import * as mockApi from '@/lib/api/posts.mock'
import type {FeedPostsResponse} from '@/lib/api/posts'
import type {InfiniteData} from '@tanstack/react-query'

const toggleLike =
    process.env.NEXT_PUBLIC_USE_MOCK === 'true'
        ? mockApi.toggleLike
        : realApi.toggleLike

export function useToggleLike(postId: string, isLiked: boolean) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => toggleLike(postId, isLiked),
        onMutate: async () => {
            await queryClient.cancelQueries({queryKey: ['posts', 'feed']})
            const previous = queryClient.getQueryData<InfiniteData<FeedPostsResponse>>(['posts', 'feed'])

            queryClient.setQueryData<InfiniteData<FeedPostsResponse>>(['posts', 'feed'], (old) => {
                if (!old) return old
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        posts: page.posts.map((p) =>
                            p.id === postId
                                ? {
                                    ...p,
                                    isLiked: !isLiked,
                                    likesCount: isLiked ? p.likesCount - 1 : p.likesCount + 1,
                                }
                                : p
                        ),
                    })),
                }
            })

            return {previous}
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(['posts', 'feed'], context.previous)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ['posts', 'feed']})
        },
    })
}
