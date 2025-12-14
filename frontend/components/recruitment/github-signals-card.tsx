import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { TrendingUp, CheckCircle } from "lucide-react"
import type { GitHubMetrics } from "@/lib/types"

interface GitHubSignalsCardProps {
  githubMetrics: GitHubMetrics
}

export function GitHubSignalsCard({ githubMetrics }: GitHubSignalsCardProps) {
  const signalItems = [
    {
      label: "Consistent commits",
      description: githubMetrics.commitFrequency,
      isPositive: true,
    },
    {
      label: "Code quality",
      description: `High test coverage, ${githubMetrics.hasDocumentation ? "documented" : "needs documentation"}`,
      isPositive: githubMetrics.codeQualityScore >= 70,
    },
    {
      label: "Activity trend",
      description: `${githubMetrics.activityTrend.charAt(0).toUpperCase() + githubMetrics.activityTrend.slice(1)} over time`,
      isPositive: githubMetrics.activityTrend !== "decreasing",
    },
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" />
          GitHub Signals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {signalItems.map((item, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background shadow-sm border">
            <div className={`p-1 rounded-full ${item.isPositive ? "bg-success/10" : "bg-muted"}`}>
              <CheckCircle className={`h-4 w-4 ${item.isPositive ? "text-success" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
