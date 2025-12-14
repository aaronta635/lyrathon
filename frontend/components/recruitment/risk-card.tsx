import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertTriangle, XCircle } from "lucide-react"
import type { RiskInfo } from "@/lib/types"

interface RiskCardProps {
  risks: RiskInfo[]
}

export function RiskCard({ risks }: RiskCardProps) {
  // Limit to 3 key risks
  const displayRisks = risks.slice(0, 3)

  const getSeverityColor = (severity: RiskInfo["severity"]) => {
    switch (severity) {
      case "high":
        return "text-destructive"
      case "medium":
        return "text-warning"
      case "low":
        return "text-muted-foreground"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card className="flex flex-col h-full w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5" />
          Risk
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-2.5 pt-0">
        {displayRisks.map((risk) => (
          <div key={risk.riskId} className="flex items-start gap-3">
            <div className="p-1.5 rounded-full bg-muted flex-shrink-0">
              <XCircle className={`h-4 w-4 ${getSeverityColor(risk.severity)}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground mb-0.5">{risk.riskTitle}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{risk.riskDescription}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

