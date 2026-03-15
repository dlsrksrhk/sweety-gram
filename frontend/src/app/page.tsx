import Link from 'next/link'
import {Camera} from 'lucide-react'
import {Button} from '@/components/ui/button'

export default function LandingPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
            <div className="flex flex-col items-center gap-4">
                <div className="flex h-28 w-28 md:h-36 md:w-36 items-center justify-center rounded-full bg-primary/10">
                    <Camera className="h-14 w-14 md:h-18 md:w-18 text-primary"/>
                </div>
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Sweety Gram</h1>
                    <p className="mt-2 text-base md:text-lg text-muted-foreground">달콤한 순간을 공유하세요</p>
                </div>
            </div>
            <div className="flex w-full max-w-xs md:max-w-sm flex-col gap-3">
                <Link href="/login" className="w-full">
                    <Button className="w-full">로그인</Button>
                </Link>
                <Link href="/register" className="w-full">
                    <Button variant="outline" className="w-full">회원가입</Button>
                </Link>
            </div>
        </main>
    )
}
