interface FitLevelBadgeProps {
  fitLevel: "strong" | "moderate" | "weak"
  showLabel?: boolean
}

export function FitLevelBadge({ fitLevel, showLabel = true }: FitLevelBadgeProps) {
  const config = {
    strong: {
      label: "Strong Fit",
      colorClass: "bg-success text-success-foreground",
    },
    moderate: {
      label: "Moderate Fit",
      colorClass: "bg-warning text-warning-foreground",
    },
    weak: {
      label: "Weak Fit",
      colorClass: "bg-info text-info-foreground",
    },
  }

  const { label, colorClass } = config[fitLevel]

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
      {showLabel && label}
    </span>
  )
}
