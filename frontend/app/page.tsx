"use client"

import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"
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
    availability: "full-time",
    expectedSalary: 160000,
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
      location: "Sydney, AU",
      yearsOfExperience: 3,
      currentCompany: "StartupXYZ",
    },
    engineeringType: "Backend",
    availability: "full-time",
    expectedSalary: 120000,
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
      location: "Melbourne, AU",
      yearsOfExperience: 4,
      currentCompany: "Digital Agency",
    },
    engineeringType: "Frontend",
    availability: "full-time",
    expectedSalary: 115000,
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
      location: "Melbourne, AU",
      yearsOfExperience: 2,
      currentCompany: "Consulting Firm",
    },
    engineeringType: "Frontend",
    availability: "part-time",
    expectedSalary: 85000,
    matchScore: {
      overallScore: 65,
      skillMatchScore: 70,
      experienceMatchScore: 60,
      fitLevel: "weak" as const,
    },
    topSkills: ["JavaScript", "Vue.js", "CSS"],
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
    availability: "contract",
    expectedSalary: 150000,
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
    availability: "full-time",
    expectedSalary: 175000,
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
  linkedinUrl: "https://www.linkedin.com/in/sarah-chen",
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
  hiringRecommendation: "Strong candidate. React and Node.js experience is excellent and well-documented. AWS skills are production-tested. However, lacks modern Next.js App Router experience which may require onboarding time.",
  engineerSummary: {
    inferred_seniority: "mid to senior-level",
    core_strengths: ["React", "Node.js", "AWS"],
    working_style: "independent with collaborative tendencies",
    collaboration_style: "active team contributor",
  },
  recommendations: [
    "Strong fit for senior full-stack roles requiring React expertise",
    "Would benefit from pair programming on Next.js 14 features",
    "Consider for backend-heavy projects with cloud infrastructure needs",
  ],
  resumeUrl: "/resumes/sarah-chen.pdf",
}

export default function RecruitmentDashboard() {
  const [selectedJobId, setSelectedJobId] = useState("job-001")
  const [jobOverrides, setJobOverrides] = useState<Partial<JobPostingInfo>>({})
  const [sortBy, setSortBy] = useState("score-desc")
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [toInterviewIds, setToInterviewIds] = useState<string[]>([])
  const [rejectedIds, setRejectedIds] = useState<string[]>([])

  // Persist view state locally
  useEffect(() => {
    const saved = localStorage.getItem("recruiter-state")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.selectedJobId) setSelectedJobId(parsed.selectedJobId)
        if (parsed.jobOverrides) setJobOverrides(parsed.jobOverrides)
        if (parsed.sortBy) setSortBy(parsed.sortBy)
        if (parsed.toInterviewIds) setToInterviewIds(parsed.toInterviewIds)
        if (parsed.rejectedIds) setRejectedIds(parsed.rejectedIds)
      } catch (e) {
        console.error("Failed to parse saved recruiter state", e)
      }
    }
  }, [])

  useEffect(() => {
    const payload = {
      selectedJobId,
      jobOverrides,
      sortBy,
      toInterviewIds,
      rejectedIds,
    }
    localStorage.setItem("recruiter-state", JSON.stringify(payload))
  }, [selectedJobId, jobOverrides, sortBy, toInterviewIds, rejectedIds])

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
  
  // Get job type from job title for matching
  const getJobType = (jobTitle: string): string[] => {
    const title = jobTitle.toLowerCase()
    if (title.includes("full-stack") || title.includes("fullstack")) return ["Full-Stack"]
    if (title.includes("frontend") || title.includes("front-end")) return ["Frontend"]
    if (title.includes("backend") || title.includes("back-end")) return ["Backend"]
    if (title.includes("devops") || title.includes("dev ops")) return ["DevOps"]
    return [] // All Positions - no type filter
  }
  
  const jobTypes = getJobType(currentJob.jobTitle)
  
  // Filter candidates by engineering type, location, and skill match
  const filteredAndSortedCandidates = mockCandidates
    .filter(candidate => {
      if (rejectedIds.includes(candidate.candidateInfo.candidateId)) return false
      // Engineering type match: if job has specific type, candidate must match
      const typeMatch = jobTypes.length === 0 || jobTypes.includes(candidate.engineeringType)
      
      // Location filter: strict matching
      const jobLocation = currentJob.location
      const candidateLocation = candidate.candidateInfo.location.split(",")[0].trim()
      let locationMatch = true
      if (jobLocation !== "All Locations") {
        if (jobLocation === "Remote") {
          // Remote job: show Remote candidates + anyone willing to work remote
          locationMatch = candidateLocation === "Remote"
        } else {
          // Specific city: show candidates from that city OR Remote candidates
          locationMatch = candidateLocation === jobLocation || candidateLocation === "Remote"
        }
      }
      
      // Availability match: "all" shows everyone, otherwise must match exactly
      const jobEmploymentType = currentJob.employmentType as string
      const availabilityMatch = jobEmploymentType === "all" || candidate.availability === jobEmploymentType
      
      // Salary match: candidate's expected salary should be within job's salary range
      const salaryMatch = currentJob.salaryRange.minSalary === 0 || 
        (candidate.expectedSalary >= currentJob.salaryRange.minSalary && 
         candidate.expectedSalary <= currentJob.salaryRange.maxSalary)
      
      // Skill match: if no skills required or candidate has at least one required skill
      const hasSkillMatch = currentJob.requiredSkills.length === 0 || currentJob.requiredSkills.some(skill => 
        candidate.topSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      )
      
      // Must match ALL: type AND location AND availability AND salary AND skills
      return typeMatch && locationMatch && availabilityMatch && salaryMatch && hasSkillMatch
    })

  const computeDynamicScore = (candidate: typeof mockCandidates[number]) => {
    const skillOverlap = currentJob.requiredSkills.length > 0 
      ? currentJob.requiredSkills.filter(skill =>
          candidate.topSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
        ).length
      : candidate.topSkills.length
    const skillMatchPercent = currentJob.requiredSkills.length > 0
      ? Math.round((skillOverlap / currentJob.requiredSkills.length) * 100)
      : 100
    return Math.round((candidate.matchScore.overallScore + skillMatchPercent) / 2)
  }

  const withDynamic = filteredAndSortedCandidates.map((candidate) => ({
    ...candidate,
    dynamicScore: computeDynamicScore(candidate),
  })).sort((a, b) => {
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

  const talentPoolCandidates = withDynamic.filter(
    (c) => !toInterviewIds.includes(c.candidateInfo.candidateId)
  )

  const toInterviewCandidates = toInterviewIds
    .map((id) => withDynamic.find((c) => c.candidateInfo.candidateId === id) || mockCandidates.find((c) => c.candidateInfo.candidateId === id))
    .filter((c): c is typeof withDynamic[number] => Boolean(c))
    .map((candidate) => ({
      ...candidate,
      dynamicScore: "dynamicScore" in candidate ? candidate.dynamicScore : computeDynamicScore(candidate),
    }))

  const handleCandidateClick = (candidateId: string) => {
    setSelectedCandidateId(candidateId)
    setIsDetailModalOpen(true)
  }

  const handleMoveToInterview = (candidateId: string) => {
    setToInterviewIds((prev) =>
      prev.includes(candidateId) ? prev : [...prev, candidateId]
    )
    setRejectedIds((prev) => prev.filter((id) => id !== candidateId))
  }

  const handleReject = (candidateId: string) => {
    setRejectedIds((prev) =>
      prev.includes(candidateId) ? prev : [...prev, candidateId]
    )
    setToInterviewIds((prev) => prev.filter((id) => id !== candidateId))
    setIsDetailModalOpen(false)
    setSelectedCandidateId(null)
  }

  const handleCloseModal = () => {
    setIsDetailModalOpen(false)
    setSelectedCandidateId(null)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Organic blob shapes - teal only */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(78, 205, 196, 0.12) 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(60, 141, 147, 0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(69, 183, 175, 0.1) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 right-10 w-16 h-16 rounded-full bg-accent/10" />
        <div className="absolute bottom-40 left-20 w-12 h-12 rounded-full bg-secondary/10" />
      </div>

      {/* Header with marble texture background */}
      <header 
        className="relative z-10"
        style={{ 
          backgroundImage: `linear-gradient(90deg, rgba(26,90,82,0.3) 0%, rgba(0,0,0,0.2) 100%), url('/textures/marble-teal.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: '20% center',
        }}
      >
        <div className="container mx-auto pl-8 pr-8 py-5 flex items-center justify-between">
          {/* Left: Logo and brand */}
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-sm" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              <svg className="h-6 w-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Talent Pipeline</h1>
              <p className="text-sm text-white/80" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>Candidate Management System</p>
            </div>
          </div>
          
          {/* Right: Navigation and actions */}
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-4">
              <a href="#" className="text-sm font-medium text-white/90 hover:text-white transition-colors" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>Dashboard</a>
              <a href="#" className="text-sm font-medium text-white/90 hover:text-white transition-colors" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>Jobs</a>
              <a href="#" className="text-sm font-medium text-white/90 hover:text-white transition-colors" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>Candidates</a>
            </nav>
            <div className="flex items-center gap-4 pl-4 border-l border-white/20">
              <button className="text-white/80 hover:text-white transition-colors">
                <svg className="h-5 w-5 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="flex items-center gap-2 text-sm text-white/80" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                <Calendar className="h-4 w-4 drop-shadow-md" />
                <span>Dec 14, 2025</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-sm" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                RS
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-8 py-10">
        {/* Job posting block with inline metrics */}
        <JobBlock 
          jobInfo={currentJob}
          metrics={{
            totalCandidates: talentPoolCandidates.length,
            averageMatchScore: talentPoolCandidates.length
              ? Math.round(
                  talentPoolCandidates.reduce((sum, c) => sum + c.dynamicScore, 0) /
                  talentPoolCandidates.length
                )
              : 0,
            interviewCount: toInterviewCandidates.length,
          }}
          allJobs={mockJobs.map((j) => ({ jobId: j.jobId, jobTitle: j.jobTitle }))}
          onJobChange={(jobId) => {
            setSelectedJobId(jobId)
            setJobOverrides({}) // Reset overrides when changing jobs
          }}
          onJobInfoUpdate={handleJobInfoUpdate}
        />

        {/* Section title + sort */}
        <div className="flex flex-col xl:flex-row gap-6 px-0">
          {/* Talent Pool (left) */}
          <div className="flex-1 xl:basis-[68%]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">{talentPoolCandidates.length} Applicants</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground font-medium">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] h-9 text-sm font-medium">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {talentPoolCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.candidateInfo.candidateId}
                  candidateInfo={candidate.candidateInfo}
                  matchScore={{ ...candidate.matchScore, overallScore: candidate.dynamicScore }}
                  topSkills={candidate.topSkills}
                  engineeringType={candidate.engineeringType}
                  availability={candidate.availability}
                  expectedSalary={candidate.expectedSalary}
                  onCardClick={handleCandidateClick}
                />
              ))}
            </div>
          </div>

          {/* To be interviewed column (right) */}
          <div className="xl:basis-[30%] xl:sticky xl:top-6 h-fit">
            <div
              className="rounded-xl bg-card p-4"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderTop: "3px solid #8B5CF6" }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">To be interviewed</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-accent/15 text-accent font-semibold">
                  {toInterviewCandidates.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {toInterviewCandidates.length === 0 && (
                  <p className="text-xs text-muted-foreground">No candidates added yet.</p>
                )}
                {toInterviewCandidates.map((candidate) => (
                  <CandidateCard
                    key={`interview-${candidate.candidateInfo.candidateId}`}
                    candidateInfo={candidate.candidateInfo}
                    matchScore={{ ...candidate.matchScore, overallScore: candidate.dynamicScore }}
                    topSkills={candidate.topSkills}
                    engineeringType={candidate.engineeringType}
                    availability={candidate.availability}
                    expectedSalary={candidate.expectedSalary}
                    borderColorOverride="#8B5CF6"
                    onCardClick={undefined}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Candidate detail modal */}
      <CandidateDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        candidateProfile={selectedCandidateId ? mockFullProfile : null}
        jobRequiredSkills={currentJob.requiredSkills}
        onMoveToInterview={handleMoveToInterview}
        onReject={handleReject}
        onViewResume={(url) => console.log("View resume:", url)}
      />
    </div>
  )
}
