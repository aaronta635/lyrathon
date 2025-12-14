interface SkillBadgeProps {
  skillName: string
  variant?: "default" | "verified" | "required" | "matched" | "unmatched"
  size?: "sm" | "md" | "lg"
}

export function SkillBadge({ skillName, variant = "default", size = "md" }: SkillBadgeProps) {
  // Workable-style: clean, professional tags
  const variantClasses = {
    default: "bg-muted text-muted-foreground border-transparent",
    verified: "bg-success/10 text-success border-transparent",
    required: "bg-primary/10 text-primary border-transparent",
    matched: "bg-success/10 text-success border-transparent",
    unmatched: "bg-muted text-muted-foreground border-transparent",
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  }

  return (
    <span
      className={`
      inline-flex items-center font-medium rounded border
      ${variantClasses[variant]}
      ${sizeClasses[size]}
    `}
    >
      {skillName}
    </span>
  )
}
