"use client"

import { Label } from "@/components/ui/label"
import { Code, Server, Layers, Cog } from "lucide-react"

interface RecruiterPage1EngineeringTypeProps {
  selectedType: string
  onTypeChange: (type: string) => void
  error?: string
}

const engineeringTypes = [
  {
    id: "frontend",
    label: "Frontend Developer",
    icon: Code,
    description: "UI/UX focused, React, Vue, Angular",
  },
  {
    id: "backend",
    label: "Backend Developer",
    icon: Server,
    description: "APIs, databases, server logic",
  },
  {
    id: "fullstack",
    label: "Full-Stack Developer",
    icon: Layers,
    description: "Both frontend and backend",
  },
  {
    id: "devops",
    label: "DevOps Engineer",
    icon: Cog,
    description: "Infrastructure, CI/CD, cloud",
  },
]

export default function RecruiterPage1EngineeringType({
  selectedType,
  onTypeChange,
  error,
}: RecruiterPage1EngineeringTypeProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#e0f5f3] p-6 space-y-4">
      <div>
        <Label className="text-xl font-semibold text-[#004038]">
          Engineering Type <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-[#00756a] mt-1">What type of developer are you looking for?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {engineeringTypes.map((type) => {
          const Icon = type.icon
          const isSelected = selectedType === type.id

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onTypeChange(type.id)}
              className={`
                relative flex items-start gap-3 p-4 rounded-lg border-2 transition-all
                ${
                  isSelected
                    ? "border-[#00756a] bg-[#e0f5f3] shadow-md"
                    : "border-[#e6e6e6] bg-white hover:border-[#00756a] hover:bg-[#f6fefb]"
                }
              `}
            >
              <div
                className={`
                p-2 rounded-lg transition-colors
                ${isSelected ? "bg-[#00756a]" : "bg-[#e0f5f3]"}
              `}
              >
                <Icon className={`h-5 w-5 ${isSelected ? "text-white" : "text-[#00756a]"}`} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-[#004038]">{type.label}</h3>
                <p className="text-sm text-[#00756a] mt-1">{type.description}</p>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 h-5 w-5 bg-[#00756a] rounded-full flex items-center justify-center">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
