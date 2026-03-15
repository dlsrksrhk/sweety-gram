import PostForm from '@/components/post/PostForm'

export const metadata = {title: '새 게시물 — SweetyGram'}

export default function NewPostPage() {
    return (
        <div className="mx-auto max-w-lg">
            <PostForm/>
        </div>
    )
}
