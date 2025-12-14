import { ApplicantPage1Form } from "./applicant_page_1_form"
import NavigationHeader from "@/components/navigation_header"
import { Calendar } from "lucide-react"

export default function ApplicantPage1() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader currentMode="applicant" />
      
      {/* Header with marble texture */}
      <header 
        className="relative z-10 border-b border-border"
        style={{ 
          backgroundImage: `linear-gradient(90deg, rgba(26,90,82,0.3) 0%, rgba(0,0,0,0.2) 100%), url('/textures/marble-teal.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: '20% center',
        }}
      >
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-sm" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              <svg className="h-6 w-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Application Portal</h1>
              <p className="text-sm text-white/80" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>Submit your credentials</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-white/80" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
              <Calendar className="h-4 w-4 drop-shadow-md" />
              <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Submit Your Application</h1>
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
