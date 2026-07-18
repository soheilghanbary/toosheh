import Link from 'next/link'
import { Logo } from 'shared/assets/logo'
import { ModeToggle } from 'shared/components/mode-toggle'

export const Navbar = () => {
  return (
    <header className="container flex items-center justify-between p-4">
      <Link
        href="/"
        className="text-primary text-xl tracking-tight dark:text-foreground"
      >
        <Logo />
      </Link>
      <ModeToggle />
    </header>
  )
}
