"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, ArrowLeft, CheckCircle, XCircle, FileText } from "lucide-react"
import { MatchScoreDisplay } from "./match-score-display"
import { FitLevelBadge } from "./fit-level-badge"
import { SkillBadge } from "./skill-badge"
import { BuiltProjectsCard } from "./built-projects-card"
import { PersonalityCard } from "./personality-card"
import { RecommendationsCard } from "./recommendations-card"
import type { CandidateFullProfile } from "@/lib/types"

interface CandidateDetailModalProps {
  isOpen: boolean
  onClose: () => void
  candidateProfile: CandidateFullProfile | null
  jobRequiredSkills?: string[] // To determine matched vs unmatched skills
  onMoveToInterview?: (candidateId: string) => void
  onReject?: (candidateId: string) => void
  onViewResume?: (resumeUrl: string) => void
}

export function CandidateDetailModal({
  isOpen,
  onClose,
  candidateProfile,
  jobRequiredSkills = [],
  onMoveToInterview,
  onReject,
  onViewResume,
}: CandidateDetailModalProps) {
  if (!candidateProfile) return null

  const { basicInfo, matchScore, skills, projects, hiringRecommendation, engineerSummary, recommendations, resumeUrl } = candidateProfile

  // Check if skill matches job requirements
  const isSkillMatched = (skillName: string) => {
    if (jobRequiredSkills.length === 0) return true // If no job skills specified, all are "matched"
    return jobRequiredSkills.some(reqSkill => 
      skillName.toLowerCase().includes(reqSkill.toLowerCase()) ||
      reqSkill.toLowerCase().includes(skillName.toLowerCase())
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[700px] !w-[700px] max-h-[90vh] overflow-y-auto p-8 border-0" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
        {/* Back button - separate row */}
        <div className="border-b border-border pb-4 mb-6">
          <Button variant="ghost" size="sm" onClick={onClose} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Back to candidates
          </Button>
        </div>

        <DialogHeader className="sr-only">
          <DialogTitle>{basicInfo.fullName}</DialogTitle>
        </DialogHeader>

        {/* Candidate info card */}
        <Card className="mb-6 border-0" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)' }}>
          <CardContent className="p-6">
            {/* Header with name, location, experience and match score */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">{basicInfo.fullName}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{basicInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{basicInfo.yearsOfExperience}y exp</span>
                  </div>
                  <button
                    onClick={() => onViewResume?.(resumeUrl)}
                    className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    <FileText className="h-4 w-4" />
                    <span>View Resume</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <MatchScoreDisplay scorePercentage={matchScore.overallScore} size="md" />
                <FitLevelBadge fitLevel={matchScore.fitLevel} />
              </div>
            </div>

            {/* Hiring Recommendation (from GitHub analyzer) */}
            <div className="mb-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Hiring Recommendation</h3>
              <p className="text-sm text-foreground leading-relaxed">{hiringRecommendation}</p>
            </div>

            {/* Skills section - green = matched, gray = unmatched */}
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <SkillBadge
                  key={skill.skillName}
                  skillName={skill.skillName}
                  variant={isSkillMatched(skill.skillName) ? "matched" : "unmatched"}
                  size="sm"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects and Personality Analysis grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BuiltProjectsCard
            projects={projects}
            onViewProject={(projectId) => console.log("View project:", projectId)}
          />
          {engineerSummary && (
            <PersonalityCard summary={engineerSummary} />
          )}
        </div>

        {/* Recommendations section */}
        {recommendations && recommendations.length > 0 && (
          <div className="mb-6">
            <RecommendationsCard recommendations={recommendations} />
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <Button variant="outline" size="default" onClick={() => onReject?.(basicInfo.candidateId)} className="text-destructive border-destructive/30 hover:bg-destructive/5">
            <XCircle className="h-4 w-4 mr-2" />
            Reject Candidate
          </Button>
          <Button
            size="default"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            onClick={() => onMoveToInterview?.(basicInfo.candidateId)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Move to Interview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
