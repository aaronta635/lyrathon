"use client"

import { Card } from "@/components/ui/card"
import { SkillBadge } from "./skill-badge"
import type { CandidateBasicInfo, MatchScore } from "@/lib/types"

interface CandidateCardProps {
  candidateInfo: CandidateBasicInfo
  matchScore: MatchScore
  topSkills: string[]
  engineeringType?: string
  availability?: string
  expectedSalary?: number
  onCardClick?: (candidateId: string) => void
}

export function CandidateCard({ candidateInfo, matchScore, topSkills, engineeringType, expectedSalary, onCardClick }: CandidateCardProps) {
  const getScoreBgColor = (score: number) => {
    if (score >= 85) return "bg-success"
    if (score >= 70) return "bg-warning"
    return "bg-destructive"
  }

  const getEngTypeColor = (type: string) => {
    switch (type) {
      case "Full-Stack": return "text-primary border-primary/30"
      case "Frontend": return "text-info border-info/30"
      case "Backend": return "text-success border-success/30"
      case "DevOps": return "text-accent border-accent/30"
      default: return "text-muted-foreground border-border"
    }
  }

  const formatSalary = (salary: number) => `$${Math.round(salary / 1000)}k`

  return (
    <Card
      className="p-5 bg-card transition-all cursor-pointer border-0"
      style={{ 
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)'}
      onClick={() => onCardClick?.(candidateInfo.candidateId)}
    >
      {/* Name + Score */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold text-foreground leading-tight">{candidateInfo.fullName}</h3>
        <span className={`px-2 py-1 rounded text-xs font-semibold text-white shrink-0 ${getScoreBgColor(matchScore.overallScore)}`}>
          {matchScore.overallScore}%
        </span>
      </div>

      {/* Location · Experience · Salary */}
      <p className="text-sm text-muted-foreground mb-4">
        {candidateInfo.location.split(",")[0]} · {candidateInfo.yearsOfExperience}y{expectedSalary ? ` · ${formatSalary(expectedSalary)}` : ""}
      </p>

      {/* Engineering type badge */}
      {engineeringType && (
        <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded border bg-transparent mb-4 ${getEngTypeColor(engineeringType)}`}>
          {engineeringType}
        </span>
      )}

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {topSkills.slice(0, 2).map((skillName, index) => (
          <SkillBadge 
            key={skillName} 
            skillName={skillName} 
            size="sm" 
            variant={index === 0 ? "verified" : "default"}
          />
        ))}
      </div>
    </Card>
  )
}
