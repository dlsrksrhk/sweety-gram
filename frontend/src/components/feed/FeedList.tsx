'use client'

import {useEffect, useRef} from 'react'
import Link from 'next/link'
import {Loader2} from 'lucide-react'
import {useFeedPosts} from '@/lib/hooks/use-feed-posts'
import {FeedItem} from './FeedItem'
import {Button} from '@/components/ui/button'

function FeedItemSkeleton() {
    return (
        <div className="border-b border-border animate-pulse">
            <div className="flex items-center gap-3 px-4 py-3">
                <div className="size-8 rounded-full bg-muted"/>
                <div className="flex flex-col gap-1.5">
                    <div className="h-3 w-24 rounded bg-muted"/>
                    <div className="h-2.5 w-16 rounded bg-muted"/>
                </div>
            </div>
            <div className="aspect-square w-full bg-muted"/>
            <div className="px-4 py-3 flex flex-col gap-2">
                <div className="flex gap-4">
                    <div className="h-5 w-16 rounded bg-muted"/>
                    <div className="h-5 w-12 rounded bg-muted"/>
                </div>
                <div className="h-3 w-3/4 rounded bg-muted"/>
            </div>
        </div>
    )
}

export function FeedList() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        refetch,
    } = useFeedPosts()

    const sentinelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = sentinelRef.current
        if (!el) return
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage()
                }
            },
            {threshold: 0.1}
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    if (isLoading) {
        return (
            <div className="flex flex-col">
                {Array.from({length: 3}).map((_, i) => (
                    <FeedItemSkeleton key={i}/>
                ))}
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
                <p className="text-muted-foreground">피드를 불러오는데 실패했습니다.</p>
                <Button variant="outline" onClick={() => refetch()}>
                    다시 시도
                </Button>
            </div>
        )
    }

    const posts = data?.pages.flatMap((p) => p.posts) ?? []

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 py-20 text-center px-4">
                <p className="text-muted-foreground">
                    팔로우한 계정의 게시물이 없습니다.
                </p>
                <Link href="/explore">
                    <Button variant="outline">탐색 페이지에서 새로운 사람들을 만나보세요</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            {posts.map((post) => (
                <FeedItem key={post.id} post={post}/>
            ))}

            {/* 무한 스크롤 sentinel */}
            <div ref={sentinelRef} className="h-1"/>

            {isFetchingNextPage && (
                <div className="flex justify-center py-6">
                    <Loader2 className="size-6 animate-spin text-muted-foreground"/>
                </div>
            )}

            {!hasNextPage && posts.length > 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                    모든 게시물을 확인했습니다.
                </p>
            )}
        </div>
    )
}
