import { clsx } from 'cnfast'
import type { ReactNode } from 'react'

interface FeatureCardProps {
  svg: ReactNode
  title: string
  description: string
  isComingSoon?: boolean
  className?: string
}

export const FeatureCard = ({
  svg,
  title,
  description,
  isComingSoon = false,
  className,
}: FeatureCardProps) => {
  return (
    <div
      className={clsx(
        'group relative flex flex-col gap-4 rounded-2xl border bg-card p-5 transition-all duration-300',
        'hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg',
        'backdrop-blur-sm dark:bg-card/60',
        className
      )}
    >
      {/* Badge */}
      {isComingSoon && (
        <span className="absolute top-3 right-3 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-[10px] text-primary">
          به زودی
        </span>
      )}

      {/* Icon */}
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-110">
        {svg}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-foreground text-sm leading-tight">
          {title}
        </h3>

        <p className="text-muted-foreground text-xs leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}
