import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertCircle, XCircle } from "lucide-react"

interface RisksCardProps {
  risks: string[]
}

export function RisksCard({ risks }: RisksCardProps) {
  if (risks.length === 0) return null

  return (
    <Card className="h-full border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-destructive">
          <AlertCircle className="h-5 w-5" />
          Risks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {risks.map((risk, index) => (
          <div key={index} className="flex items-center gap-3">
            <XCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-foreground">{risk}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

