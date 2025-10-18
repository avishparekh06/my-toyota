import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </div>
  )
}