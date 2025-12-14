"use client"

import { ChevronDown } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface JobTitleProps {
  selectedJobId: string
  jobs: { jobId: string; jobTitle: string }[]
  onJobChange: (jobId: string) => void
  className?: string
}

export function JobTitle({ selectedJobId, jobs, onJobChange, className = "" }: JobTitleProps) {
  return (
    <div className={`mb-3 ${className}`}>
      <Select value={selectedJobId} onValueChange={onJobChange}>
        <SelectTrigger className="w-auto border-none shadow-none p-0 h-auto text-4xl font-bold text-foreground hover:text-foreground/80 transition-colors [&>svg]:h-8 [&>svg]:w-8 [&>svg]:ml-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-lg py-3">
            All Positions
          </SelectItem>
          {jobs.map((job) => (
            <SelectItem key={job.jobId} value={job.jobId} className="text-lg py-3">
              {job.jobTitle}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
