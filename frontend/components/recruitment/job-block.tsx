import { Card } from "@/components/ui/card"
import { JobTitle } from "./job-title"
import { JobDetails } from "./job-details"
import { Users, Target, Calendar } from "lucide-react"
import type { JobPostingInfo, DashboardMetrics } from "@/lib/types"

interface JobBlockProps {
  jobInfo: JobPostingInfo
  metrics: DashboardMetrics
  allJobs: { jobId: string; jobTitle: string }[]
  onJobChange: (jobId: string) => void
  onJobInfoUpdate?: (updates: Partial<JobPostingInfo>) => void
  className?: string
}

// Color-coded match system
const getScoreColor = (score: number) => {
  if (score >= 90) return "#10B981" // Dark green - Excellent
  if (score >= 70) return "#4ECDC4" // Mint teal - Good
  if (score >= 50) return "#F59E0B" // Amber - Moderate
  return "#FF6B6B" // Coral red - Weak
}

export function JobBlock({ jobInfo, metrics, allJobs, onJobChange, onJobInfoUpdate, className = "" }: JobBlockProps) {
  const avgMatchColor = getScoreColor(metrics.averageMatchScore)

  return (
    <Card 
      className={`p-8 mb-8 border-0 rounded-2xl relative z-10 ${className}`}
      style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.06)' }}
    >
      {/* Top row: Job title + metrics */}
      <div className="flex items-start justify-between mb-3">
        <JobTitle 
          selectedJobId={jobInfo.jobId} 
          jobs={allJobs} 
          onJobChange={onJobChange} 
        />
        <div className="flex items-center gap-4">
          {/* Metric cards */}
          <div 
            className="flex items-center gap-3 bg-card px-5 py-3 rounded-xl"
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
          >
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{metrics.totalCandidates}</p>
              <p className="text-xs text-muted-foreground">Candidates</p>
            </div>
          </div>
          <div 
            className="flex items-center gap-3 bg-card px-5 py-3 rounded-xl"
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
          >
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${avgMatchColor}15` }}>
              <Target className="h-5 w-5" style={{ color: avgMatchColor }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: avgMatchColor }}>{metrics.averageMatchScore}%</p>
              <p className="text-xs text-muted-foreground">Avg Match</p>
            </div>
          </div>
          <div 
            className="flex items-center gap-3 bg-card px-5 py-3 rounded-xl"
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
          >
            <div className="p-2 rounded-lg bg-secondary/10">
              <Calendar className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">{metrics.activeInterviews}</p>
              <p className="text-xs text-muted-foreground">Interviews</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Job details */}
      <JobDetails
        location={jobInfo.location}
        employmentType={jobInfo.employmentType}
        salaryRange={jobInfo.salaryRange}
        requiredSkills={jobInfo.requiredSkills}
        onLocationChange={(location) => onJobInfoUpdate?.({ location })}
        onEmploymentTypeChange={(employmentType) => onJobInfoUpdate?.({ employmentType: employmentType as JobPostingInfo["employmentType"] })}
        onSalaryRangeChange={(salaryRange) => onJobInfoUpdate?.({ salaryRange })}
        onSkillsChange={(requiredSkills) => onJobInfoUpdate?.({ requiredSkills })}
      />
    </Card>
  )
}
