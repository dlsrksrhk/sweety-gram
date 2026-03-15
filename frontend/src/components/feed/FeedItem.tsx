'use client'

import {useState, useEffect} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {MessageCircle} from 'lucide-react'
import type {Post} from '@/types/post'
import {Avatar} from '@/components/common/Avatar'
import {LikeButton} from './LikeButton'

interface FeedItemProps {
    post: Post
}

function formatRelativeTime(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const minutes = Math.floor(diff / 60_000)
    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}시간 전`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}일 전`
    return new Date(dateStr).toLocaleDateString('ko-KR')
}

function RelativeTime({dateStr}: { dateStr: string }) {
    const [label, setLabel] = useState('')
    useEffect(() => {
        setLabel(formatRelativeTime(dateStr))
    }, [dateStr])
    return <span className="text-xs text-muted-foreground">{label}</span>
}

export function FeedItem({post}: FeedItemProps) {
    const {id, author, imageUrl, caption, likesCount, commentsCount, isLiked, createdAt} = post

    return (
        <article className="border-b border-border">
            {/* 헤더: 아바타 + 이름 + 시간 */}
            <div className="flex items-center gap-3 px-4 py-3">
                <Link href={`/profile/${author.username}`}>
                    <Avatar src={author.avatarUrl} username={author.username} size="sm"/>
                </Link>
                <div className="flex flex-1 flex-col leading-tight">
                    <Link
                        href={`/profile/${author.username}`}
                        className="text-sm font-semibold hover:underline"
                    >
                        {author.username}
                    </Link>
                    <RelativeTime dateStr={createdAt}/>
                </div>
            </div>

            {/* 이미지 */}
            <Link href={`/post/${id}`}>
                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                    <Image
                        src={imageUrl}
                        alt={caption || `${author.username}의 게시물`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 672px, 800px"
                        className="object-cover"
                        unoptimized
                    />
                </div>
            </Link>

            {/* 액션 + 캡션 */}
            <div className="flex flex-col gap-2 px-4 py-3">
                <div className="flex items-center gap-4">
                    <LikeButton postId={id} isLiked={isLiked} likesCount={likesCount}/>
                    <Link
                        href={`/post/${id}`}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="댓글 보기"
                    >
                        <MessageCircle className="size-5"/>
                        <span className="tabular-nums">{commentsCount}</span>
                    </Link>
                </div>
                {caption && (
                    <p className="line-clamp-2 text-sm">
                        <span className="font-semibold">{author.username}</span>{' '}
                        <span className="text-muted-foreground">{caption}</span>
                    </p>
                )}
            </div>
        </article>
    )
}
