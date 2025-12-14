"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, ArrowLeft, CheckCircle, XCircle, FileText } from "lucide-react"
import { MatchScoreDisplay } from "./match-score-display"
import { FitLevelBadge } from "./fit-level-badge"
import { SkillBadge } from "./skill-badge"
import { BuiltProjectsCard } from "./built-projects-card"
import { GitHubSignalsCard } from "./github-signals-card"
import { StrengthsCard } from "./strengths-card"
import { RisksCard } from "./risks-card"
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

  const { basicInfo, matchScore, skills, projects, githubMetrics, professionalSummary, resumeUrl, strengths, risks } = candidateProfile

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[60vw] !w-[60vw] max-h-[85vh] overflow-y-auto p-5">
        {/* Back button - separate row */}
        <div className="border-b pb-3 mb-4">
          <Button variant="ghost" size="sm" onClick={onClose} className="flex items-center gap-1 text-xs -ml-2">
            <ArrowLeft className="h-3 w-3" />
            Back to candidates
          </Button>
        </div>

        <DialogHeader className="sr-only">
          <DialogTitle>{basicInfo.fullName}</DialogTitle>
        </DialogHeader>

        {/* Candidate info card */}
        <Card className="mb-4">
          <CardContent className="p-4">
            {/* Header with name, location, experience and match score */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{basicInfo.fullName}</h2>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{basicInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{basicInfo.yearsOfExperience}y exp</span>
                  </div>
                  <button
                    onClick={() => onViewResume?.(resumeUrl)}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <FileText className="h-3 w-3" />
                    <span>Resume</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <MatchScoreDisplay scorePercentage={matchScore.overallScore} size="md" />
                <FitLevelBadge fitLevel={matchScore.fitLevel} />
              </div>
            </div>

            {/* Professional summary */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{professionalSummary}</p>

            {/* Skills section */}
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <SkillBadge
                  key={skill.skillName}
                  skillName={skill.skillName}
                  variant={skill.isVerified ? "verified" : "default"}
                  size="sm"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects and GitHub signals grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <BuiltProjectsCard
            projects={projects}
            onViewProject={(projectId) => console.log("View project:", projectId)}
          />
          {githubMetrics && <GitHubSignalsCard githubMetrics={githubMetrics} />}
        </div>

        {/* Strengths and Risks section */}
        {((strengths && strengths.length > 0) || (risks && risks.length > 0)) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {strengths && strengths.length > 0 && <StrengthsCard strengths={strengths} />}
            {risks && risks.length > 0 && <RisksCard risks={risks} />}
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button variant="destructive" size="sm" onClick={() => onReject?.(basicInfo.candidateId)}>
            <XCircle className="h-4 w-4 mr-1" />
            Reject
          </Button>
          <Button
            size="sm"
            className="bg-info hover:bg-info/90 text-info-foreground"
            onClick={() => onMoveToInterview?.(basicInfo.candidateId)}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Move to Interview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
