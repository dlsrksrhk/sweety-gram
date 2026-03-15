import {
  Avatar as AvatarRoot,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  username: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_MAP = {
  sm: 'sm',
  md: 'default',
  lg: 'lg',
} as const

export function Avatar({ src, username, size = 'md', className }: AvatarProps) {
  const fallback = username.charAt(0).toUpperCase()

  return (
    <AvatarRoot size={SIZE_MAP[size]} className={cn(className)}>
      {src && <AvatarImage src={src} alt={username} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </AvatarRoot>
  )
}
