"use client"

import { useState } from "react"
import { Calendar, Search } from "lucide-react"
import { JobPostingHeader } from "@/components/recruitment/job-posting-header"
import { DashboardHeader } from "@/components/recruitment/dashboard-header"
import { SearchFilterBar } from "@/components/recruitment/search-filter-bar"
import { CandidateCard } from "@/components/recruitment/candidate-card"
import { CandidateDetailModal } from "@/components/recruitment/candidate-detail-modal"
import { Input } from "@/components/ui/input"
import type { JobPostingInfo, DashboardMetrics, CandidateFullProfile } from "@/lib/types"

// Mock data for demonstration
const mockJobInfo: JobPostingInfo = {
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
}

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
    matchScore: {
      overallScore: 65,
      skillMatchScore: 70,
      experienceMatchScore: 60,
      fitLevel: "weak" as const,
    },
    topSkills: ["JavaScript", "Vue.js", "MongoDB"],
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
}

export default function RecruitmentDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedSkillFilter, setSelectedSkillFilter] = useState("all")
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

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
        {/* Job posting header */}
        <JobPostingHeader jobInfo={mockJobInfo} />

        {/* Dashboard metrics */}
        <DashboardHeader metrics={mockMetrics} />

        {/* Section title */}
        <h2 className="text-2xl font-bold text-foreground mb-6">4 Applicants</h2>

        {/* Search and filters */}
        <div className="mb-6">
          <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            selectedSkillFilter={selectedSkillFilter}
            onSkillFilterChange={setSelectedSkillFilter}
            onAdvancedFiltersClick={() => console.log("Advanced filters clicked")}
          />
          {/* Search other positions */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Search other positions:</span>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search positions by title, location, or skills..."
                className="pl-10"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    console.log("Searching other positions:", e.currentTarget.value)
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Candidate cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.candidateInfo.candidateId}
              candidateInfo={candidate.candidateInfo}
              matchScore={candidate.matchScore}
              topSkills={candidate.topSkills}
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
