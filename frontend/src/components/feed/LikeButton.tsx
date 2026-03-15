'use client'

import {Heart} from 'lucide-react'
import {cn} from '@/lib/utils'
import {useToggleLike} from '@/lib/hooks/use-toggle-like'

interface LikeButtonProps {
    postId: string
    isLiked: boolean
    likesCount: number
}

export function LikeButton({postId, isLiked, likesCount}: LikeButtonProps) {
    const {mutate, isPending} = useToggleLike(postId, isLiked)

    return (
        <button
            onClick={() => mutate()}
            disabled={isPending}
            aria-label={isLiked ? '좋아요 취소' : '좋아요'}
            className="flex items-center gap-1.5 text-sm transition-colors disabled:opacity-60"
        >
            <Heart
                className={cn(
                    'size-5 transition-all',
                    isLiked ? 'fill-red-500 stroke-red-500' : 'stroke-foreground'
                )}
            />
            <span className="tabular-nums text-muted-foreground">{likesCount}</span>
        </button>
    )
}
