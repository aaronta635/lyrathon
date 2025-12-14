"use client"

import { Github } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ApplicantPage1GithubProjectsProps {
  githubUrl: string
  onChange: (url: string) => void
  error?: string
}

export function ApplicantPage1GithubProjects({ githubUrl, onChange, error }: ApplicantPage1GithubProjectsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="githubUrl" className="text-navy-blue font-medium flex items-center gap-2">
          <Github className="w-4 h-4" />
          GitHub URL *
        </Label>
        <Input
          id="githubUrl"
          type="url"
          placeholder="https://github.com/username or https://github.com/username/repository"
          value={githubUrl}
          onChange={(e) => onChange(e.target.value)}
          className={`border-2 ${error ? "border-red-500" : "border-light-gray focus:border-peach-orange"}`}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <div className="bg-light-gray/50 rounded-lg p-4 border border-light-gray">
        <p className="text-sm text-muted-foreground">
          <strong className="text-navy-blue">Tip:</strong> You can provide your GitHub profile URL or a specific repository URL
        </p>
      </div>
    </div>
  )
}
