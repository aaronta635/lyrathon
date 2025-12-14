"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import RecruiterPage1Header from "./recruiter_page_1_header"
import RecruiterPage1JobDetails from "./recruiter_page_1_job_details"
import RecruiterPage1EngineeringType from "./recruiter_page_1_engineering_type"
import RecruiterPage1Requirements from "./recruiter_page_1_requirements"
import { Button } from "@/components/ui/button"

export interface RecruiterJobPostingFormData {
  jobTitle: string
  companyName: string
  location: string
  employmentType: string
  salaryMin: string
  salaryMax: string
  engineeringType: string
  requiredSkills: string[]
  jobDescription: string
}

export default function RecruiterPage1Form() {
  const router = useRouter()
  const [formData, setFormData] = useState<RecruiterJobPostingFormData>({
    jobTitle: "",
    companyName: "",
    location: "",
    employmentType: "full-time",
    salaryMin: "",
    salaryMax: "",
    engineeringType: "",
    requiredSkills: [],
    jobDescription: "",
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const updateFormField = (field: keyof RecruiterJobPostingFormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.jobTitle.trim()) {
      errors.jobTitle = "Job title is required"
    }
    if (!formData.companyName.trim()) {
      errors.companyName = "Company name is required"
    }
    if (!formData.location.trim()) {
      errors.location = "Location is required"
    }
    if (!formData.engineeringType) {
      errors.engineeringType = "Please select an engineering type"
    }
    if (formData.requiredSkills.length === 0) {
      errors.requiredSkills = "At least one required skill is needed"
    }
    if (!formData.jobDescription.trim()) {
      errors.jobDescription = "Job description is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Store form data in sessionStorage for next page
    sessionStorage.setItem("recruiter_job_posting_data", JSON.stringify(formData))

    // Navigate to dashboard or confirmation page
    router.push("/recruiter/dashboard")
  }

  return (
    <div className="container max-w-4xl mx-auto px-6 py-8">
      <RecruiterPage1Header />

      <form onSubmit={handleSubmit} className="space-y-6">
        <RecruiterPage1JobDetails formData={formData} formErrors={formErrors} updateFormField={updateFormField} />

        <RecruiterPage1EngineeringType
          selectedType={formData.engineeringType}
          onTypeChange={(type) => updateFormField("engineeringType", type)}
          error={formErrors.engineeringType}
        />

        <RecruiterPage1Requirements
          requiredSkills={formData.requiredSkills}
          jobDescription={formData.jobDescription}
          onSkillsChange={(skills) => updateFormField("requiredSkills", skills)}
          onDescriptionChange={(desc) => updateFormField("jobDescription", desc)}
          skillsError={formErrors.requiredSkills}
          descriptionError={formErrors.jobDescription}
        />

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
            className="border-[#00756a] text-[#004038] hover:bg-[#e0f5f3]"
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-[#00756a] hover:bg-[#004038] text-white">
            Post Job & Find Candidates
          </Button>
        </div>
      </form>
    </div>
  )
}
