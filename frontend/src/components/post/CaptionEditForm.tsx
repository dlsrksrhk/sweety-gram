'use client'

import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Loader2} from 'lucide-react'
import {createPostSchema, type CreatePostFormData} from '@/lib/schemas/post-schema'
import {useUpdatePost} from '@/lib/hooks/use-update-post'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'

const MAX_CAPTION = 2200

interface CaptionEditFormProps {
    postId: string
    initialCaption: string
    onCancel: () => void
    onSuccess: () => void
}

export function CaptionEditForm({postId, initialCaption, onCancel, onSuccess}: CaptionEditFormProps) {
    const {mutate: updatePost, isPending} = useUpdatePost(postId)

    const {register, handleSubmit, watch, formState: {errors}} = useForm<CreatePostFormData>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {caption: initialCaption},
    })
    const caption = watch('caption')

    const onSubmit = (data: CreatePostFormData) => {
        updatePost(data.caption, {
            onSuccess,
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <textarea
                {...register('caption')}
                rows={4}
                maxLength={MAX_CAPTION}
                className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors"
            />
            <div className="flex items-center justify-between">
                {errors.caption && (
                    <p className="text-xs text-destructive">{errors.caption.message}</p>
                )}
                <span className={cn(
                    'ml-auto text-xs tabular-nums',
                    caption.length > MAX_CAPTION * 0.9 ? 'text-destructive' : 'text-muted-foreground'
                )}>
                    {caption.length} / {MAX_CAPTION}
                </span>
            </div>
            <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" className="flex-1" onClick={onCancel} disabled={isPending}>
                    취소
                </Button>
                <Button type="submit" size="sm" className="flex-1" disabled={isPending}>
                    {isPending ? <Loader2 className="size-4 animate-spin"/> : '저장'}
                </Button>
            </div>
        </form>
    )
}
