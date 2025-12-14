"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface EngineerSummary {
  inferred_seniority: string
  core_strengths: string[]
  working_style: string
  collaboration_style: string
}

interface PersonalityCardProps {
  summary: EngineerSummary
}

export function PersonalityCard({ summary }: PersonalityCardProps) {
  const traits = [
    { icon: "👔", label: "Seniority", value: summary.inferred_seniority, color: "bg-primary/10" },
    { icon: "⭐", label: "Strengths", value: summary.core_strengths.join(", ") || "None identified", color: "bg-accent/10" },
    { icon: "🎯", label: "Working Style", value: summary.working_style, color: "bg-secondary/10" },
    { icon: "🤝", label: "Collaboration", value: summary.collaboration_style, color: "bg-warning/10" },
  ]

  return (
    <Card 
      className="h-full border-0 rounded-xl overflow-hidden"
      style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <span>🧠</span>
          Personality
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {traits.map((trait, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl ${trait.color} flex items-center justify-center text-lg shrink-0`}>
              {trait.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{trait.label}</p>
              <p className="text-sm text-foreground font-medium capitalize truncate">{trait.value}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
