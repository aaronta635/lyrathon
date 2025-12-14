import type { JobPostingInfo, DashboardMetrics, CandidateFullProfile } from "@/lib/types"
import { mockJobs, mockMetrics, mockCandidates, mockFullProfile, type CandidateListItem } from "./mock-data"

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true"

/**
 * Get all available job postings
 */
export async function getJobs(): Promise<JobPostingInfo[]> {
  if (USE_MOCKS) {
    return mockJobs
  }
  
  const res = await fetch("/api/recruitment/jobs")
  if (!res.ok) {
    throw new Error("Failed to fetch jobs")
  }
  return res.json()
}

/**
 * Get dashboard metrics
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  if (USE_MOCKS) {
    return mockMetrics
  }
  
  const res = await fetch("/api/recruitment/metrics")
  if (!res.ok) {
    throw new Error("Failed to fetch dashboard metrics")
  }
  return res.json()
}

/**
 * Get all candidates (list view)
 */
export async function getCandidates(): Promise<CandidateListItem[]> {
  if (USE_MOCKS) {
    return mockCandidates
  }
  
  const res = await fetch("/api/recruitment/candidates")
  if (!res.ok) {
    throw new Error("Failed to fetch candidates")
  }
  return res.json()
}

/**
 * Get full candidate profile by ID
 */
export async function getCandidateProfile(candidateId: string): Promise<CandidateFullProfile | null> {
  if (USE_MOCKS) {
    // For now, return the mock profile for cand-001, or null for others
    if (candidateId === "cand-001") {
      return mockFullProfile
    }
    return null
  }
  
  const res = await fetch(`/api/recruitment/candidates/${candidateId}`)
  if (!res.ok) {
    if (res.status === 404) {
      return null
    }
    throw new Error("Failed to fetch candidate profile")
  }
  return res.json()
}

