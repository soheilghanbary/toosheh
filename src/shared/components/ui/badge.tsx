import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type * as React from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'flex h-7 items-center justify-center gap-1 rounded-full border p-3 text-foreground/80 text-xs duration-200 active:scale-95 [&>svg]:pointer-events-none [&>svg]:size-4',
  {
    variants: {
      variant: {
        primary: 'border-primary bg-primary text-primary-foreground',
        default: 'bg-muted',
        outline: 'bg-card',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
