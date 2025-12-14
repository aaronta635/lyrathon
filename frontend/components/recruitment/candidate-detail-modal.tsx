"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, ArrowLeft, CheckCircle, XCircle, FileText, Linkedin } from "lucide-react"
import { MatchScoreDisplay } from "./match-score-display"
import { SkillBadge } from "./skill-badge"
import { BuiltProjectsCard } from "./built-projects-card"
import { PersonalityCard } from "./personality-card"
import { RecommendationsCard } from "./recommendations-card"
import { StrengthsCard } from "./strengths-card"
import { RisksCard } from "./risks-card"
import type { CandidateFullProfile } from "@/lib/types"

interface CandidateDetailModalProps {
  isOpen: boolean
  onClose: () => void
  candidateProfile: CandidateFullProfile | null
  jobRequiredSkills?: string[]
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

  const { basicInfo, matchScore, skills, projects, hiringRecommendation, justification, engineerSummary, recommendations, strengths, risks, resumeUrl, linkedinUrl } = candidateProfile

  const isSkillMatched = (skillName: string) => {
    if (jobRequiredSkills.length === 0) return true
    return jobRequiredSkills.some(reqSkill => 
      skillName.toLowerCase().includes(reqSkill.toLowerCase()) ||
      reqSkill.toLowerCase().includes(skillName.toLowerCase())
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="!max-w-[720px] !w-[720px] max-h-[90vh] overflow-y-auto p-0 border-0 rounded-2xl bg-background"
        style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}
      >
        {/* Header with marble texture */}
        <div 
          className="p-6 rounded-t-2xl"
          style={{ 
            backgroundImage: `linear-gradient(90deg, rgba(26,90,82,0.4) 0%, rgba(0,0,0,0.3) 100%), url('/textures/marble-teal.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: '20% center',
          }}
        >
          <button 
            onClick={onClose} 
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to candidates
          </button>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar placeholder */}
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #4ECDC4 0%, #45B7AF 100%)' }}
              >
                {basicInfo.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{basicInfo.fullName}</h2>
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{basicInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{basicInfo.yearsOfExperience}y exp</span>
                  </div>
                  {linkedinUrl && (
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-white hover:text-white transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <MatchScoreDisplay scorePercentage={matchScore.overallScore} size="md" />
            </div>
          </div>
        </div>

        <DialogHeader className="sr-only">
          <DialogTitle>{basicInfo.fullName}</DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Skills */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Skills</h3>
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
          </div>

          {/* Hiring Recommendation - priority block (with justification merged) */}
          <div 
            className="rounded-lg border-0"
            style={{ borderLeft: '4px solid #4ECDC4', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-secondary" />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Recommendation</h3>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {justification && justification.trim() ? (
                  <>
                    {justification}
                    {hiringRecommendation && hiringRecommendation.trim() && (
                      <>
                        <br /><br />
                        {hiringRecommendation}
                      </>
                    )}
                  </>
                ) : (
                  hiringRecommendation
                )}
              </p>
            </div>
          </div>

          {/* Two-column: Projects | Personality */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BuiltProjectsCard
              projects={projects}
              onViewProject={(projectId) => console.log("View project:", projectId)}
            />
            {engineerSummary && (
              <PersonalityCard summary={engineerSummary} />
            )}
          </div>

          {/* Two-column: Strengths | Risks */}
          {(strengths && strengths.length > 0) || (risks && risks.length > 0) ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {strengths && strengths.length > 0 && (
                <StrengthsCard strengths={strengths} />
              )}
              {risks && risks.length > 0 && (
                <RisksCard risks={risks} />
              )}
            </div>
          ) : null}

          {/* Recommendations */}
          {recommendations && recommendations.length > 0 && (
            <RecommendationsCard recommendations={recommendations.slice(0, 3)} />
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => onReject?.(basicInfo.candidateId)} 
              className="rounded-xl border text-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 transition-all w-full py-4"
            >
              <XCircle className="h-5 w-5 mr-2" />
              Reject
            </Button>
            <Button
              size="lg"
              className="rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all hover:scale-[1.02] w-full py-4"
              style={{ boxShadow: '0 4px 12px rgba(26, 90, 82, 0.3)' }}
              onClick={() => onMoveToInterview?.(basicInfo.candidateId)}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Move to Interview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
