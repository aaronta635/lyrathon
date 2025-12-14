import { ApplicantPage2Form } from "./applicant_page_2_form"
import NavigationHeader from "@/components/navigation_header"

export default function ApplicantPage2() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader currentMode="applicant" />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-navy-blue">Additional Information</h1>
            <p className="text-lg text-muted-foreground">Share your online presence and project details</p>
          </div>
          <ApplicantPage2Form />
        </div>
      </main>
    </div>
  )
}
