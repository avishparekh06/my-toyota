import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card transition-all duration-300 hover:shadow-custom-lg hover:border-[var(--accent)]/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}