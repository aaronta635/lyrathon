"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft } from "lucide-react"
import { ApplicantVerifyEmailSuccess } from "./applicant_verify_email_success"

export function ApplicantVerifyEmailForm() {
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [page1Data, setPage1Data] = useState<any>(null)
  const [page2Data, setPage2Data] = useState<any>(null)

  useEffect(() => {
    const storedPage1Data = sessionStorage.getItem("applicant_page_1_data")
    const storedPage2Data = sessionStorage.getItem("applicant_page_2_data")

    if (!storedPage1Data || !storedPage2Data) {
      window.location.href = "/applicant/page_1"
      return
    }

    const page1 = JSON.parse(storedPage1Data)
    setPage1Data(page1)
    setPage2Data(JSON.parse(storedPage2Data))
    setEmail(page1.email)
  }, [])

  const handleSendCode = async () => {
    setError("")
    setIsSendingCode(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("[v0] Sending verification code to:", email)

    setIsSendingCode(false)
    setIsCodeSent(true)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setIsVerifying(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate verification (in production, validate against backend)
    if (verificationCode === "123456" || verificationCode.length === 6) {
      console.log("[v0] Application verified and submitted:", {
        ...page1Data,
        ...page2Data,
      })

      setIsVerified(true)

      // Clear session storage after successful submission
      sessionStorage.removeItem("applicant_page_1_data")
      sessionStorage.removeItem("applicant_page_2_data")
    } else {
      setError("Invalid verification code. Please try again.")
    }

    setIsVerifying(false)
  }

  const handleResendCode = async () => {
    setError("")
    setVerificationCode("")
    await handleSendCode()
  }

  const handleBack = () => {
    window.location.href = "/applicant/page_2"
  }

  if (!page1Data) {
    return null
  }

  if (isVerified) {
    return <ApplicantVerifyEmailSuccess />
  }

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-navy-blue">Email Verification</CardTitle>
          <CardDescription>This helps us prevent duplicate applications and confirm your identity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-navy-blue">Your Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="email" value={email} disabled className="pl-10 border-2 bg-muted" />
            </div>
          </div>

          {!isCodeSent ? (
            <Button
              type="button"
              size="lg"
              onClick={handleSendCode}
              disabled={isSendingCode}
              className="w-full bg-peach-orange hover:bg-light-peach text-navy-blue font-semibold"
            >
              {isSendingCode ? "Sending Code..." : "Send Verification Code"}
            </Button>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code" className="text-sm font-medium text-navy-blue">
                  Verification Code
                </Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setVerificationCode(e.target.value.replace(/\D/g, ""))
                  }
                  className={`text-center text-2xl tracking-widest font-mono border-2 ${
                    error ? "border-red-500" : "border-light-gray focus:border-peach-orange"
                  }`}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              <div className="bg-light-gray/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  Check your email for the verification code. It may take a few minutes to arrive.
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isVerifying || verificationCode.length !== 6}
                className="w-full bg-peach-orange hover:bg-light-peach text-navy-blue font-semibold"
              >
                {isVerifying ? "Verifying..." : "Verify & Submit Application"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResendCode}
                className="w-full text-navy-blue hover:text-peach-orange"
              >
                Didn't receive code? Resend
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={handleBack}
        className="w-full border-navy-blue text-navy-blue hover:bg-light-gray bg-transparent"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Previous Page
      </Button>
    </div>
  )
}
