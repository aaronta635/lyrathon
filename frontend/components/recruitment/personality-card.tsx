"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Briefcase, Star, Users } from "lucide-react"
import type { EngineerSummary } from "@/lib/types"

interface PersonalityCardProps {
  summary: EngineerSummary
}

export function PersonalityCard({ summary }: PersonalityCardProps) {
  const traits = [
    { key: "seniority", label: "SENIORITY", value: summary.inferred_seniority },
    { key: "strengths", label: "STRENGTHS", value: summary.core_strengths.join(", ") || "None identified" },
    { key: "workingStyle", label: "WORKING STYLE", value: summary.working_style },
    { key: "collaboration", label: "COLLABORATION", value: summary.collaboration_style },
  ] as const

  return (
    <Card 
      className="h-full border-0 rounded-xl overflow-hidden"
      style={{ 
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        borderLeft: '4px solid #4ECDC4'
      }}
    >
      <CardHeader className="pb-2 pt-4 px-5">
        <CardTitle className="text-base font-semibold">Personality</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-5 pb-4">
        {traits.map((trait, index) => {
          const Icon = index === 0 ? Briefcase : index === 1 ? Star : Users
          return (
            <div key={trait.key} className="flex items-start gap-3 pb-2 border-b border-border last:border-b-0 last:pb-0">
              <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">{trait.label}</p>
                <p className="text-sm text-foreground font-medium">{trait.value}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
