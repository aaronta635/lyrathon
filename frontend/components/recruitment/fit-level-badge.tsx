interface FitLevelBadgeProps {
  fitLevel: "strong" | "moderate" | "weak"
  showLabel?: boolean
}

export function FitLevelBadge({ fitLevel, showLabel = true }: FitLevelBadgeProps) {
  const config = {
    strong: {
      label: "Excellent Match",
      bgColor: "#10B981", // Dark green
    },
    moderate: {
      label: "Good Match",
      bgColor: "#4ECDC4", // Mint teal
    },
    weak: {
      label: "Needs Review",
      bgColor: "#F59E0B", // Amber
    },
  }

  const { label, bgColor } = config[fitLevel]

  return (
    <span 
      className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold text-white"
      style={{ 
        backgroundColor: bgColor,
        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
      }}
    >
      {showLabel && label}
    </span>
  )
}
