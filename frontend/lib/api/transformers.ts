import type { CandidateListItem, CandidateFullProfile, DashboardMetrics, JobPostingInfo } from '@/lib/types'

// Backend response types
export interface BackendDecisionCard {
  id: string
  name: string
  built: string[]
  inferred_seniority?: string
  core_strengths?: string[]
  collaboration_style?: string
  recommendations?: string[]
  justification?: string
  built_verification?: Array<{
    item: string
    confidence: number
    matched_repo?: string
    repo_url?: string
  }>
  suitability_percentage?: number
  confidence_percentage?: number
  status: 'processing' | 'awaiting_media' | 'ready' | 'failed'
  created_at: string
}

export interface BackendApplication {
  id: string
  name: string
  email: string
  github_url?: string
  video_url?: string
  deploy_url?: string
  can_view_without_login?: boolean
  can_embed?: boolean
  resume_data?: {
    role_label?: string
    built?: string[]
    skills?: string[]
    years_experience?: number
    risk_flags?: string[]
    suitability_percentage?: number
    built_verification?: Array<{
      item: string
      confidence: number
      matched_repo?: string
      repo_url?: string
    }>
  }
  github_data?: {
    inferred_seniority?: string
    core_strengths?: string[]
    collaboration_style?: string
    recommendations?: string[]
    justification?: string
    confidence_percentage?: number
    raw?: {
      engineer_summary?: {
        inferred_seniority?: string
        core_strengths?: string[]
        working_style?: string
        collaboration_style?: string
      }
      hiring_recommendation?: {
        confidence_percentage?: number
      }
    }
  }
  status: 'processing' | 'awaiting_media' | 'ready' | 'failed'
  created_at: string
}

/**
 * Transform backend DecisionCard to frontend CandidateListItem
 */
export function transformDecisionCardToCandidate(card: BackendDecisionCard): CandidateListItem {
  // Calculate match score from suitability_percentage or default
  const overallScore = card.suitability_percentage || 75
  const skillMatchScore = card.confidence_percentage || overallScore
  const experienceMatchScore = overallScore

  // Determine fit level
  let fitLevel: 'strong' | 'moderate' | 'weak' = 'moderate'
  if (overallScore >= 85) fitLevel = 'strong'
  else if (overallScore < 65) fitLevel = 'weak'

  // Extract engineering type from role_label or infer from data
  let engineeringType = 'Full-Stack'
  if (card.inferred_seniority?.toLowerCase().includes('frontend')) engineeringType = 'Frontend'
  else if (card.inferred_seniority?.toLowerCase().includes('backend')) engineeringType = 'Backend'

  // Get top skills from core_strengths or built items
  const topSkills = card.core_strengths?.slice(0, 3) || 
                    card.built?.slice(0, 3).map(item => item.split(' ')[0]) || 
                    ['React', 'Node.js', 'TypeScript']

  return {
    candidateInfo: {
      candidateId: card.id,
      fullName: card.name,
      location: 'Remote', // Backend doesn't provide location
      yearsOfExperience: card.inferred_seniority?.includes('senior') ? 5 : 3, // Estimate from seniority
      currentCompany: 'Unknown', // Backend doesn't provide this
    },
    engineeringType: engineeringType as 'Full-Stack' | 'Frontend' | 'Backend',
    matchScore: {
      overallScore,
      skillMatchScore,
      experienceMatchScore,
      fitLevel,
    },
    topSkills,
    justification: card.justification,
    recommendations: card.recommendations?.slice(0, 3), // Limit to 3 recommendations
  }
}

/**
 * Transform backend Application to frontend CandidateFullProfile
 */
export function transformApplicationToFullProfile(app: BackendApplication): CandidateFullProfile {
  const resumeData = app.resume_data || {}
  const githubData = app.github_data || {}

  // Calculate match scores - use decision card data if available, otherwise calculate from resume/github
  // For full application, we might not have suitability_percentage, so calculate from github confidence
  const overallScore = resumeData.suitability_percentage || githubData.confidence_percentage || 
                       (githubData.raw?.hiring_recommendation?.confidence_percentage) || 75
  const skillMatchScore = githubData.confidence_percentage || githubData.raw?.hiring_recommendation?.confidence_percentage || overallScore
  const experienceMatchScore = overallScore

  let fitLevel: 'strong' | 'moderate' | 'weak' = 'moderate'
  if (overallScore >= 85) fitLevel = 'strong'
  else if (overallScore < 65) fitLevel = 'weak'

  // Transform skills - use skills from resume_data if available
  const skills = (resumeData.skills && resumeData.skills.length > 0 
    ? resumeData.skills 
    : githubData.core_strengths || []).map(skill => ({
    skillName: skill,
    proficiencyLevel: 'advanced' as const,
    yearsOfExperience: resumeData.years_experience || 3,
    isVerified: true,
  }))

  // Transform projects from built items
  const projects = (resumeData.built || []).map((item, idx) => ({
    projectId: `proj-${idx + 1}`,
    projectTitle: item,
    projectDescription: item,
    technologiesUsed: resumeData.skills?.slice(0, 3) || [],
    githubUrl: app.github_url,
    completionDate: new Date().toISOString().split('T')[0].slice(0, 7),
  }))

  return {
    basicInfo: {
      candidateId: app.id,
      fullName: app.name,
      location: 'Remote',
      yearsOfExperience: resumeData.years_experience || 3,
      currentCompany: 'Unknown',
    },
    matchScore: {
      overallScore,
      skillMatchScore,
      experienceMatchScore,
      fitLevel,
    },
    skills,
    projects,
    githubMetrics: {
      commitFrequency: 'Regular',
      codeQualityScore: 85,
      testCoverage: 80,
      hasDocumentation: true,
      activityTrend: 'stable' as const,
    },
    hiringRecommendation: githubData.justification || 'Candidate shows strong potential.',
    justification: githubData.justification, // Full justification text
    engineerSummary: {
      // Read from nested raw.engineer_summary first, then top-level, then defaults
      inferred_seniority: (githubData.raw?.engineer_summary?.inferred_seniority) ||
                         githubData.inferred_seniority || 
                         'mid-level',
      core_strengths: (githubData.raw?.engineer_summary?.core_strengths) ||
                     githubData.core_strengths || 
                     [],
      working_style: (githubData.raw?.engineer_summary?.working_style) ||
                    'independent',
      collaboration_style: (githubData.raw?.engineer_summary?.collaboration_style) ||
                          githubData.collaboration_style || 
                          'collaborative',
    },
    recommendations: (githubData.recommendations || []).slice(0, 3), // Limit to 3 recommendations
    strengths: githubData.core_strengths || [],
    risks: resumeData.risk_flags || [],
    resumeUrl: '', // Backend doesn't expose resume URL directly
    linkedinUrl: undefined,
  }
}

/**
 * Calculate dashboard metrics from applications
 */
export function calculateDashboardMetrics(applications: BackendDecisionCard[]): DashboardMetrics {
  const totalCandidates = applications.length
  const scores = applications
    .map(app => app.suitability_percentage || 75)
    .filter(score => score > 0)
  
  const averageMatchScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0

  return {
    totalCandidates,
    candidateChangePercentage: 0, // Would need historical data
    averageMatchScore,
    matchScoreImprovement: 0, // Would need historical data
    activeInterviews: applications.filter(app => app.status === 'ready').length,
    interviewsInPipeline: applications.filter(app => app.status === 'awaiting_media').length,
    topSkillMatchPercentage: 100, // Default
    skillMatchThreshold: 85,
  }
}

