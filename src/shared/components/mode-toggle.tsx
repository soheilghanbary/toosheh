'use client'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <Button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        buttonVariants({ variant: 'secondary', size: 'icon' }),
        'size-10'
      )}
    >
      <MoonIcon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <SunIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
