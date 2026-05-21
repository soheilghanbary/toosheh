import type { ReactNode } from 'react'

interface FeatureCardProps {
  svg: ReactNode // برای دریافت آیکون یا کامپوننت SVG
  title: string // عنوان
  description: string // توضیح کوتاه
  isComingSoon?: boolean // ورودی جدید (اختیاری)
}

export const FeatureCard = ({
  svg,
  title,
  description,
  isComingSoon = false,
}: FeatureCardProps) => {
  return (
    <div className="flex items-center gap-x-3 rounded-xl bg-muted p-4 dark:bg-card">
      <div className="flex items-center justify-center rounded-md p-2">
        {svg}
      </div>
      <div className="flex flex-col gap-y-2">
        <h3 className="font-medium text-foreground text-xs">
          {title}{' '}
          {isComingSoon && (
            <span className="text-destructive text-xs">(به زودی)</span>
          )}
        </h3>
        <p className="text-muted-foreground text-xs/4.5 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}
