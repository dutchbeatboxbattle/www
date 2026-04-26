import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white hover:from-[#FF8533] hover:to-[#FF6B00] shadow-lg hover:shadow-[0_0_30px_rgba(255,107,0,0.4)]",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border-2 border-[#FF6B00] bg-transparent text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-[#FF6B00] underline-offset-4 hover:underline",
                white:
                    "bg-white text-black hover:bg-gray-100 shadow-lg",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 rounded-md px-4 text-xs",
                lg: "h-14 rounded-md px-10 text-base",
                xl: "h-16 rounded-lg px-12 text-lg",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
