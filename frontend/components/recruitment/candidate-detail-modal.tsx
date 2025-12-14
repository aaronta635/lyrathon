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

  const { basicInfo, matchScore, skills, projects, hiringRecommendation, engineerSummary, recommendations, resumeUrl } = candidateProfile

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
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <MatchScoreDisplay scorePercentage={matchScore.overallScore} size="md" />
              <FitLevelBadge fitLevel={matchScore.fitLevel} />
            </div>
          </div>
        </div>

        <DialogHeader className="sr-only">
          <DialogTitle>{basicInfo.fullName}</DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="p-6">
          {/* Hiring Recommendation card */}
          <Card 
            className="mb-6 border-0 rounded-xl overflow-hidden"
            style={{ 
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #45B7AF'
            }}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">💡</span>
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Hiring Recommendation</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{hiringRecommendation}</p>
            </CardContent>
          </Card>

          {/* View Resume button */}
          <button
            onClick={() => onViewResume?.(resumeUrl)}
            className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors mb-6"
          >
            <FileText className="h-4 w-4" />
            View Full Resume →
          </button>

          {/* Skills */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span>🛠️</span> Skills
            </h3>
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

          {/* Projects and Personality grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            <BuiltProjectsCard
              projects={projects}
              onViewProject={(projectId) => console.log("View project:", projectId)}
            />
            {engineerSummary && (
              <PersonalityCard summary={engineerSummary} />
            )}
          </div>

          {/* Recommendations */}
          {recommendations && recommendations.length > 0 && (
            <div className="mb-6">
              <RecommendationsCard recommendations={recommendations} />
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4 pt-5 border-t border-border">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => onReject?.(basicInfo.candidateId)} 
              className="rounded-xl border-2 text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition-all"
            >
              <XCircle className="h-5 w-5 mr-2" />
              Reject
            </Button>
            <Button
              size="lg"
              className="rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all hover:scale-[1.02]"
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
