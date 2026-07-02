import Link from 'next/link'
import { ModeToggle } from 'shared/components/mode-toggle'

export const Navbar = () => {
  return (
    <header className="flex items-center justify-between py-4">
      <Link
        href="/"
        className="flex items-center space-x-2 font-bold text-xl tracking-tight"
      >
        <span>توشه</span>
      </Link>
      <ModeToggle />
    </header>
  )
}
