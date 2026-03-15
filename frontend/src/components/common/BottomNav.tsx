'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/feed', icon: Home, label: '홈' },
  { href: '/explore', icon: Compass, label: '탐색' },
  { href: '/profile', icon: User, label: '프로필' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background md:hidden">
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-around px-4">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 p-2 transition-colors',
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('size-7', isActive && 'fill-foreground stroke-foreground')} />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
