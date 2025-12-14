import { API_BASE_URL } from './config'

export interface ApplicationCreateRequest {
  name: string
  email: string
  github_url: string
  focus: 'fullstack' | 'frontend' | 'backend'
  resume: File
}

export interface ApplicationCreateResponse {
  id: string
  status: 'processing' | 'awaiting_media' | 'ready' | 'failed'
  message: string
}

export interface ApplicationMediaUpdate {
  video_url: string
  deploy_url?: string
  can_view_without_login?: boolean
  can_embed?: boolean
}

/**
 * Create a new application (Phase 1)
 */
export async function createApplication(
  data: ApplicationCreateRequest
): Promise<ApplicationCreateResponse> {
  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('email', data.email)
  formData.append('github_url', data.github_url)
  formData.append('focus', data.focus)
  formData.append('resume', data.resume)

  try {
    const response = await fetch(`${API_BASE_URL}/applications/`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary for FormData
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to create application' }))
      throw new Error(error.detail || `HTTP ${response.status}: Failed to create application`)
    }

    return response.json()
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Could not connect to server. Please check your internet connection.')
    }
    throw error
  }
}

/**
 * Update application media (Phase 2)
 */
export async function updateApplicationMedia(
  applicationId: string,
  media: ApplicationMediaUpdate
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/media`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(media),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to update media' }))
    throw new Error(error.detail || `HTTP ${response.status}: Failed to update media`)
  }
}

/**
 * Get all applications (for recruiter dashboard)
 */
export async function getApplications() {
  const response = await fetch(`${API_BASE_URL}/applications/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to fetch applications' }))
    throw new Error(error.detail || `HTTP ${response.status}: Failed to fetch applications`)
  }

  return response.json()
}

/**
 * Get a single application by ID
 */
export async function getApplication(applicationId: string) {
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    const error = await response.json().catch(() => ({ detail: 'Failed to fetch application' }))
    throw new Error(error.detail || `HTTP ${response.status}: Failed to fetch application`)
  }

  return response.json()
}

