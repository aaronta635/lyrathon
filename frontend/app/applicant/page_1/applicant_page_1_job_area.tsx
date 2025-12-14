"use client"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Code, Layers, Server } from "lucide-react"

interface ApplicantPage1JobAreaProps {
  selectedJobArea: string
  onChange: (value: string) => void
  error?: string
}

export function ApplicantPage1JobArea({ selectedJobArea, onChange, error }: ApplicantPage1JobAreaProps) {
  const jobAreas = [
    {
      value: "frontend",
      label: "Frontend Developer",
      description: "UI/UX, React, Vue, Angular",
      icon: Code,
    },
    {
      value: "backend",
      label: "Backend Developer",
      description: "APIs, Databases, Server-side",
      icon: Server,
    },
    {
      value: "fullstack",
      label: "Full-Stack Developer",
      description: "Frontend + Backend",
      icon: Layers,
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="job-area" className="text-base font-semibold text-navy-blue">
          What area are you looking for a job in? *
        </Label>
        <p className="text-sm text-muted-foreground mt-1">Select your preferred development area</p>
      </div>

      <RadioGroup value={selectedJobArea} onValueChange={onChange} className="space-y-3">
        {jobAreas.map((area) => {
          const Icon = area.icon
          return (
            <div
              key={area.value}
              className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                selectedJobArea === area.value
                  ? "border-peach-orange bg-light-peach/10 shadow-sm"
                  : "border-gray-200 hover:border-peach-orange/50"
              }`}
              onClick={() => onChange(area.value)}
            >
              <RadioGroupItem value={area.value} id={area.value} className="mt-1" />
              <div className="flex-1 flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    selectedJobArea === area.value ? "bg-peach-orange text-white" : "bg-light-gray text-navy-blue"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <Label htmlFor={area.value} className="text-base font-medium cursor-pointer text-navy-blue">
                    {area.label}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">{area.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </RadioGroup>

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  )
}
