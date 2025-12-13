interface SkillBadgeProps {
  skillName: string
  variant?: "default" | "verified" | "required"
  size?: "sm" | "md" | "lg"
}

export function SkillBadge({ skillName, variant = "default", size = "md" }: SkillBadgeProps) {
  const variantClasses = {
    default: "bg-muted text-foreground border-border",
    verified: "bg-success/10 text-success border-success/20",
    required: "bg-primary/10 text-primary border-primary/20",
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  }

  return (
    <span
      className={`
      inline-flex items-center font-medium rounded-md border
      ${variantClasses[variant]}
      ${sizeClasses[size]}
    `}
    >
      {skillName}
    </span>
  )
}
