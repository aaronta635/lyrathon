import type { JobPostingInfo, DashboardMetrics, CandidateFullProfile, CandidateListItem } from "@/lib/types"
import { mockJobs, mockMetrics, mockCandidates, mockFullProfile } from "./mock-data"
import { getApplications, getApplication } from "./applications"
import { 
  transformDecisionCardToCandidate, 
  transformApplicationToFullProfile,
  calculateDashboardMetrics 
} from "./transformers"

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true"

/**
 * Get all available job postings
 * Note: Backend doesn't have a jobs endpoint, so we return mock jobs for now
 */
export async function getJobs(): Promise<JobPostingInfo[]> {
  // Backend doesn't have jobs endpoint, return mock data
  return mockJobs
}

/**
 * Get dashboard metrics from applications
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  if (USE_MOCKS) {
    return mockMetrics
  }
  
  try {
    const applications = await getApplications()
    return calculateDashboardMetrics(applications)
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    // Return mock metrics as fallback
    return mockMetrics
  }
}

/**
 * Get all candidates (list view) from applications
 */
export async function getCandidates(): Promise<CandidateListItem[]> {
  if (USE_MOCKS) {
    return mockCandidates
  }
  
  try {
    const applications = await getApplications()
    console.log('Fetched applications from API:', applications)
    
    // Filter out applications that are still processing
    const readyApplications = applications.filter((app: any) => 
      app.status === 'ready' || app.status === 'awaiting_media'
    )
    
    console.log('Ready applications:', readyApplications)
    
    const candidates = readyApplications.map(transformDecisionCardToCandidate)
    console.log('Transformed candidates:', candidates)
    
    return candidates
  } catch (error) {
    console.error('Error fetching candidates:', error)
    // Return mock candidates as fallback
    return mockCandidates
  }
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
  
  try {
    const application = await getApplication(candidateId)
    if (!application) {
      return null
    }
    return transformApplicationToFullProfile(application)
  } catch (error) {
    console.error('Error fetching candidate profile:', error)
    return null
  }
}

