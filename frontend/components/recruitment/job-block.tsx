import { JobTitle } from "./job-title"
import { JobDetails } from "./job-details"
import type { JobPostingInfo } from "@/lib/types"

interface JobBlockProps {
  jobInfo: JobPostingInfo
  className?: string
}

export function JobBlock({ jobInfo, className = "" }: JobBlockProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <JobTitle title={jobInfo.jobTitle} />
      <JobDetails
        location={jobInfo.location}
        employmentType={jobInfo.employmentType}
        salaryRange={jobInfo.salaryRange}
        requiredSkills={jobInfo.requiredSkills}
      />
    </div>
  )
}

