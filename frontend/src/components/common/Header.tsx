'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PlusSquare, LogOut, Home, Compass, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/lib/hooks/use-auth'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/feed', icon: Home, label: '홈' },
  { href: '/explore', icon: Compass, label: '탐색' },
  { href: '/profile', icon: User, label: '프로필' },
]

export function Header() {
  const { mutate: logout, isPending } = useLogout()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 md:h-16 max-w-2xl md:max-w-3xl lg:max-w-4xl items-center justify-between px-4 md:px-6">
        <Link href="/feed" className="text-xl md:text-2xl font-bold tracking-tight">
          sweetygram
        </Link>

        {/* PC 네비게이션 (md 이상) */}
        <nav className="hidden md:flex items-center gap-2">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link key={href} href={href} aria-label={label}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn('size-10', isActive && 'text-foreground bg-muted')}
                >
                  <Icon className="size-6" />
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link href="/post/new" aria-label="새 게시물 작성">
            <Button variant="ghost" size="icon-sm" className="md:size-10">
              <PlusSquare className="size-5 md:size-6" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:size-10"
            aria-label="로그아웃"
            disabled={isPending}
            onClick={() => logout()}
          >
            <LogOut className="size-5 md:size-6" />
          </Button>
        </div>
      </div>
    </header>
  )
}
