"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { SkillBadge } from "./skill-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface JobDetailsProps {
  location: string
  employmentType: string
  salaryRange: {
    minSalary: number
    maxSalary: number
    currency: string
  }
  requiredSkills: string[]
  onLocationChange?: (location: string) => void
  onEmploymentTypeChange?: (type: string) => void
  onSalaryRangeChange?: (range: { minSalary: number; maxSalary: number; currency: string }) => void
  onSkillsChange?: (skills: string[]) => void
  className?: string
}

const locationOptions = ["All Locations", "Sydney", "Melbourne", "Brisbane", "Perth", "Remote"]
const employmentTypeOptions = [
  { value: "all", label: "Any Availability" },
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
]
const salaryRangeOptions = [
  { label: "Any Salary", min: 0, max: 999999 },
  { label: "$80k-$100k", min: 80000, max: 100000 },
  { label: "$100k-$130k", min: 100000, max: 130000 },
  { label: "$120k-$160k", min: 120000, max: 160000 },
  { label: "$140k-$180k", min: 140000, max: 180000 },
  { label: "$160k-$200k", min: 160000, max: 200000 },
  { label: "$180k+", min: 180000, max: 250000 },
]

export function JobDetails({
  location,
  employmentType,
  salaryRange,
  requiredSkills,
  onLocationChange,
  onEmploymentTypeChange,
  onSalaryRangeChange,
  onSkillsChange,
  className = "",
}: JobDetailsProps) {
  const [newSkill, setNewSkill] = useState("")
  const [isAddingSkill, setIsAddingSkill] = useState(false)

  const formattedSalaryRange = `$${(salaryRange.minSalary / 1000).toFixed(0)}k-$${(salaryRange.maxSalary / 1000).toFixed(0)}k`
  
  const currentSalaryKey = `${salaryRange.minSalary}-${salaryRange.maxSalary}`

  const handleAddSkill = () => {
    if (newSkill.trim() && !requiredSkills.includes(newSkill.trim())) {
      onSkillsChange?.([...requiredSkills, newSkill.trim()])
      setNewSkill("")
      setIsAddingSkill(false)
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange?.(requiredSkills.filter(s => s !== skillToRemove))
  }

  return (
    <div className={className}>
      {/* Location, Employment Type, Salary as dropdowns */}
      <div className="flex items-center gap-3 text-sm mb-4">
        <Select value={location} onValueChange={onLocationChange}>
          <SelectTrigger className="w-auto h-8 border-none shadow-none p-0 text-secondary hover:text-secondary/80 font-medium [&>svg]:text-secondary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {locationOptions.map((loc) => (
              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-muted-foreground">•</span>

        <Select value={employmentType} onValueChange={onEmploymentTypeChange}>
          <SelectTrigger className="w-auto h-8 border-none shadow-none p-0 text-secondary hover:text-secondary/80 font-medium [&>svg]:text-secondary">
            <SelectValue>
              {employmentTypeOptions.find(t => t.value === employmentType)?.label || employmentType}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {employmentTypeOptions.map((type) => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-muted-foreground">•</span>

        <Select 
          value={currentSalaryKey} 
          onValueChange={(val) => {
            const [min, max] = val.split("-").map(Number)
            onSalaryRangeChange?.({ minSalary: min, maxSalary: max, currency: "AUD" })
          }}
        >
          <SelectTrigger className="w-auto h-8 border-none shadow-none p-0 text-secondary hover:text-secondary/80 font-medium [&>svg]:text-secondary">
            <SelectValue>{formattedSalaryRange}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {salaryRangeOptions.map((range) => (
              <SelectItem key={range.label} value={`${range.min}-${range.max}`}>{range.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Required Skills - editable */}
      <div className="flex flex-wrap items-center gap-2">
        {requiredSkills.map((skillName) => (
          <div key={skillName} className="group relative">
            <SkillBadge skillName={skillName} variant="required" />
            <button
              onClick={() => handleRemoveSkill(skillName)}
              className="absolute -top-1 -right-1 hidden group-hover:flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-white text-xs"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        
        {isAddingSkill ? (
          <div className="flex items-center gap-1">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddSkill()
                if (e.key === "Escape") setIsAddingSkill(false)
              }}
              placeholder="Add skill..."
              className="h-7 w-32 text-sm"
              autoFocus
            />
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-primary hover:text-primary/80 hover:bg-primary/5" onClick={handleAddSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <button 
            className="flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
            onClick={() => setIsAddingSkill(true)}
          >
            <Plus className="h-4 w-4" />
            Add Skill
          </button>
        )}
      </div>
    </div>
  )
}
