import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wrench, CheckCircle, Github, Play } from "lucide-react"
import type { ProjectInfo } from "@/lib/types"

interface BuiltProjectsCardProps {
  projects: ProjectInfo[]
  onViewProject?: (projectId: string) => void
}

export function BuiltProjectsCard({ projects, onViewProject }: BuiltProjectsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wrench className="h-5 w-5" />
          Built
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {projects.map((project) => (
          <div key={project.projectId} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-background shadow-sm border">
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-full bg-success/10">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">{project.projectTitle}</p>
                <p className="text-xs text-muted-foreground">{project.technologiesUsed.join(" + ")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href={project.githubUrl || "#"} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href={project.liveUrl || "#"} target="_blank" rel="noopener noreferrer">
                  <Play className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
