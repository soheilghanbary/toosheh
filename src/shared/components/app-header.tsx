import { Activity } from 'react'
import { BackButton } from '@/shared/components/back-button'

type Props = {
  title: string
  leftChild?: React.ReactNode
  hideBackButton?: boolean
}

export function AppHeader({ title, leftChild, hideBackButton }: Props) {
  return (
    <header className="relative flex min-h-14 items-center justify-between bg-card px-3 py-2">
      <Activity mode={hideBackButton ? 'hidden' : 'visible'}>
        <BackButton />
      </Activity>
      <h1 className="absolute left-1/2 -translate-x-1/2 font-medium text-sm">
        {title}
      </h1>
      {leftChild}
    </header>
  )
}
