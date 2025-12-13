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
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{metricTitle}</p>
          <p className="text-3xl font-bold text-foreground mb-1">{metricValue}</p>
          {metricChange && <p className={`text-sm font-medium ${changeColorClass}`}>{metricChange}</p>}
        </div>
        <div className={`p-3 rounded-lg ${iconBackgroundColor}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  )
}
