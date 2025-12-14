import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Star, CheckCircle } from "lucide-react"

interface StrengthsCardProps {
  strengths: string[]
}

export function StrengthsCard({ strengths }: StrengthsCardProps) {
  if (strengths.length === 0) return null

  return (
    <Card className="h-full border-success/50 bg-success/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-success">
          <Star className="h-5 w-5" />
          Strengths
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {strengths.map((strength, index) => (
          <div key={index} className="flex items-center gap-3">
            <CheckCircle className="h-4 w-4 text-success" />
            <p className="text-sm text-foreground">{strength}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

