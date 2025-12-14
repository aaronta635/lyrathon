import { FileText, RefreshCw } from "lucide-react"
import Link from "next/link"

export function ApplicantPage1Header() {
  return (
    <header className="border-b border-border bg-navy-blue">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-peach-orange flex items-center justify-center">
              <FileText className="w-6 h-6 text-navy-blue" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Application Portal</h2>
              <p className="text-sm text-light-peach">Submit your credentials</p>
            </div>
          </div>

          <Link href="/recruiter/dashboard">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm font-medium transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Switch to Recruiter Mode</span>
              <span className="sm:hidden">Recruiter</span>
            </button>
          </Link>
        </div>
      </div>
    </header>
  )
}
