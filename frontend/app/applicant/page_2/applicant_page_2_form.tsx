"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ApplicantPage2YoutubeUrls } from "./applicant_page_2_youtube_urls"
import { ApplicantPage2WebsiteUrls } from "./applicant_page_2_website_urls"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"

export interface WebsiteUrlWithLogin {
  url: string
  requiresLogin: boolean
}

export interface ApplicantPage2FormData {
  youtubeUrls: string[]
  websiteUrlsWithLogin: WebsiteUrlWithLogin[]
}

export function ApplicantPage2Form() {
  const [formData, setFormData] = useState<ApplicantPage2FormData>({
    youtubeUrls: [""],
    websiteUrlsWithLogin: [{ url: "", requiresLogin: false }],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [page1Data, setPage1Data] = useState<any>(null)

  useEffect(() => {
    const storedData = sessionStorage.getItem("applicant_page_1_data")
    if (!storedData) {
      window.location.href = "/applicant/page_1"
      return
    }
    setPage1Data(JSON.parse(storedData))
  }, [])

  const handleYoutubeUrlsChange = (urls: string[]) => {
    setFormData((prev) => ({ ...prev, youtubeUrls: urls }))
    if (formErrors.youtubeUrls) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.youtubeUrls
        return newErrors
      })
    }
  }

  const handleWebsiteUrlsChange = (websiteUrlsWithLogin: WebsiteUrlWithLogin[]) => {
    setFormData((prev) => ({ ...prev, websiteUrlsWithLogin }))
    if (formErrors.websiteUrlsWithLogin) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.websiteUrlsWithLogin
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    const validYoutubeUrls = formData.youtubeUrls.filter((url) => url.trim() !== "")
    if (validYoutubeUrls.length === 0) {
      errors.youtubeUrls = "Please add at least one YouTube URL"
    } else {
      const invalidYoutubeUrls = validYoutubeUrls.filter(
        (url) => !/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url),
      )
      if (invalidYoutubeUrls.length > 0) {
        errors.youtubeUrls = "Please enter valid YouTube URLs"
      }
    }

    const validWebsiteUrls = formData.websiteUrlsWithLogin.filter((item) => item.url.trim() !== "")
    if (validWebsiteUrls.length === 0) {
      errors.websiteUrlsWithLogin = "Please add at least one website URL"
    } else {
      const invalidWebsiteUrls = validWebsiteUrls.filter((item) => !/^https?:\/\/.+\..+/.test(item.url))
      if (invalidWebsiteUrls.length > 0) {
        errors.websiteUrlsWithLogin = "Please enter valid website URLs"
      }
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

    sessionStorage.setItem("applicant_page_2_data", JSON.stringify(formData))

    await new Promise((resolve) => setTimeout(resolve, 500))

    setIsSubmitting(false)

    window.location.href = "/applicant/verify_email"
  }

  const handleBack = () => {
    window.location.href = "/applicant/page_1"
  }

  if (!page1Data) {
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-2 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-navy-blue">YouTube Presence</CardTitle>
          <CardDescription>Share your YouTube channels or videos</CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicantPage2YoutubeUrls
            youtubeUrls={formData.youtubeUrls}
            onChange={handleYoutubeUrlsChange}
            error={formErrors.youtubeUrls}
          />
        </CardContent>
      </Card>

      <Card className="border-2 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-navy-blue">Website Links</CardTitle>
          <CardDescription>Share your portfolios or deployed projects</CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicantPage2WebsiteUrls
            websiteUrlsWithLogin={formData.websiteUrlsWithLogin}
            onChange={handleWebsiteUrlsChange}
            error={formErrors.websiteUrlsWithLogin}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleBack}
          className="border-navy-blue text-navy-blue hover:bg-light-gray bg-transparent transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="bg-peach-orange hover:bg-light-peach text-navy-blue font-semibold transition-all hover:scale-105"
        >
          {isSubmitting ? "Processing..." : "Continue to Verification"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
