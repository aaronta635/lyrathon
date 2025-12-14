import RecruiterPage1Form from "./recruiter_page_1_form"
import NavigationHeader from "@/components/navigation_header"
import { Calendar, Briefcase } from "lucide-react"

export default function RecruiterPage1() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader currentMode="recruiter" />
      
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
              <Briefcase className="h-6 w-6 text-white drop-shadow-md" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Post a New Job</h1>
              <p className="text-sm text-white/80" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>Find the perfect candidates for your team</p>
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

      <RecruiterPage1Form />
    </div>
  )
}
