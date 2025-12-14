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
  borderColorOverride?: string
  onCardClick?: (candidateId: string) => void
}

export function CandidateCard({
  candidateInfo,
  matchScore,
  topSkills,
  engineeringType,
  expectedSalary,
  borderColorOverride,
  onCardClick,
}: CandidateCardProps) {
  // Color-coded match system
  const getScoreColor = (score: number) => {
    if (score >= 90) return "#10B981" // Dark green - Excellent
    if (score >= 70) return "#4ECDC4" // Mint teal - Good
    if (score >= 50) return "#F59E0B" // Amber - Moderate
    return "#FF6B6B" // Coral red - Weak
  }

  const scoreColor = borderColorOverride || getScoreColor(matchScore.overallScore)

  const formatSalary = (salary: number) => `$${Math.round(salary / 1000)}k`

  return (
    <Card
      className="relative bg-card p-6 cursor-pointer transition-all duration-200 border-0 rounded-2xl hover:scale-[1.02]"
      style={{ 
        boxShadow: '0 10px 30px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.06)',
        borderLeft: `4px solid ${scoreColor}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.06)'
      }}
      onClick={() => onCardClick?.(candidateInfo.candidateId)}
    >
      {/* Match score badge - top right */}
      <div 
        className="absolute top-4 right-4 px-4 py-2 rounded-lg text-base font-bold text-white transition-all duration-200 hover:brightness-90"
        style={{ 
          backgroundColor: scoreColor,
          boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
        }}
      >
        {matchScore.overallScore}%
      </div>

      {/* Name */}
      <h3 className="text-lg font-bold text-foreground mb-2 pr-16">{candidateInfo.fullName}</h3>

      {/* Meta info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>{candidateInfo.location.split(",")[0]}</span>
        <span>•</span>
        <span>{candidateInfo.yearsOfExperience}y exp</span>
        {expectedSalary && (
          <>
            <span>•</span>
            <span>{formatSalary(expectedSalary)}</span>
          </>
        )}
      </div>

      {/* Engineering type */}
      {engineeringType && (
        <div className="mb-4">
          <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary">
            {engineeringType}
          </span>
        </div>
      )}

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {topSkills.slice(0, 3).map((skillName, index) => (
          <SkillBadge 
            key={skillName}
            skillName={skillName}
            size="sm"
            variant={index === 0 ? "matched" : "default"}
          />
        ))}
      </div>
    </Card>
  )
}
