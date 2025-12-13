import { SkillBadge } from "./skill-badge"

interface JobDetailsProps {
  location: string
  employmentType: string
  salaryRange: {
    minSalary: number
    maxSalary: number
    currency: string
  }
  requiredSkills: string[]
  className?: string
}

export function JobDetails({
  location,
  employmentType,
  salaryRange,
  requiredSkills,
  className = "",
}: JobDetailsProps) {
  const formattedSalaryRange = `$${(salaryRange.minSalary / 1000).toFixed(0)}k-$${(salaryRange.maxSalary / 1000).toFixed(0)}k`

  return (
    <div className={className}>
      {/* Location, Employment Type, Salary */}
      <div className="flex items-center gap-4 text-muted-foreground mb-4">
        <span>{location}</span>
        <span>•</span>
        <span className="capitalize">{employmentType}</span>
        <span>•</span>
        <span>{formattedSalaryRange}</span>
      </div>

      {/* Required Skills */}
      <div className="flex flex-wrap gap-2">
        {requiredSkills.map((skillName) => (
          <SkillBadge key={skillName} skillName={skillName} variant="required" />
        ))}
      </div>
    </div>
  )
}

