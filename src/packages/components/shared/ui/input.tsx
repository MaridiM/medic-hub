import { ComponentProps, forwardRef } from 'react'

import { cn } from '@/packages/utils'

const Input = forwardRef<HTMLInputElement, ComponentProps<'input'>>(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                'border-border/20 bg-card text-p-sm file:text-p-sm file:text-foreground placeholder:text-muted-foreground md:text-p-sm flex h-10 w-full overflow-hidden rounded-md border px-4 pt-[9px] pb-2 file:border-0 file:bg-transparent file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                // 'aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive border-border/20 bg-card text-p-sm file:text-p-sm file:text-foreground placeholder:text-muted-foreground md:text-p-sm flex h-10 w-full overflow-hidden rounded-md border px-4 pt-[9px] pb-2 file:border-0 file:bg-transparent file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Input.displayName = 'Input'

export { Input }
