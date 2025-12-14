"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { User, Briefcase, Sparkles, Users, Wrench } from "lucide-react"

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
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-primary" />
          Personality
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3">
          <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Seniority</p>
            <p className="text-sm text-foreground capitalize">{summary.inferred_seniority}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Sparkles className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Core Strengths</p>
            <p className="text-sm text-foreground">{summary.core_strengths.join(", ") || "None identified"}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Wrench className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Working Style</p>
            <p className="text-sm text-foreground capitalize">{summary.working_style}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Users className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Collaboration</p>
            <p className="text-sm text-foreground capitalize">{summary.collaboration_style}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

