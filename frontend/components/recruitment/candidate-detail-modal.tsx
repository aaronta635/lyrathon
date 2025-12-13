"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { MatchScoreDisplay } from "./match-score-display"
import { FitLevelBadge } from "./fit-level-badge"
import { SkillBadge } from "./skill-badge"
import { BuiltProjectsCard } from "./built-projects-card"
import { GitHubSignalsCard } from "./github-signals-card"
import type { CandidateFullProfile } from "@/lib/types"

interface CandidateDetailModalProps {
  isOpen: boolean
  onClose: () => void
  candidateProfile: CandidateFullProfile | null
  onMoveToInterview?: (candidateId: string) => void
  onReject?: (candidateId: string) => void
  onViewResume?: (resumeUrl: string) => void
}

export function CandidateDetailModal({
  isOpen,
  onClose,
  candidateProfile,
  onMoveToInterview,
  onReject,
  onViewResume,
}: CandidateDetailModalProps) {
  if (!candidateProfile) return null

  const { basicInfo, matchScore, skills, projects, githubMetrics, professionalSummary, resumeUrl } = candidateProfile

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[95vw] !w-[95vw] max-h-[95vh] h-[95vh] overflow-y-auto p-8">
        {/* Back button */}
        <Button variant="ghost" size="sm" onClick={onClose} className="absolute left-8 top-8 flex items-center gap-2 z-10">
          <ArrowLeft className="h-4 w-4" />
          Back to candidates
        </Button>

        <DialogHeader className="mt-8 pr-8">
          {/* Candidate header with match score */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <DialogTitle className="text-3xl font-bold mb-2">{basicInfo.fullName}</DialogTitle>
              <div className="flex items-center gap-4 text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{basicInfo.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{basicInfo.yearsOfExperience} years experience</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <MatchScoreDisplay scorePercentage={matchScore.overallScore} size="lg" />
              <FitLevelBadge fitLevel={matchScore.fitLevel} />
            </div>
          </div>

          {/* Professional summary */}
          <p className="text-base text-muted-foreground leading-relaxed">{professionalSummary}</p>
        </DialogHeader>

        <Separator className="my-8" />

        {/* Skills section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Skills</h3>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <SkillBadge
                key={skill.skillName}
                skillName={skill.skillName}
                variant={skill.isVerified ? "verified" : "default"}
              />
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Projects and GitHub signals grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="min-w-0">
            <BuiltProjectsCard
              projects={projects}
              onViewProject={(projectId) => console.log("View project:", projectId)}
            />
          </div>
          {githubMetrics && (
            <div className="min-w-0">
              <GitHubSignalsCard githubMetrics={githubMetrics} />
            </div>
          )}
        </div>

        <Separator className="my-8" />

        {/* Action buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            className="flex-1 bg-info hover:bg-info/90 text-info-foreground"
            onClick={() => onMoveToInterview?.(basicInfo.candidateId)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Move to Interview
          </Button>
          <Button variant="outline" onClick={() => onViewResume?.(resumeUrl)}>
            View Full Resume
          </Button>
          <Button variant="destructive" onClick={() => onReject?.(basicInfo.candidateId)}>
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
