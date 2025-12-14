import { ApplicantPage1Form } from "./applicant_page_1_form"
import { ApplicantPage1Header } from "./applicant_page_1_header"

export default function ApplicantPage1() {
  return (
    <div className="min-h-screen bg-background">
      <ApplicantPage1Header />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-navy-blue">Submit Your Application</h1>
            <p className="text-lg text-muted-foreground">
              Upload your resume and share your GitHub projects to get started
            </p>
          </div>
          <ApplicantPage1Form />
        </div>
      </main>
    </div>
  )
}
