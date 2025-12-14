"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Lightbulb, ArrowRight } from "lucide-react"

interface RecommendationsCardProps {
  recommendations: string[]
}

export function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  if (recommendations.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-info" />
          Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {recommendations.map((rec, index) => (
          <div key={index} className="flex items-start gap-3">
            <ArrowRight className="h-4 w-4 text-info mt-0.5 shrink-0" />
            <p className="text-sm text-foreground">{rec}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

