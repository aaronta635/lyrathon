"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Globe } from "lucide-react"

interface ApplicantPage2WebsiteInputProps {
  websiteUrl: string
  onChange: (url: string) => void
  error?: string
}

export function ApplicantPage2WebsiteInput({ websiteUrl, onChange, error }: ApplicantPage2WebsiteInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="website-url" className="text-sm font-medium text-navy-blue">
        Website URL
      </Label>
      <div className="relative">
        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          id="website-url"
          type="url"
          placeholder="https://yourwebsite.com"
          value={websiteUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          className={`pl-10 border-2 ${error ? "border-red-500" : "border-light-gray focus:border-peach-orange"}`}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <p className="text-xs text-muted-foreground">Link to your portfolio, personal website, or deployed project</p>
    </div>
  )
}
