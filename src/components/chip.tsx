import type * as React from 'react'

import { cn } from '@/lib/utils'

export function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        'shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors motion-reduce:transition-none',
        on
          ? 'border-primary bg-primary text-primary-foreground'
          : 'bg-background text-foreground/80 hover:border-primary/50 hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}
