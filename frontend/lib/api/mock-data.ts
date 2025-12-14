import type { JobPostingInfo, DashboardMetrics, CandidateFullProfile, CandidateListItem } from "@/lib/types"

export const mockJobs: JobPostingInfo[] = [
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

export const mockMetrics: DashboardMetrics = {
  totalCandidates: 6,
  candidateChangePercentage: 12,
  averageMatchScore: 89,
  matchScoreImprovement: 5,
  activeInterviews: 5,
  interviewsInPipeline: 5,
  topSkillMatchPercentage: 100,
  skillMatchThreshold: 85,
}

export interface CandidateListItem {
  candidateInfo: {
    candidateId: string
    fullName: string
    location: string
    yearsOfExperience: number
    currentCompany: string
  }
  engineeringType: string
  matchScore: {
    overallScore: number
    skillMatchScore: number
    experienceMatchScore: number
    fitLevel: "strong" | "moderate" | "weak"
  }
  topSkills: string[]
}

export const mockCandidates: CandidateListItem[] = [
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
      fitLevel: "strong",
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
      fitLevel: "moderate",
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
      fitLevel: "strong",
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
      fitLevel: "weak",
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
      fitLevel: "strong",
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
      fitLevel: "strong",
    },
    topSkills: ["React", "Node.js", "PostgreSQL"],
  },
]

export const mockFullProfile: CandidateFullProfile = {
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

