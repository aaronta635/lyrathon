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
    <Card className={`p-6 mb-6 ${className}`}>
      {/* Top row: Job title + metrics */}
      <div className="flex items-start justify-between mb-2">
        <JobTitle 
          selectedJobId={jobInfo.jobId} 
          jobs={allJobs} 
          onJobChange={onJobChange} 
        />
        <div className="flex items-center gap-6 text-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{metrics.totalCandidates}</p>
            <p className="text-xs text-muted-foreground">Candidates</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">{metrics.averageMatchScore}%</p>
            <p className="text-xs text-muted-foreground">Avg Match</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-info">{metrics.activeInterviews}</p>
            <p className="text-xs text-muted-foreground">Interviews</p>
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
