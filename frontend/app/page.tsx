'use client'

import { useState, useEffect } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface Application {
  id: string
  name: string
  built: string[]
  video_url?: string
  deploy_url?: string
  can_view_without_login?: boolean
  can_embed?: boolean
  status: string
  created_at: string
}

// Convert YouTube URL to embed format
function getYouTubeEmbedUrl(url: string): string {
  if (!url) return ''
  
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`
    }
  }
  
  // If already an embed URL, return as is
  if (url.includes('youtube.com/embed/')) {
    return url
  }
  
  return url
}

export default function Home() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [formData, setFormData] = useState({
    video_url: '',
    deploy_url: '',
    can_view_without_login: false,
    can_embed: false
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications`)
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitMedia = async (applicationId: string) => {
    setSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/media`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Media updated successfully!')
        setFormData({
          video_url: '',
          deploy_url: '',
          can_view_without_login: false,
          can_embed: false
        })
        setSelectedApp(null)
        fetchApplications() // Refresh list
      } else {
        const error = await response.json()
        alert(`Error: ${error.detail || 'Failed to update media'}`)
      }
    } catch (error) {
      console.error('Error updating media:', error)
      alert('Failed to update media')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading applications...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Application Viewer</h1>

        {/* Form to add/update media */}
        {selectedApp && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Update Media for: {selectedApp.name}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  YouTube Video URL
                </label>
                <input
                  type="text"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Deploy URL (Website)
                </label>
                <input
                  type="text"
                  value={formData.deploy_url}
                  onChange={(e) => setFormData({ ...formData, deploy_url: e.target.value })}
                  placeholder="https://your-website.com"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.can_view_without_login}
                    onChange={(e) => setFormData({ ...formData, can_view_without_login: e.target.checked })}
                    className="mr-2"
                  />
                  Can view without login
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.can_embed}
                    onChange={(e) => setFormData({ ...formData, can_embed: e.target.checked })}
                    className="mr-2"
                  />
                  Can embed in iframe
                </label>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSubmitMedia(selectedApp.id)}
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  onClick={() => {
                    setSelectedApp(null)
                    setFormData({
                      video_url: '',
                      deploy_url: '',
                      can_view_without_login: false,
                      can_embed: false
                    })
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Applications List */}
        <div className="grid gap-6">
          {applications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No applications found</p>
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{app.name}</h2>
                    <p className="text-sm text-gray-500">Status: {app.status}</p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedApp(app)
                      setFormData({
                        video_url: app.video_url || '',
                        deploy_url: app.deploy_url || '',
                        can_view_without_login: app.can_view_without_login || false,
                        can_embed: app.can_embed || false
                      })
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {app.video_url || app.deploy_url ? 'Update Media' : 'Add Media'}
                  </button>
                </div>

                {app.built && app.built.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Built:</h3>
                    <ul className="list-disc list-inside">
                      {app.built.map((item, idx) => (
                        <li key={idx} className="text-gray-700">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Video iframe */}
                {app.video_url && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Video:</h3>
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <iframe
                        src={getYouTubeEmbedUrl(app.video_url)}
                        title="Video"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Website iframe */}
                {app.deploy_url && (
                  <div>
                    <h3 className="font-semibold mb-2">Website:</h3>
                    {app.can_embed ? (
                      <div className="border rounded-lg overflow-hidden" style={{ height: '600px' }}>
                        <iframe
                          src={app.deploy_url}
                          title="Website"
                          className="w-full h-full"
                          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                        />
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800">
                          This website cannot be embedded. 
                          <a 
                            href={app.deploy_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-600 hover:underline"
                          >
                            Open in new tab →
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {!app.video_url && !app.deploy_url && (
                  <p className="text-gray-500 italic">No media added yet</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

