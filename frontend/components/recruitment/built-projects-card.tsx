import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Github, Play } from "lucide-react"
import type { ProjectInfo } from "@/lib/types"

interface BuiltProjectsCardProps {
  projects: ProjectInfo[]
  onViewProject?: (projectId: string) => void
}

export function BuiltProjectsCard({ projects }: BuiltProjectsCardProps) {
  return (
    <Card 
      className="h-full border-0 rounded-xl overflow-hidden"
      style={{ 
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        borderLeft: '4px solid #4ECDC4'
      }}
    >
      <CardHeader className="pb-2 pt-4 px-5">
        <CardTitle className="text-base font-semibold">Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-5 pb-4">
        {projects.map((project) => (
          <div 
            key={project.projectId} 
            className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-start gap-3">
              <div>
                <p className="font-semibold text-sm text-foreground">{project.projectTitle}</p>
                <div className="flex items-center flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{project.technologiesUsed.join(" · ")}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <a 
                href={project.githubUrl || "#"} 
                target={project.githubUrl ? "_blank" : undefined} 
                rel={project.githubUrl ? "noopener noreferrer" : undefined}
                className={`p-2 rounded-lg hover:bg-background transition-colors ${project.githubUrl ? "" : "pointer-events-none opacity-40"}`}
                aria-label="GitHub repository"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href={project.liveUrl || "#"} 
                target={project.liveUrl ? "_blank" : undefined} 
                rel={project.liveUrl ? "noopener noreferrer" : undefined}
                className={`p-2 rounded-lg hover:bg-background transition-colors ${project.liveUrl ? "" : "pointer-events-none opacity-40"}`}
                aria-label="Demo / Video"
              >
                <Play className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
