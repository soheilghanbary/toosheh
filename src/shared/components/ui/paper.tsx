import { cn } from '@/shared/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
}

export function Paper({ children, className }: Props) {
  return (
    <div className={cn('grid gap-y-4 bg-card p-4', className)}>{children}</div>
  )
}
