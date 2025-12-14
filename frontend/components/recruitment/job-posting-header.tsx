import { SkillBadge } from "./skill-badge"
import type { JobPostingInfo } from "@/lib/types"

interface JobPostingHeaderProps {
  jobInfo: JobPostingInfo
}

export function JobPostingHeader({ jobInfo }: JobPostingHeaderProps) {
  const formattedSalaryRange = `$${(jobInfo.salaryRange.minSalary / 1000).toFixed(0)}k-$${(jobInfo.salaryRange.maxSalary / 1000).toFixed(0)}k`

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-foreground mb-3">{jobInfo.jobTitle}</h1>
      <div className="flex items-center gap-4 text-muted-foreground mb-4">
        <span>{jobInfo.location}</span>
        <span>•</span>
        <span className="capitalize">{jobInfo.employmentType}</span>
        <span>•</span>
        <span>{formattedSalaryRange}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {jobInfo.requiredSkills.map((skillName) => (
          <SkillBadge key={skillName} skillName={skillName} variant="required" />
        ))}
      </div>
    </div>
  )
}
