import type React from "react"
import { cn } from "@/lib/utils"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-2 border-green-600",
        className
      )}
      style={{ width: "1.5rem", height: "1.5rem" }}
      {...props}
    />
  )
}

