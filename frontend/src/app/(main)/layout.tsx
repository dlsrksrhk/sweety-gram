import {Header} from '@/components/common/Header'
import {BottomNav} from '@/components/common/BottomNav'

export default function MainLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen">
            <Header/>
            <div className="mx-auto max-w-2xl md:max-w-3xl lg:max-w-4xl px-0 md:px-6">
                <main className="pb-20 md:pb-8">{children}</main>
            </div>
            <BottomNav/>
        </div>
    )
}
