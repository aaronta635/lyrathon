interface MatchScoreDisplayProps {
  scorePercentage: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

// Color-coded match system
const getScoreColor = (score: number) => {
  if (score >= 90) return "#10B981" // Dark green - Excellent
  if (score >= 70) return "#4ECDC4" // Mint teal - Good
  if (score >= 50) return "#F59E0B" // Amber - Moderate
  return "#FF6B6B" // Coral red - Weak
}

export function MatchScoreDisplay({ scorePercentage, size = "md", showLabel = false }: MatchScoreDisplayProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl",
  }

  return (
    <div className="flex flex-col items-start">
      <span 
        className={`font-bold ${sizeClasses[size]}`}
        style={{ color: getScoreColor(scorePercentage) }}
      >
        {scorePercentage}%
      </span>
      {showLabel && <span className="text-xs text-muted-foreground mt-1">Match Score</span>}
    </div>
  )
}
