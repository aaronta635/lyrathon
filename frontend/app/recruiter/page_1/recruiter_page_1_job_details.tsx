"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { RecruiterJobPostingFormData } from "./recruiter_page_1_form"

interface RecruiterPage1JobDetailsProps {
  formData: RecruiterJobPostingFormData
  formErrors: Record<string, string>
  updateFormField: (field: keyof RecruiterJobPostingFormData, value: string) => void
}

export default function RecruiterPage1JobDetails({
  formData,
  formErrors,
  updateFormField,
}: RecruiterPage1JobDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#e0f5f3] p-6 space-y-4">
      <h2 className="text-xl font-semibold text-[#004038] mb-4">Job Details</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="job-title" className="text-[#004038]">
            Job Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="job-title"
            type="text"
            value={formData.jobTitle}
            onChange={(e) => updateFormField("jobTitle", e.target.value)}
            placeholder="e.g. Senior Full-Stack Developer"
            className="border-[#e0f5f3] focus:border-[#00756a] focus:ring-[#00756a]"
          />
          {formErrors.jobTitle && <p className="text-sm text-red-500">{formErrors.jobTitle}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-name" className="text-[#004038]">
            Company Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="company-name"
            type="text"
            value={formData.companyName}
            onChange={(e) => updateFormField("companyName", e.target.value)}
            placeholder="e.g. Tech Innovations Inc."
            className="border-[#e0f5f3] focus:border-[#00756a] focus:ring-[#00756a]"
          />
          {formErrors.companyName && <p className="text-sm text-red-500">{formErrors.companyName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-[#004038]">
            Location <span className="text-red-500">*</span>
          </Label>
          <Input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => updateFormField("location", e.target.value)}
            placeholder="e.g. Sydney, AU or Remote"
            className="border-[#e0f5f3] focus:border-[#00756a] focus:ring-[#00756a]"
          />
          {formErrors.location && <p className="text-sm text-red-500">{formErrors.location}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="employment-type" className="text-[#004038]">
            Employment Type
          </Label>
          <Select value={formData.employmentType} onValueChange={(value) => updateFormField("employmentType", value)}>
            <SelectTrigger className="border-[#e0f5f3] focus:border-[#00756a] focus:ring-[#00756a]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-Time</SelectItem>
              <SelectItem value="part-time">Part-Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary-min" className="text-[#004038]">
            Minimum Salary (AUD)
          </Label>
          <Input
            id="salary-min"
            type="number"
            value={formData.salaryMin}
            onChange={(e) => updateFormField("salaryMin", e.target.value)}
            placeholder="e.g. 100000"
            className="border-[#e0f5f3] focus:border-[#00756a] focus:ring-[#00756a]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary-max" className="text-[#004038]">
            Maximum Salary (AUD)
          </Label>
          <Input
            id="salary-max"
            type="number"
            value={formData.salaryMax}
            onChange={(e) => updateFormField("salaryMax", e.target.value)}
            placeholder="e.g. 150000"
            className="border-[#e0f5f3] focus:border-[#00756a] focus:ring-[#00756a]"
          />
        </div>
      </div>
    </div>
  )
}
