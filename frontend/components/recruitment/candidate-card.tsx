"use client"

import { Card } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { SkillBadge } from "./skill-badge"
import type { CandidateBasicInfo, MatchScore } from "@/lib/types"

interface CandidateCardProps {
  candidateInfo: CandidateBasicInfo
  matchScore: MatchScore
  topSkills: string[]
  engineeringType?: string
  onCardClick?: (candidateId: string) => void
}

export function CandidateCard({ candidateInfo, matchScore, topSkills, engineeringType, onCardClick }: CandidateCardProps) {
  const getScoreBgColor = (score: number) => {
    if (score >= 85) return "bg-success"
    if (score >= 70) return "bg-warning"
    return "bg-destructive"
  }

  const getEngTypeColor = (type: string) => {
    switch (type) {
      case "Full-Stack": return "bg-primary/10 text-primary"
      case "Frontend": return "bg-info/10 text-info"
      case "Backend": return "bg-success/10 text-success"
      case "DevOps": return "bg-warning/10 text-warning"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card
      className="p-3 hover:shadow-lg transition-all cursor-pointer hover:border-primary"
      onClick={() => onCardClick?.(candidateInfo.candidateId)}
    >
      {/* Header: Name + Score */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-foreground truncate flex-1 mr-2">{candidateInfo.fullName}</h3>
        <span className={`px-2 py-0.5 rounded text-sm font-bold text-white ${getScoreBgColor(matchScore.overallScore)}`}>
          {matchScore.overallScore}%
        </span>
      </div>

      {/* Engineering type badge */}
      {engineeringType && (
        <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded mb-1 ${getEngTypeColor(engineeringType)}`}>
          {engineeringType}
        </span>
      )}

      {/* Location + Experience */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="flex items-center">
          <MapPin className="h-3 w-3 mr-0.5" />
          <span>{candidateInfo.location}</span>
        </div>
        <span>•</span>
        <span>{candidateInfo.yearsOfExperience}y exp</span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-0.5 mt-1.5">
        {topSkills.slice(0, 3).map((skillName, index) => (
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
