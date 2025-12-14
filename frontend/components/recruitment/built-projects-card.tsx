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
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        borderLeft: '4px solid #4ECDC4'
      }}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <span>🚀</span>
          Built Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {projects.map((project) => (
          <div 
            key={project.projectId} 
            className="flex items-start justify-between gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-lg">
                💻
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{project.projectTitle}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{project.technologiesUsed.join(" · ")}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Play className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
