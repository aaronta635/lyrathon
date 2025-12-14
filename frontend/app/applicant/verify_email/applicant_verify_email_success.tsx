"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Home } from "lucide-react"

export function ApplicantVerifyEmailSuccess() {
  const handleGoHome = () => {
    window.location.href = "/"
  }

  const handleNewApplication = () => {
    window.location.href = "/applicant/page_1"
  }

  return (
    <Card className="border-2 border-peach-orange">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-peach-orange rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-navy-blue" />
          </div>
        </div>
        <CardTitle className="text-3xl text-navy-blue">Application Submitted!</CardTitle>
        <CardDescription className="text-base">
          Your application has been successfully verified and submitted
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-light-gray/50 p-6 rounded-lg space-y-2">
          <h3 className="font-semibold text-navy-blue">What happens next?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-peach-orange mt-0.5 flex-shrink-0" />
              <span>Our team will review your application within 3-5 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-peach-orange mt-0.5 flex-shrink-0" />
              <span>You'll receive an email confirmation shortly</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-peach-orange mt-0.5 flex-shrink-0" />
              <span>We'll contact you via email with the next steps</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleGoHome}
            variant="outline"
            size="lg"
            className="flex-1 border-navy-blue text-navy-blue hover:bg-light-gray bg-transparent"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Home
          </Button>
          <Button
            onClick={handleNewApplication}
            size="lg"
            className="flex-1 bg-peach-orange hover:bg-light-peach text-navy-blue font-semibold"
          >
            Submit Another Application
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
