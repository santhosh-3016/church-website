import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 hover:shadow-lg",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-105",
                outline:
                    "border-2 border-input bg-transparent hover:bg-accent hover:text-accent-foreground hover:border-accent",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                // Church-specific variants
                hero: "bg-church-gold text-foreground font-semibold hover:bg-church-gold/90 shadow-soft hover:shadow-elevated hover:scale-105",
                "hero-outline": "border-2 border-primary-foreground text-primary-foreground bg-transparent backdrop-blur-sm hover:bg-primary-foreground/20 hover:scale-105",
                church: "bg-primary text-primary-foreground hover:bg-church-blue shadow-soft hover:shadow-elevated hover:scale-105",
                "church-outline": "border-2 border-primary text-primary bg-transparent backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:scale-105",
                glass: "bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 hover:scale-105 shadow-lg",
                admin: "bg-gradient-to-r from-church-gold to-church-gold-muted text-foreground font-semibold hover:from-church-gold/90 hover:to-church-gold-muted/90 shadow-soft hover:shadow-elevated hover:scale-105",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 px-3 text-xs",
                lg: "h-11 px-8",
                xl: "h-12 px-10 text-base rounded-full",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
        <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button, buttonVariants }
