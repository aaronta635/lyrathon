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
  resumeFile: File | null
  githubUrl: string
  jobArea: string
}

export function ApplicantPage1Form() {
  const [formData, setFormData] = useState<ApplicantFormData>({
    fullName: "",
    email: "",
    resumeFile: null,
    githubUrl: "",
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

  const handleGithubUrlChange = (url: string) => {
    setFormData((prev) => ({ ...prev, githubUrl: url }))
    if (formErrors.githubUrl) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.githubUrl
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

    if (!formData.jobArea) {
      errors.jobArea = "Please select a job area"
    }

    if (!formData.resumeFile) {
      errors.resumeFile = "Please upload your resume"
    }

    if (!formData.githubUrl.trim()) {
      errors.githubUrl = "GitHub URL is required"
    } else if (!/^https?:\/\/github\.com\/.+/.test(formData.githubUrl.trim())) {
      errors.githubUrl = "Please enter a valid GitHub URL (e.g., https://github.com/username)"
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

    try {
      // Import API function
      const { createApplication } = await import('@/lib/api/applications')
      
      // Map jobArea to focus (fullstack, frontend, backend)
      const focusMap: Record<string, 'fullstack' | 'frontend' | 'backend'> = {
        'fullstack': 'fullstack',
        'frontend': 'frontend',
        'backend': 'backend',
      }
      const focus = focusMap[formData.jobArea.toLowerCase()] || 'fullstack'

      // Create application via API
      const response = await createApplication({
        name: formData.fullName,
        email: formData.email,
        github_url: formData.githubUrl.trim(),
        focus: focus,
        resume: formData.resumeFile!,
      })

      // Store application ID and form data for page 2
      sessionStorage.setItem('application_id', response.id)
      sessionStorage.setItem('applicant_page_1_data', JSON.stringify({
        ...formData,
        applicationId: response.id,
        applicationStatus: response.status,
      }))

      // Redirect to page 2
      window.location.href = '/applicant/page_2'
    } catch (error) {
      console.error('Error submitting application:', error)
      setFormErrors({
        submit: error instanceof Error ? error.message : 'Failed to submit application. Please try again.',
      })
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccessModal = () => {
    // setShowSuccessModal(false)
    setFormData({
      fullName: "",
      email: "",
      resumeFile: null,
      githubUrl: "",
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
            <CardTitle className="text-navy-blue">GitHub Profile</CardTitle>
            <CardDescription>Share your GitHub profile or repository URL</CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicantPage1GithubProjects
              githubUrl={formData.githubUrl}
              onChange={handleGithubUrlChange}
              error={formErrors.githubUrl}
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
                resumeFile: null,
                githubUrl: "",
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
            {isSubmitting ? "Submitting..." : "Continue"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {formErrors.submit && (
            <div className="text-red-600 text-sm mt-2">{formErrors.submit}</div>
          )}
        </div>
      </form>
    </>
  )
}
