import { FileText } from "lucide-react"

export function ApplicantPage1Header() {
  return (
    <header className="border-b border-border bg-navy-blue">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-peach-orange flex items-center justify-center">
            <FileText className="w-6 h-6 text-navy-blue" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Application Portal</h2>
            <p className="text-sm text-light-peach">Submit your credentials</p>
          </div>
        </div>
      </div>
    </header>
  )
}
