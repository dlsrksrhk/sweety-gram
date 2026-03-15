'use client'

import {useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {MessageCircle, Pencil, Trash2} from 'lucide-react'
import type {Post} from '@/types/post'
import {Avatar} from '@/components/common/Avatar'
import {LikeButton} from '@/components/feed/LikeButton'
import {CaptionEditForm} from './CaptionEditForm'
import {useDeletePost} from '@/lib/hooks/use-delete-post'
import {useAuthStore} from '@/lib/stores/use-auth-store'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface PostDetailProps {
    post: Post
}

export function PostDetail({post}: PostDetailProps) {
    const {id, author, imageUrl, caption, likesCount, commentsCount, isLiked} = post
    const user = useAuthStore((s) => s.user)
    const isOwner = user?.id === author.id

    const [isEditing, setIsEditing] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const {mutate: deletePost, isPending: isDeleting} = useDeletePost(id)

    return (
        <article className="flex flex-col">
            {/* 헤더 */}
            <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-3">
                    <Link href={`/profile/${author.username}`}>
                        <Avatar src={author.avatarUrl} username={author.username} size="sm"/>
                    </Link>
                    <Link href={`/profile/${author.username}`} className="text-sm font-semibold hover:underline">
                        {author.username}
                    </Link>
                </div>
                {isOwner && (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="캡션 수정"
                            onClick={() => setIsEditing((v) => !v)}
                        >
                            <Pencil className="size-4"/>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="게시물 삭제"
                            onClick={() => setDeleteOpen(true)}
                        >
                            <Trash2 className="size-4 text-destructive"/>
                        </Button>
                    </div>
                )}
            </div>

            {/* 이미지 */}
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

            {/* 액션 + 캡션 */}
            <div className="flex flex-col gap-3 px-4 py-3">
                <div className="flex items-center gap-4">
                    <LikeButton postId={id} isLiked={isLiked} likesCount={likesCount}/>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MessageCircle className="size-5"/>
                        <span className="tabular-nums">{commentsCount}</span>
                    </span>
                </div>

                {isEditing ? (
                    <CaptionEditForm
                        postId={id}
                        initialCaption={caption}
                        onCancel={() => setIsEditing(false)}
                        onSuccess={() => setIsEditing(false)}
                    />
                ) : (
                    caption && (
                        <p className="text-sm">
                            <span className="font-semibold">{author.username}</span>{' '}
                            <span className="text-muted-foreground">{caption}</span>
                        </p>
                    )
                )}
            </div>

            {/* 삭제 확인 다이얼로그 */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>게시물 삭제</DialogTitle>
                        <DialogDescription>
                            이 게시물을 삭제하시겠습니까? 삭제한 게시물은 복구할 수 없습니다.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isDeleting}>
                            취소
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deletePost()}
                            disabled={isDeleting}
                        >
                            삭제
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </article>
    )
}
