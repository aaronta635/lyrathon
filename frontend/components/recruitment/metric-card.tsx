import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  metricTitle: string
  metricValue: string | number
  metricChange?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  iconBackgroundColor?: string
}

export function MetricCard({
  metricTitle,
  metricValue,
  metricChange,
  changeType = "neutral",
  icon: Icon,
  iconBackgroundColor = "bg-primary",
}: MetricCardProps) {
  const changeColorClass = {
    positive: "text-success",
    negative: "text-destructive",
    neutral: "text-muted-foreground",
  }[changeType]

  return (
    <Card className="p-3 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${iconBackgroundColor}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-bold text-foreground">{metricValue}</p>
            <p className="text-xs text-muted-foreground truncate">{metricTitle}</p>
          </div>
          {metricChange && <p className={`text-xs ${changeColorClass} truncate`}>{metricChange}</p>}
        </div>
      </div>
    </Card>
  )
}
