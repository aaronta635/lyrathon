"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Youtube } from "lucide-react"

interface ApplicantPage2YouTubeInputProps {
  youtubeUrl: string
  onChange: (url: string) => void
  error?: string
}

export function ApplicantPage2YouTubeInput({ youtubeUrl, onChange, error }: ApplicantPage2YouTubeInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="youtube-url" className="text-sm font-medium text-navy-blue">
        YouTube URL
      </Label>
      <div className="relative">
        <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          id="youtube-url"
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          value={youtubeUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          className={`pl-10 border-2 ${error ? "border-red-500" : "border-light-gray focus:border-peach-orange"}`}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <p className="text-xs text-muted-foreground">Share a video showcasing your work or your YouTube channel</p>
    </div>
  )
}
