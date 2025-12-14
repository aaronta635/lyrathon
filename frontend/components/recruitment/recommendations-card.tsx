"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

interface RecommendationsCardProps {
  recommendations: string[]
}

export function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  if (recommendations.length === 0) return null

  return (
    <Card 
      className="border-0 rounded-xl overflow-hidden"
      style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Hiring Decision Points</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {recommendations.map((rec, index) => {
          const icon = rec.toLowerCase().includes("benefit") || rec.toLowerCase().includes("fit")
            ? <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            : rec.toLowerCase().includes("risk") || rec.toLowerCase().includes("gap")
            ? <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
            : <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />

          return (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              {icon}
              <p className="text-sm text-foreground">{rec}</p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
