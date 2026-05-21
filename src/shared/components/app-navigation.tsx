'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  AddCircleBoldIcon,
  AddCircleIcon,
  HomeBoldIcon,
  HomeIcon,
  SearchIcon,
  UsersBoldIcon,
  UsersIcon,
} from '@/shared/assets/icons'
import { cn } from '@/shared/lib/utils'

const navItems = [
  {
    href: '/',
    label: 'خانه',
    icon: HomeIcon,
    activeIcon: HomeBoldIcon,
  },
  {
    href: '/create',
    label: 'ایجاد کلیپ برد',
    icon: AddCircleIcon,
    activeIcon: AddCircleBoldIcon,
  },
  {
    href: '/track',
    label: 'رهگیری کد',
    icon: SearchIcon,
    activeIcon: SearchIcon,
  },
  {
    href: '/about',
    label: 'درباره ما',
    icon: UsersIcon,
    activeIcon: UsersBoldIcon,
  },
]

const NavigationItem = ({
  href,
  label,
  icon,
  activeIcon,
}: (typeof navItems)[0]) => {
  const pathname = usePathname()
  const active = pathname === href
  const IconComponent = active ? activeIcon : icon

  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center gap-1 text-muted-foreground',
        active && 'text-primary'
      )}
    >
      <IconComponent className="size-6" />
      <p className="font-medium text-xs">{label}</p>
    </Link>
  )
}

export const AppNavigation = () => {
  return (
    <footer className="fixed inset-x-0 bottom-0 left-0 z-10 border-t bg-card/95 backdrop-blur-lg sm:hidden">
      <section className="grid w-full grid-cols-4 gap-x-3 px-3 py-2.5">
        {navItems.map((item) => (
          <NavigationItem key={item.href} {...item} />
        ))}
      </section>
    </footer>
  )
}
