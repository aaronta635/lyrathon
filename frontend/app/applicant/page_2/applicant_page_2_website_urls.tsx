"use client"

import { Plus, Trash2, Globe, Lock, LockOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface WebsiteUrlWithLogin {
  url: string
  requiresLogin: boolean
}

interface ApplicantPage2WebsiteUrlsProps {
  websiteUrlsWithLogin: WebsiteUrlWithLogin[]
  onChange: (websiteUrlsWithLogin: WebsiteUrlWithLogin[]) => void
  error?: string
}

export function ApplicantPage2WebsiteUrls({ websiteUrlsWithLogin, onChange, error }: ApplicantPage2WebsiteUrlsProps) {
  const handleAddUrl = () => {
    onChange([...websiteUrlsWithLogin, { url: "", requiresLogin: false }])
  }

  const handleRemoveUrl = (indexToRemove: number) => {
    if (websiteUrlsWithLogin.length > 1) {
      onChange(websiteUrlsWithLogin.filter((_, index) => index !== indexToRemove))
    }
  }

  const handleUrlChange = (index: number, value: string) => {
    const updated = [...websiteUrlsWithLogin]
    updated[index] = { ...updated[index], url: value }
    onChange(updated)
  }

  const handleLoginRequiredChange = (index: number, requiresLogin: boolean) => {
    const updated = [...websiteUrlsWithLogin]
    updated[index] = { ...updated[index], requiresLogin }
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-6">
        {websiteUrlsWithLogin.map((websiteItem, index) => (
          <div
            key={index}
            className="space-y-3 p-4 border-2 border-light-gray rounded-lg hover:border-peach-orange transition-colors"
          >
            <div className="flex items-center justify-between">
              <Label htmlFor={`websiteUrl${index}`} className="text-navy-blue font-medium flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website {index + 1}
              </Label>
              {websiteUrlsWithLogin.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveUrl(index)}
                  className="hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id={`websiteUrl${index}`}
                type="url"
                placeholder="https://yourwebsite.com"
                value={websiteItem.url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                className="pl-10 border-2 border-light-gray focus:border-peach-orange transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-navy-blue">Does this website require login?</Label>
              <RadioGroup
                value={websiteItem.requiresLogin ? "yes" : "no"}
                onValueChange={(value) => handleLoginRequiredChange(index, value === "yes")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="no"
                    id={`no-login-${index}`}
                    className="border-peach-orange text-peach-orange"
                  />
                  <Label htmlFor={`no-login-${index}`} className="cursor-pointer flex items-center gap-2">
                    <LockOpen className="w-4 h-4 text-green-600" />
                    No Login Required
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="yes"
                    id={`yes-login-${index}`}
                    className="border-peach-orange text-peach-orange"
                  />
                  <Label htmlFor={`yes-login-${index}`} className="cursor-pointer flex items-center gap-2">
                    <Lock className="w-4 h-4 text-peach-orange" />
                    Login Required
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="button"
        variant="outline"
        onClick={handleAddUrl}
        className="w-full border-2 border-dashed border-peach-orange text-peach-orange hover:bg-peach-orange/10 bg-transparent transition-all"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Website URL
      </Button>

      <div className="bg-light-gray/50 rounded-lg p-4 border border-light-gray">
        <p className="text-sm text-muted-foreground">
          <strong className="text-navy-blue">Tip:</strong> Include portfolios, deployed projects, or personal websites
        </p>
      </div>
    </div>
  )
}
