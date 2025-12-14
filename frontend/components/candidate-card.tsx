"use client"

import { Card } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { SkillBadge } from "./skill-badge"
import { FitLevelBadge } from "./fit-level-badge"
import { MatchScoreDisplay } from "./match-score-display"
import type { CandidateBasicInfo, MatchScore } from "@/lib/types"

interface CandidateCardProps {
  candidateInfo: CandidateBasicInfo
  matchScore: MatchScore
  topSkills: string[]
  onCardClick?: (candidateId: string) => void
}

export function CandidateCard({ candidateInfo, matchScore, topSkills, onCardClick }: CandidateCardProps) {
  return (
    <Card
      className="p-6 hover:shadow-lg transition-all cursor-pointer hover:border-primary"
      onClick={() => onCardClick?.(candidateInfo.candidateId)}
    >
      {/* Candidate header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">{candidateInfo.fullName}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{candidateInfo.location}</span>
          </div>
        </div>
        <MatchScoreDisplay scorePercentage={matchScore.overallScore} size="md" />
      </div>

      {/* Fit level badge */}
      <div className="mb-4">
        <FitLevelBadge fitLevel={matchScore.fitLevel} />
      </div>

      {/* Experience info */}
      <p className="text-sm text-muted-foreground mb-4">{candidateInfo.yearsOfExperience} years exp</p>

      {/* Top skills */}
      <div className="flex flex-wrap gap-2">
        {topSkills.slice(0, 3).map((skillName) => (
          <SkillBadge key={skillName} skillName={skillName} size="sm" />
        ))}
      </div>
    </Card>
  )
}
