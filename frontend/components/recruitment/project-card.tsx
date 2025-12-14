"use client"

import { Card } from "@/components/ui/card"
import { ExternalLink, Github, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SkillBadge } from "./skill-badge"
import type { ProjectInfo } from "@/lib/types"

interface ProjectCardProps {
  projectInfo: ProjectInfo
  onViewProject?: (projectId: string) => void
}

export function ProjectCard({ projectInfo, onViewProject }: ProjectCardProps) {
  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-success/10 rounded-lg">
            <CheckCircle className="h-5 w-5 text-success" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">{projectInfo.projectTitle}</h4>
            <p className="text-sm text-muted-foreground">{projectInfo.technologiesUsed.join(" + ")}</p>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{projectInfo.projectDescription}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {projectInfo.technologiesUsed.slice(0, 3).map((tech) => (
          <SkillBadge key={tech} skillName={tech} size="sm" />
        ))}
      </div>

      <div className="flex gap-2">
        {projectInfo.githubUrl && (
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <Github className="h-4 w-4" />
            GitHub
          </Button>
        )}
        {projectInfo.liveUrl && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-transparent"
            onClick={() => onViewProject?.(projectInfo.projectId)}
          >
            <ExternalLink className="h-4 w-4" />
            View Demo
          </Button>
        )}
      </div>
    </Card>
  )
}
