export interface CandidateBasicInfo {
  candidateId: string
  fullName: string
  location: string
  yearsOfExperience: number
  currentCompany: string
}

export interface SkillInfo {
  skillName: string
  proficiencyLevel: "beginner" | "intermediate" | "advanced" | "expert"
  yearsOfExperience: number
  isVerified: boolean
}

export interface ProjectInfo {
  projectId: string
  projectTitle: string
  projectDescription: string
  technologiesUsed: string[]
  githubUrl?: string
  liveUrl?: string
  completionDate: string
}

export interface GitHubMetrics {
  commitFrequency: string
  codeQualityScore: number
  testCoverage: number
  hasDocumentation: boolean
  activityTrend: "increasing" | "stable" | "decreasing"
}

export interface MatchScore {
  overallScore: number
  skillMatchScore: number
  experienceMatchScore: number
  fitLevel: "strong" | "moderate" | "weak"
}

export interface EngineerSummary {
  inferred_seniority: string
  core_strengths: string[]
  working_style: string
  collaboration_style: string
}

export interface CandidateFullProfile {
  basicInfo: CandidateBasicInfo
  skills: SkillInfo[]
  projects: ProjectInfo[]
  githubMetrics?: GitHubMetrics
  matchScore: MatchScore
  hiringRecommendation: string // From GitHub analyzer
  engineerSummary?: EngineerSummary // Personality from GitHub analyzer
  recommendations?: string[] // Hiring recommendations
  resumeUrl: string
}

export interface JobPostingInfo {
  jobId: string
  jobTitle: string
  location: string
  employmentType: "full-time" | "part-time" | "contract"
  salaryRange: {
    minSalary: number
    maxSalary: number
    currency: string
  }
  requiredSkills: string[]
}

export interface DashboardMetrics {
  totalCandidates: number
  candidateChangePercentage: number
  averageMatchScore: number
  matchScoreImprovement: number
  activeInterviews: number
  interviewsInPipeline: number
  topSkillMatchPercentage: number
  skillMatchThreshold: number
}

export interface PipelineStage {
  stageId: string
  stageName: string
  candidateCount: number
}
