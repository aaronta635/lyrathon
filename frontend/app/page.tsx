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
import { getJobs, getDashboardMetrics, getCandidates, getCandidateProfile } from "@/lib/api/recruitment"
import type { CandidateListItem } from "@/lib/api/mock-data"

export default function RecruitmentDashboard() {
  const [jobs, setJobs] = useState<JobPostingInfo[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [candidates, setCandidates] = useState<CandidateListItem[]>([])
  const [selectedCandidateProfile, setSelectedCandidateProfile] = useState<CandidateFullProfile | null>(null)
  const [selectedJobId, setSelectedJobId] = useState("job-001")
  const [jobOverrides, setJobOverrides] = useState<Partial<JobPostingInfo>>({})
  const [sortBy, setSortBy] = useState("score-desc")
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Fetch data on mount
  useEffect(() => {
    getJobs().then(setJobs)
    getDashboardMetrics().then(setMetrics)
    getCandidates().then(setCandidates)
  }, [])

  // Fetch candidate profile when selected
  useEffect(() => {
    if (selectedCandidateId) {
      getCandidateProfile(selectedCandidateId).then(setSelectedCandidateProfile)
    } else {
      setSelectedCandidateProfile(null)
    }
  }, [selectedCandidateId])

  const allJobsDefault: JobPostingInfo = {
    jobId: "all",
    jobTitle: "All Positions",
    location: "All Locations",
    employmentType: "all" as JobPostingInfo["employmentType"],
    salaryRange: { minSalary: 0, maxSalary: 999999, currency: "AUD" },
    requiredSkills: [],
  }
  const baseJob = selectedJobId === "all" ? allJobsDefault : (jobs.find((job) => job.jobId === selectedJobId) || jobs[0] || allJobsDefault)
  const currentJob = baseJob ? { ...baseJob, ...jobOverrides } : allJobsDefault
  
  const handleJobInfoUpdate = (updates: Partial<JobPostingInfo>) => {
    setJobOverrides(prev => ({ ...prev, ...updates }))
  }
  
  // Filter candidates by location and skill match, then sort
  const filteredAndSortedCandidates = candidates
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
        {metrics && (
          <JobBlock 
            jobInfo={currentJob}
            metrics={metrics}
            allJobs={jobs.map((j) => ({ jobId: j.jobId, jobTitle: j.jobTitle }))}
            onJobChange={(jobId) => {
              setSelectedJobId(jobId)
              setJobOverrides({}) // Reset overrides when changing jobs
            }}
            onJobInfoUpdate={handleJobInfoUpdate}
          />
        )}

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
        candidateProfile={selectedCandidateProfile}
        onMoveToInterview={(id) => console.log("Move to interview:", id)}
        onReject={(id) => console.log("Reject candidate:", id)}
        onViewResume={(url) => console.log("View resume:", url)}
      />
    </div>
  )
}
