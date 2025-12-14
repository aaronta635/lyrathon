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
    <div className={className}>
      <Select value={selectedJobId} onValueChange={onJobChange}>
        <SelectTrigger className="w-auto border-none shadow-none p-0 h-auto text-3xl font-bold text-foreground hover:text-primary transition-colors [&>svg]:h-6 [&>svg]:w-6 [&>svg]:ml-2 [&>svg]:text-secondary">
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
