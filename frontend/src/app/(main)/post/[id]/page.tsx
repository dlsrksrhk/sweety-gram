'use client'

import {use} from 'react'
import {ArrowLeft} from 'lucide-react'
import Link from 'next/link'
import {usePostDetail} from '@/lib/hooks/use-post-detail'
import {PostDetail} from '@/components/post/PostDetail'

interface PostPageProps {
    params: Promise<{id: string}>
}

export default function PostPage({params}: PostPageProps) {
    const {id} = use(params)
    const {data: post, isLoading, isError} = usePostDetail(id)

    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Link href="/feed" aria-label="뒤로가기">
                    <ArrowLeft className="size-5"/>
                </Link>
                <h1 className="text-base font-semibold">게시물</h1>
            </div>

            {isLoading && (
                <div className="flex flex-col gap-4 p-4">
                    <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-muted animate-pulse"/>
                        <div className="h-4 w-24 rounded bg-muted animate-pulse"/>
                    </div>
                    <div className="aspect-square w-full rounded bg-muted animate-pulse"/>
                </div>
            )}

            {isError && (
                <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
                    <p className="text-sm">게시물을 불러오지 못했습니다.</p>
                    <Link href="/feed" className="text-sm underline">피드로 돌아가기</Link>
                </div>
            )}

            {post && <PostDetail post={post}/>}
        </div>
    )
}
