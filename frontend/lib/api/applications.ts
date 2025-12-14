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
    const url = `${API_BASE_URL}/applications/`
    console.log('Sending POST request to:', url)
    console.log('FormData contents:', {
      name: data.name,
      email: data.email,
      github_url: data.github_url,
      focus: data.focus,
      resume: data.resume.name,
    })

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary for FormData
    })

    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    })

    if (!response.ok) {
      let errorDetail = `HTTP ${response.status}: Failed to create application`
      try {
        const errorData = await response.json()
        errorDetail = errorData.detail || errorData.message || errorDetail
      } catch {
        // If response is not JSON, try to get text
        try {
          const errorText = await response.text()
          errorDetail = errorText || errorDetail
        } catch {
          // Ignore
        }
      }
      throw new Error(errorDetail)
    }

    const result = await response.json()
    console.log('Application created successfully:', result)
    return result
  } catch (error) {
    // Log detailed error for debugging
    console.error('API Error:', {
      error,
      errorType: error?.constructor?.name,
      errorMessage: error instanceof Error ? error.message : String(error),
      apiUrl: `${API_BASE_URL}/applications/`,
    })

    // Handle network/fetch errors
    if (error instanceof TypeError) {
      const errorMsg = error.message || String(error)
      if (errorMsg.includes('fetch') || errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
        // Check if this is likely a CORS issue
        const isLocalhost = typeof window !== 'undefined' && window.location.origin.includes('localhost')
        const isCorsIssue = isLocalhost && API_BASE_URL.includes('railway.app')
        
        let errorMessage = `Cannot connect to API server at ${API_BASE_URL}\n\n`
        
        if (isCorsIssue) {
          errorMessage += `⚠️ CORS Issue Detected:\n` +
            `You're running the frontend on localhost but the backend on Railway.\n` +
            `The Railway backend needs to allow localhost:3000 in CORS.\n\n` +
            `Solutions:\n` +
            `1. Deploy the updated middleware.py to Railway (it includes localhost support)\n` +
            `2. Or run the backend locally and set NEXT_PUBLIC_API_URL=http://localhost:8000/api\n\n`
        } else {
          errorMessage += `Possible causes:\n` +
            `• CORS configuration issue - check backend middleware\n` +
            `• API server is down or unreachable\n` +
            `• Network connectivity problem\n\n`
        }
        
        errorMessage += `Check browser console (F12) for more details.`
        
        const friendlyError = new Error(errorMessage)
        // Preserve original error in console
        console.error('Original fetch error:', error)
        throw friendlyError
      }
    }
    
    // Re-throw the error if it's already an Error instance
    if (error instanceof Error) {
      throw error
    }
    
    // Otherwise wrap it
    throw new Error(String(error))
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

