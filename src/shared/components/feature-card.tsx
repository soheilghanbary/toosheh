import type { Route } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'

interface FeatureCardProps {
  svg: ReactNode // برای دریافت آیکون یا کامپوننت SVG
  title: string // عنوان
  description: string // توضیح کوتاه
  link: Route // آدرس لینک
  isComingSoon?: boolean // ورودی جدید (اختیاری)
}

export const FeatureCard = ({
  svg,
  title,
  description,
  link,
  isComingSoon = false,
}: FeatureCardProps) => {
  return (
    <Link
      href={link}
      className="flex items-center gap-x-3 rounded-lg px-0 py-2"
    >
      <div className="flex items-center justify-center rounded-md border p-4">
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
    </Link>
  )
}
