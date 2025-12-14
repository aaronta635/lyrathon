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
  // Score colors: red (<50), yellow (50-70), green shades (70+)
  const getScoreColor = (score: number) => {
    if (score < 50) return { bg: "#dc3545", border: "#dc3545", text: "white" } // Red
    if (score < 70) return { bg: "#f5a623", border: "#f5a623", text: "white" } // Yellow
    if (score < 80) return { bg: "#45B7AF", border: "#45B7AF", text: "white" } // Medium teal
    if (score < 90) return { bg: "#3c8d93", border: "#3c8d93", text: "white" } // Darker teal
    return { bg: "#1a5a52", border: "#1a5a52", text: "white" } // Dark teal (90+)
  }

  const scoreColors = getScoreColor(matchScore.overallScore)

  const formatSalary = (salary: number) => `$${Math.round(salary / 1000)}k`

  return (
    <Card
      className="relative bg-card p-6 cursor-pointer transition-all duration-300 border-0 rounded-2xl hover:scale-[1.02]"
      style={{ 
        boxShadow: '0 10px 30px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.06)',
        borderLeft: `4px solid ${scoreColors.border}`,
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
        className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-semibold"
        style={{ backgroundColor: scoreColors.bg, color: scoreColors.text }}
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
