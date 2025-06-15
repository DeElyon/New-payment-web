import { cn } from "@/lib/utils"

interface AnimatedLoaderProps {
  size?: "sm" | "md" | "lg"
  className?: string
  variant?: "spinner" | "dots" | "pulse" | "wave"
}

export function AnimatedLoader({ size = "md", className, variant = "spinner" }: AnimatedLoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  if (variant === "spinner") {
    return (
      <div className={cn("relative", sizeClasses[size], className)}>
        <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex space-x-1", className)}>
        <div
          className={cn(
            "rounded-full bg-blue-600 animate-bounce",
            size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4",
          )}
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className={cn(
            "rounded-full bg-purple-600 animate-bounce",
            size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4",
          )}
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className={cn(
            "rounded-full bg-green-600 animate-bounce",
            size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4",
          )}
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div
        className={cn(
          "rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse",
          sizeClasses[size],
          className,
        )}
      ></div>
    )
  }

  if (variant === "wave") {
    return (
      <div className={cn("flex items-end space-x-1", className)}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "bg-gradient-to-t from-blue-600 to-purple-600 animate-pulse",
              size === "sm" ? "w-1" : size === "md" ? "w-2" : "w-3",
              size === "sm" ? "h-4" : size === "md" ? "h-6" : "h-8",
            )}
            style={{
              animationDelay: `${i * 100}ms`,
              animationDuration: "1s",
              animationIterationCount: "infinite",
              animationDirection: "alternate",
            }}
          ></div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800"></div>
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
    </div>
  )
}
