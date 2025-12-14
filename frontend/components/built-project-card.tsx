import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Wrench } from "lucide-react"
import { ProjectCard } from "./project-card"
import type { ProjectInfo } from "@/lib/types"

interface BuiltProjectsCardProps {
  projects: ProjectInfo[]
  onViewProject?: (projectId: string) => void
}

export function BuiltProjectsCard({ projects, onViewProject }: BuiltProjectsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wrench className="h-5 w-5" />
          Built
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {projects.map((project) => (
          <ProjectCard key={project.projectId} projectInfo={project} onViewProject={onViewProject} />
        ))}
      </CardContent>
    </Card>
  )
}
