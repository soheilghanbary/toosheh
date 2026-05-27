import Link from 'next/link'
import type { ReactNode } from 'react'
import { ModeToggle } from 'shared/components/mode-toggle'

const NavLink = ({ href, children }: { href: string; children: ReactNode }) => {
  return (
    <Link
      href={href}
      className="rounded-md px-4 py-2 font-medium text-muted-foreground text-sm transition-all hover:bg-muted/40 hover:text-foreground"
    >
      <span>{children}</span>
    </Link>
  )
}

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-background backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2 font-bold text-xl tracking-tight"
        >
          <span>توشه</span>
        </Link>
        <div className="hidden items-center gap-1 sm:flex">
          <NavLink href={'/create'}>ایجاد کلیپ بورد</NavLink>
          <NavLink href={'/track'}>رهگیری کد</NavLink>
          <NavLink href={'/about'}>درباره ما</NavLink>
        </div>
        <ModeToggle />
      </div>
    </header>
  )
}
