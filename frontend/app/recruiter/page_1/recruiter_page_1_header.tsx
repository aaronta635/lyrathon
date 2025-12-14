import { Briefcase } from "lucide-react"

export default function RecruiterPage1Header() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-[#00756a] rounded-lg shadow-sm">
          <Briefcase className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#004038]">Post a New Job</h1>
          <p className="text-[#00756a] mt-1">Find the perfect candidates for your team</p>
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-[#00756a] to-[#e0f5f3] rounded-full" />
    </div>
  )
}
