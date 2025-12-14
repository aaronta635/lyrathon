"use client"

import type React from "react"

import { useState } from "react"
import { ApplicantPage1PdfUpload } from "./applicant_page_1_pdf_upload"
import { ApplicantPage1GithubProjects } from "./applicant_page_1_github_projects"
import { ApplicantPage1PersonalInfo } from "./applicant_page_1_personal_info"
import { ApplicantPage1JobArea } from "./applicant_page_1_job_area"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export interface ApplicantFormData {
  fullName: string
  email: string
  phoneNumber: string
  resumeFile: File | null
  githubProjectUrls: string[]
  jobArea: string
}

export function ApplicantPage1Form() {
  const [formData, setFormData] = useState<ApplicantFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    resumeFile: null,
    githubProjectUrls: [""],
    jobArea: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const handlePersonalInfoChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleJobAreaChange = (value: string) => {
    setFormData((prev) => ({ ...prev, jobArea: value }))
    if (formErrors.jobArea) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.jobArea
        return newErrors
      })
    }
  }

  const handleResumeUpload = (file: File | null) => {
    setFormData((prev) => ({ ...prev, resumeFile: file }))
    if (formErrors.resumeFile) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.resumeFile
        return newErrors
      })
    }
  }

  const handleGithubProjectsChange = (urls: string[]) => {
    setFormData((prev) => ({ ...prev, githubProjectUrls: urls }))
    if (formErrors.githubProjectUrls) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.githubProjectUrls
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required"
    }

    if (!formData.jobArea) {
      errors.jobArea = "Please select a job area"
    }

    if (!formData.resumeFile) {
      errors.resumeFile = "Please upload your resume"
    }

    const validGithubUrls = formData.githubProjectUrls.filter((url) => url.trim() !== "")
    if (validGithubUrls.length === 0) {
      errors.githubProjectUrls = "Please add at least one GitHub project URL"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    sessionStorage.setItem("applicant_page_1_data", JSON.stringify(formData))

    await new Promise((resolve) => setTimeout(resolve, 500))

    setIsSubmitting(false)

    window.location.href = "/applicant/page_2"
  }

  const handleCloseSuccessModal = () => {
    // setShowSuccessModal(false)
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      resumeFile: null,
      githubProjectUrls: [""],
      jobArea: "",
    })
    setFormErrors({})
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-navy-blue">Personal Information</CardTitle>
            <CardDescription>Tell us about yourself</CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicantPage1PersonalInfo
              fullName={formData.fullName}
              email={formData.email}
              phoneNumber={formData.phoneNumber}
              onChange={handlePersonalInfoChange}
              errors={formErrors}
            />
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-navy-blue">Job Area</CardTitle>
            <CardDescription>What type of position are you looking for?</CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicantPage1JobArea
              selectedJobArea={formData.jobArea}
              onChange={handleJobAreaChange}
              error={formErrors.jobArea}
            />
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-navy-blue">Resume Upload</CardTitle>
            <CardDescription>Upload your resume in PDF format</CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicantPage1PdfUpload
              onFileSelect={handleResumeUpload}
              currentFile={formData.resumeFile}
              error={formErrors.resumeFile}
            />
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-navy-blue">GitHub Projects</CardTitle>
            <CardDescription>Share links to your best work</CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicantPage1GithubProjects
              projectUrls={formData.githubProjectUrls}
              onChange={handleGithubProjectsChange}
              error={formErrors.githubProjectUrls}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              setFormData({
                fullName: "",
                email: "",
                phoneNumber: "",
                resumeFile: null,
                githubProjectUrls: [""],
                jobArea: "",
              })
              setFormErrors({})
            }}
            className="border-navy-blue text-navy-blue hover:bg-light-gray"
          >
            Clear Form
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="bg-peach-orange hover:bg-light-peach text-navy-blue font-semibold transition-all hover:scale-105"
          >
            {isSubmitting ? "Processing..." : "Continue"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </>
  )
}
