import { ApplicantVerifyEmailForm } from "./applicant_verify_email_form"
import NavigationHeader from "@/components/navigation_header"

export default function ApplicantVerifyEmail() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader currentMode="applicant" />
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-navy-blue">Verify Your Email</h1>
            <p className="text-lg text-muted-foreground">
              We'll send you a verification code to confirm your application
            </p>
          </div>
          <ApplicantVerifyEmailForm />
        </div>
      </main>
    </div>
  )
}
