import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "default" | "outline" | "ghost"
}

export function PrimaryButton({ children, className, variant = "default", ...props }: PrimaryButtonProps) {
  return (
    <Button
      className={cn(
        "primary-button transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}