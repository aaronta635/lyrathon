"use client"

import { Plus, Trash2, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ApplicantPage1GithubProjectsProps {
  projectUrls: string[]
  onChange: (urls: string[]) => void
  error?: string
}

export function ApplicantPage1GithubProjects({ projectUrls, onChange, error }: ApplicantPage1GithubProjectsProps) {
  const handleAddProject = () => {
    onChange([...projectUrls, ""])
  }

  const handleRemoveProject = (indexToRemove: number) => {
    if (projectUrls.length > 1) {
      onChange(projectUrls.filter((_, index) => index !== indexToRemove))
    }
  }

  const handleUrlChange = (index: number, value: string) => {
    const updatedUrls = [...projectUrls]
    updatedUrls[index] = value
    onChange(updatedUrls)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {projectUrls.map((projectUrl, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`githubProject${index}`} className="text-navy-blue font-medium flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub Project {index + 1}
              </Label>
              {projectUrls.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveProject(index)}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                id={`githubProject${index}`}
                type="url"
                placeholder="https://github.com/username/repository"
                value={projectUrl}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                className="border-2 border-light-gray focus:border-peach-orange"
              />
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="button"
        variant="outline"
        onClick={handleAddProject}
        className="w-full border-2 border-dashed border-peach-orange text-peach-orange hover:bg-peach-orange/10 bg-transparent"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Project
      </Button>

      <div className="bg-light-gray/50 rounded-lg p-4 border border-light-gray">
        <p className="text-sm text-muted-foreground">
          <strong className="text-navy-blue">Tip:</strong> Include your best repositories that showcase your skills and
          coding style
        </p>
      </div>
    </div>
  )
}
