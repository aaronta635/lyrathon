"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import NavigationHeader from "@/components/navigation_header"
import { JobBlock } from "@/components/recruitment/job-block"
import { CandidateCard } from "@/components/recruitment/candidate-card"
import { CandidateDetailModal } from "@/components/recruitment/candidate-detail-modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { JobPostingInfo, DashboardMetrics, CandidateFullProfile } from "@/lib/types"

// Mock data for demonstration
const mockJobs: JobPostingInfo[] = [
  {
    jobId: "job-001",
    jobTitle: "Senior Full-Stack Engineer",
    location: "Sydney",
    employmentType: "full-time",
    salaryRange: {
      minSalary: 140000,
      maxSalary: 180000,
      currency: "AUD",
    },
    requiredSkills: ["AWS", "PostgreSQL", "React", "Node.js"],
  },
  {
    jobId: "job-002",
    jobTitle: "Frontend Developer",
    location: "Melbourne",
    employmentType: "full-time",
    salaryRange: {
      minSalary: 100000,
      maxSalary: 130000,
      currency: "AUD",
    },
    requiredSkills: ["React", "TypeScript", "CSS", "Figma"],
  },
  {
    jobId: "job-003",
    jobTitle: "Backend Engineer",
    location: "Sydney",
    employmentType: "full-time",
    salaryRange: {
      minSalary: 120000,
      maxSalary: 160000,
      currency: "AUD",
    },
    requiredSkills: ["Python", "PostgreSQL", "AWS", "Docker"],
  },
  {
    jobId: "job-004",
    jobTitle: "DevOps Engineer",
    location: "Remote",
    employmentType: "contract",
    salaryRange: {
      minSalary: 130000,
      maxSalary: 170000,
      currency: "AUD",
    },
    requiredSkills: ["Kubernetes", "AWS", "Terraform", "CI/CD"],
  },
]

const mockMetrics: DashboardMetrics = {
  totalCandidates: 6,
  candidateChangePercentage: 12,
  averageMatchScore: 89,
  matchScoreImprovement: 5,
  activeInterviews: 5,
  interviewsInPipeline: 5,
  topSkillMatchPercentage: 100,
  skillMatchThreshold: 85,
}

const mockCandidates = [
  {
    candidateInfo: {
      candidateId: "cand-001",
      fullName: "Sarah Chen",
      location: "Sydney, AU",
      yearsOfExperience: 5,
      currentCompany: "Tech Corp",
    },
    engineeringType: "Full-Stack",
    matchScore: {
      overallScore: 92,
      skillMatchScore: 95,
      experienceMatchScore: 90,
      fitLevel: "strong" as const,
    },
    topSkills: ["React", "Node.js", "AWS"],
  },
  {
    candidateInfo: {
      candidateId: "cand-002",
      fullName: "Marcus Rodriguez",
      location: "Melbourne, AU",
      yearsOfExperience: 3,
      currentCompany: "StartupXYZ",
    },
    engineeringType: "Backend",
    matchScore: {
      overallScore: 78,
      skillMatchScore: 80,
      experienceMatchScore: 75,
      fitLevel: "moderate" as const,
    },
    topSkills: ["Python", "Django", "PostgreSQL"],
  },
  {
    candidateInfo: {
      candidateId: "cand-003",
      fullName: "Emma Watson",
      location: "Sydney, AU",
      yearsOfExperience: 4,
      currentCompany: "Digital Agency",
    },
    engineeringType: "Frontend",
    matchScore: {
      overallScore: 85,
      skillMatchScore: 88,
      experienceMatchScore: 82,
      fitLevel: "strong" as const,
    },
    topSkills: ["React", "TypeScript", "GraphQL"],
  },
  {
    candidateInfo: {
      candidateId: "cand-004",
      fullName: "James Park",
      location: "Brisbane, AU",
      yearsOfExperience: 2,
      currentCompany: "Consulting Firm",
    },
    engineeringType: "Frontend",
    matchScore: {
      overallScore: 65,
      skillMatchScore: 70,
      experienceMatchScore: 60,
      fitLevel: "weak" as const,
    },
    topSkills: ["JavaScript", "Vue.js", "MongoDB"],
  },
  {
    candidateInfo: {
      candidateId: "cand-005",
      fullName: "Lisa Kumar",
      location: "Remote",
      yearsOfExperience: 6,
      currentCompany: "CloudTech Inc",
    },
    engineeringType: "DevOps",
    matchScore: {
      overallScore: 88,
      skillMatchScore: 90,
      experienceMatchScore: 85,
      fitLevel: "strong" as const,
    },
    topSkills: ["Kubernetes", "AWS", "Terraform"],
  },
  {
    candidateInfo: {
      candidateId: "cand-006",
      fullName: "Tom Wilson",
      location: "Sydney, AU",
      yearsOfExperience: 7,
      currentCompany: "Enterprise Corp",
    },
    engineeringType: "Full-Stack",
    matchScore: {
      overallScore: 95,
      skillMatchScore: 98,
      experienceMatchScore: 92,
      fitLevel: "strong" as const,
    },
    topSkills: ["React", "Node.js", "PostgreSQL"],
  },
]

const mockFullProfile: CandidateFullProfile = {
  basicInfo: {
    candidateId: "cand-001",
    fullName: "Sarah Chen",
    location: "Sydney, AU",
    yearsOfExperience: 5,
    currentCompany: "Tech Corp",
  },
  matchScore: {
    overallScore: 92,
    skillMatchScore: 95,
    experienceMatchScore: 90,
    fitLevel: "strong",
  },
  skills: [
    { skillName: "React", proficiencyLevel: "expert", yearsOfExperience: 5, isVerified: true },
    { skillName: "Node.js", proficiencyLevel: "expert", yearsOfExperience: 5, isVerified: true },
    { skillName: "AWS", proficiencyLevel: "advanced", yearsOfExperience: 4, isVerified: true },
    { skillName: "PostgreSQL", proficiencyLevel: "advanced", yearsOfExperience: 4, isVerified: false },
    { skillName: "TypeScript", proficiencyLevel: "expert", yearsOfExperience: 4, isVerified: true },
  ],
  projects: [
    {
      projectId: "proj-001",
      projectTitle: "Payment integration",
      projectDescription: "Built scalable payment processing system with Stripe",
      technologiesUsed: ["Stripe", "Node.js", "React"],
      githubUrl: "https://github.com/example",
      completionDate: "2024-01",
    },
    {
      projectId: "proj-002",
      projectTitle: "E-commerce platform",
      projectDescription: "Full-stack e-commerce solution with real-time inventory",
      technologiesUsed: ["Next.js", "PostgreSQL"],
      liveUrl: "https://example.com",
      completionDate: "2023-09",
    },
    {
      projectId: "proj-003",
      projectTitle: "Auth system",
      projectDescription: "Secure authentication system with OAuth support",
      technologiesUsed: ["Supabase Auth", "React"],
      githubUrl: "https://github.com/example",
      completionDate: "2023-05",
    },
  ],
  githubMetrics: {
    commitFrequency: "4-5 days/week for 18 months",
    codeQualityScore: 85,
    testCoverage: 80,
    hasDocumentation: true,
    activityTrend: "increasing",
  },
  professionalSummary: "Backend engineer with verified AWS + SQL experience, Sydney-based, 5 years experience.",
  resumeUrl: "/resumes/sarah-chen.pdf",
  strengths: [
    "Strong React and TypeScript expertise",
    "Proven AWS cloud experience",
    "Excellent code quality scores",
  ],
  risks: [
    "Limited Next.js App Router experience",
    "No Tailwind CSS v4 experience",
    "Unfamiliar with Radix UI primitives",
  ],
}

export default function RecruiterDashboard() {
  const [selectedJobId, setSelectedJobId] = useState("job-001")
  const [jobOverrides, setJobOverrides] = useState<Partial<JobPostingInfo>>({})
  const [sortBy, setSortBy] = useState("score-desc")
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const allJobsDefault: JobPostingInfo = {
    jobId: "all",
    jobTitle: "All Positions",
    location: "All Locations",
    employmentType: "all" as JobPostingInfo["employmentType"],
    salaryRange: { minSalary: 0, maxSalary: 999999, currency: "AUD" },
    requiredSkills: [],
  }
  const baseJob = selectedJobId === "all" ? allJobsDefault : (mockJobs.find((job) => job.jobId === selectedJobId) || mockJobs[0])
  const currentJob = { ...baseJob, ...jobOverrides }
  
  const handleJobInfoUpdate = (updates: Partial<JobPostingInfo>) => {
    setJobOverrides(prev => ({ ...prev, ...updates }))
  }
  
  // Filter candidates by location and skill match, then sort
  const filteredAndSortedCandidates = mockCandidates
    .filter(candidate => {
      // Location filter: "All Locations" shows everyone, otherwise match job location or Remote
      const jobLocation = currentJob.location
      const candidateLocation = candidate.candidateInfo.location.split(",")[0].trim()
      const locationMatch = jobLocation === "All Locations" || jobLocation === "Remote" || candidateLocation === jobLocation || candidateLocation === "Remote"
      
      // Skill match: if no skills required or candidate has at least one required skill
      const hasSkillMatch = currentJob.requiredSkills.length === 0 || currentJob.requiredSkills.some(skill => 
        candidate.topSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      )
      
      return locationMatch && hasSkillMatch
    })
    .map(candidate => {
      // Recalculate match score based on skill overlap
      const skillOverlap = currentJob.requiredSkills.length > 0 
        ? currentJob.requiredSkills.filter(skill =>
            candidate.topSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
          ).length
        : candidate.topSkills.length
      const skillMatchPercent = currentJob.requiredSkills.length > 0
        ? Math.round((skillOverlap / currentJob.requiredSkills.length) * 100)
        : 100
      
      return {
        ...candidate,
        dynamicScore: Math.round((candidate.matchScore.overallScore + skillMatchPercent) / 2)
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score-desc":
          return b.dynamicScore - a.dynamicScore
        case "score-asc":
          return a.dynamicScore - b.dynamicScore
        case "exp-desc":
          return b.candidateInfo.yearsOfExperience - a.candidateInfo.yearsOfExperience
        case "exp-asc":
          return a.candidateInfo.yearsOfExperience - b.candidateInfo.yearsOfExperience
        default:
          return 0
      }
    })

  const handleCandidateClick = (candidateId: string) => {
    setSelectedCandidateId(candidateId)
    setIsDetailModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsDetailModalOpen(false)
    setSelectedCandidateId(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader currentMode="recruiter" />

      {/* Header with logo and date */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Talent Pipeline</h1>
              <p className="text-sm text-muted-foreground">Candidate Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>December 13, 2025</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-8">
        {/* Job posting block with inline metrics */}
        <JobBlock 
          jobInfo={currentJob}
          metrics={mockMetrics}
          allJobs={mockJobs.map((j) => ({ jobId: j.jobId, jobTitle: j.jobTitle }))}
          onJobChange={(jobId) => {
            setSelectedJobId(jobId)
            setJobOverrides({}) // Reset overrides when changing jobs
          }}
          onJobInfoUpdate={handleJobInfoUpdate}
        />

        {/* Section title + sort */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">{filteredAndSortedCandidates.length} Applicants</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score-desc">Match Score ↓</SelectItem>
                <SelectItem value="score-asc">Match Score ↑</SelectItem>
                <SelectItem value="exp-desc">Experience ↓</SelectItem>
                <SelectItem value="exp-asc">Experience ↑</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Candidate cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredAndSortedCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.candidateInfo.candidateId}
              candidateInfo={candidate.candidateInfo}
              matchScore={{ ...candidate.matchScore, overallScore: candidate.dynamicScore }}
              topSkills={candidate.topSkills}
              engineeringType={candidate.engineeringType}
              onCardClick={handleCandidateClick}
            />
          ))}
        </div>
      </main>

      {/* Candidate detail modal */}
      <CandidateDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        candidateProfile={selectedCandidateId ? mockFullProfile : null}
        onMoveToInterview={(id) => console.log("Move to interview:", id)}
        onReject={(id) => console.log("Reject candidate:", id)}
        onViewResume={(url) => console.log("View resume:", url)}
      />
    </div>
  )
}
