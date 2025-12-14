"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

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
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <span>💡</span>
          Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {recommendations.map((rec, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <ArrowRight className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
            <p className="text-sm text-foreground">{rec}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
