"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

interface RecruiterPage1RequirementsProps {
  requiredSkills: string[]
  jobDescription: string
  onSkillsChange: (skills: string[]) => void
  onDescriptionChange: (description: string) => void
  skillsError?: string
  descriptionError?: string
}

export default function RecruiterPage1Requirements({
  requiredSkills,
  jobDescription,
  onSkillsChange,
  onDescriptionChange,
  skillsError,
  descriptionError,
}: RecruiterPage1RequirementsProps) {
  const [skillInput, setSkillInput] = useState("")

  const addSkill = () => {
    const trimmedSkill = skillInput.trim()
    if (trimmedSkill && !requiredSkills.includes(trimmedSkill)) {
      onSkillsChange([...requiredSkills, trimmedSkill])
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    onSkillsChange(requiredSkills.filter((skill) => skill !== skillToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#e0f5f3] p-6 space-y-4">
      <h2 className="text-xl font-semibold text-[#004038] mb-4">Requirements</h2>

      <div className="space-y-2">
        <Label htmlFor="required-skills" className="text-[#004038]">
          Required Skills <span className="text-red-500">*</span>
        </Label>
        <div className="flex gap-2">
          <Input
            id="required-skills"
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g. React, TypeScript, AWS"
            className="flex-1 border-[#e0f5f3] focus:border-[#00756a] focus:ring-[#00756a]"
          />
          <Button type="button" onClick={addSkill} className="bg-[#00756a] hover:bg-[#004038] text-white">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {skillsError && <p className="text-sm text-red-500">{skillsError}</p>}

        {requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {requiredSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="bg-[#e0f5f3] text-[#004038] hover:bg-[#00756a] hover:text-white transition-colors"
              >
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="job-description" className="text-[#004038]">
          Job Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="job-description"
          value={jobDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe the role, responsibilities, and what makes this position unique..."
          rows={6}
          className="border-[#e0f5f3] focus:border-[#00756a] focus:ring-[#00756a] resize-none"
        />
        {descriptionError && <p className="text-sm text-red-500">{descriptionError}</p>}
        <p className="text-sm text-[#00756a]">{jobDescription.length} characters</p>
      </div>
    </div>
  )
}
