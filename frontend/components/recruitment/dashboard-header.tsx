import { Users, Target, TrendingUp, Award } from "lucide-react"
import { MetricCard } from "./metric-card"
import type { DashboardMetrics } from "@/lib/types"

interface DashboardHeaderProps {
  metrics: DashboardMetrics
}

export function DashboardHeader({ metrics }: DashboardHeaderProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <MetricCard
        metricTitle="Total Candidates"
        metricValue={metrics.totalCandidates}
        metricChange={`+${metrics.candidateChangePercentage}% from last week`}
        changeType="positive"
        icon={Users}
        iconBackgroundColor="bg-primary"
      />
      <MetricCard
        metricTitle="Avg Match Score"
        metricValue={`${metrics.averageMatchScore}%`}
        metricChange={`+${metrics.matchScoreImprovement}% improvement`}
        changeType="positive"
        icon={Target}
        iconBackgroundColor="bg-secondary"
      />
      <MetricCard
        metricTitle="Active Interviews"
        metricValue={metrics.activeInterviews}
        metricChange={`${metrics.interviewsInPipeline} in pipeline`}
        changeType="neutral"
        icon={TrendingUp}
        iconBackgroundColor="bg-success"
      />
      <MetricCard
        metricTitle="Top Skill Match"
        metricValue={`${metrics.topSkillMatchPercentage}%`}
        metricChange={`Above ${metrics.skillMatchThreshold}% score`}
        changeType="positive"
        icon={Award}
        iconBackgroundColor="bg-info"
      />
    </div>
  )
}
