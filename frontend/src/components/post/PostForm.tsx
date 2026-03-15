'use client'

import {useState, useRef, useCallback} from 'react'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {ImagePlus, X, Loader2} from 'lucide-react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {createPostSchema, type CreatePostFormData} from '@/lib/schemas/post-schema'
import {useCreatePost} from '@/lib/hooks/use-create-post'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_CAPTION = 2200

export default function PostForm() {
    const router = useRouter()
    const {mutate: createPost, isPending} = useCreatePost()
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [fileError, setFileError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const {register, handleSubmit, watch, formState: {errors}} = useForm<CreatePostFormData>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {caption: ''},
    })
    const caption = watch('caption')

    const handleFile = useCallback((file: File) => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            setFileError('JPG, PNG, WEBP 형식만 업로드할 수 있습니다.')
            return
        }
        setFileError(null)
        setImageFile(file)
        setPreviewUrl(URL.createObjectURL(file))
    }, [])

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
    }, [handleFile])

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
    }

    const removeImage = () => {
        setImageFile(null)
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const onSubmit = (data: CreatePostFormData) => {
        if (!imageFile) return
        const formData = new FormData()
        formData.append('image', imageFile)
        formData.append('caption', data.caption)
        createPost(formData)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 px-4 py-6">
            {/* 이미지 업로드 영역 */}
            {previewUrl ? (
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
                    <Image
                        src={previewUrl}
                        alt="미리보기"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 672px"
                    />
                    <button
                        type="button"
                        onClick={removeImage}
                        aria-label="이미지 제거"
                        className="absolute right-3 top-3 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
                    >
                        <X className="size-4"/>
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={onDrop}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    className={cn(
                        'flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors',
                        isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    )}
                >
                    <ImagePlus className="size-10 text-muted-foreground"/>
                    <div className="text-center">
                        <p className="text-sm font-medium">이미지를 드래그하거나 클릭하여 업로드</p>
                        <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WEBP</p>
                    </div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onFileChange}
            />

            {fileError && (
                <p className="text-sm text-destructive">{fileError}</p>
            )}

            {/* 캡션 입력 */}
            <div className="flex flex-col gap-1.5">
        <textarea
            {...register('caption')}
            placeholder="캡션을 입력하세요..."
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
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    disabled={isPending}
                    onClick={() => router.back()}
                >
                    취소
                </Button>
                <Button
                    type="submit"
                    className="flex-1"
                    disabled={!imageFile || isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="size-4 animate-spin"/>
                            업로드 중...
                        </>
                    ) : (
                        '공유하기'
                    )}
                </Button>
            </div>
        </form>
    )
}
