import { Card } from "@/components/ui/card"
import { JobTitle } from "./job-title"
import { JobDetails } from "./job-details"
import type { JobPostingInfo, DashboardMetrics } from "@/lib/types"

interface JobBlockProps {
  jobInfo: JobPostingInfo
  metrics: DashboardMetrics
  allJobs: { jobId: string; jobTitle: string }[]
  onJobChange: (jobId: string) => void
  onJobInfoUpdate?: (updates: Partial<JobPostingInfo>) => void
  className?: string
}

export function JobBlock({ jobInfo, metrics, allJobs, onJobChange, onJobInfoUpdate, className = "" }: JobBlockProps) {
  return (
    <Card 
      className={`p-8 mb-8 border-0 ${className}`}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)' }}
    >
      {/* Top row: Job title + metrics */}
      <div className="flex items-start justify-between mb-4">
        <JobTitle 
          selectedJobId={jobInfo.jobId} 
          jobs={allJobs} 
          onJobChange={onJobChange} 
        />
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-3xl font-semibold text-foreground">{metrics.totalCandidates}</p>
            <p className="text-sm text-muted-foreground">Candidates</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-semibold text-success">{metrics.averageMatchScore}%</p>
            <p className="text-sm text-muted-foreground">Avg Match</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-semibold text-primary">{metrics.activeInterviews}</p>
            <p className="text-sm text-muted-foreground">Interviews</p>
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
