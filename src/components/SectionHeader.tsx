import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeader({ eyebrow, title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn("text-center", className)}>
      {eyebrow && (
        <p className="text-[12px] font-medium text-[var(--accent)] uppercase tracking-[0.12em] mb-4">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}