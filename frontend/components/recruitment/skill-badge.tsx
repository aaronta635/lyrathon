interface SkillBadgeProps {
  skillName: string
  variant?: "default" | "verified" | "required" | "matched" | "unmatched"
  size?: "sm" | "md" | "lg"
}

export function SkillBadge({ skillName, variant = "default", size = "md" }: SkillBadgeProps) {
  // Minimal teal-based color system
  const variantClasses = {
    default: "bg-muted text-foreground",
    verified: "bg-accent/15 text-accent",
    required: "bg-primary/15 text-primary",
    matched: "bg-accent/15 text-accent",
    unmatched: "bg-muted text-muted-foreground",
  }

  const sizeClasses = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5",
  }

  return (
    <span
      className={`
      inline-flex items-center font-medium rounded-lg
      ${variantClasses[variant]}
      ${sizeClasses[size]}
    `}
    >
      {skillName}
    </span>
  )
}
