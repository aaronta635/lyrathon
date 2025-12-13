interface MatchScoreDisplayProps {
  scorePercentage: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function MatchScoreDisplay({ scorePercentage, size = "md", showLabel = false }: MatchScoreDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success"
    if (score >= 70) return "text-warning"
    return "text-info"
  }

  const sizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl",
  }

  return (
    <div className="flex flex-col items-start">
      <span className={`font-bold ${getScoreColor(scorePercentage)} ${sizeClasses[size]}`}>{scorePercentage}%</span>
      {showLabel && <span className="text-xs text-muted-foreground mt-1">Match Score</span>}
    </div>
  )
}
