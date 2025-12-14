"use client"

import { Plus, Trash2, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ApplicantPage2YoutubeUrlsProps {
  youtubeUrls: string[]
  onChange: (urls: string[]) => void
  error?: string
}

export function ApplicantPage2YoutubeUrls({ youtubeUrls, onChange, error }: ApplicantPage2YoutubeUrlsProps) {
  const handleAddUrl = () => {
    onChange([...youtubeUrls, ""])
  }

  const handleRemoveUrl = (indexToRemove: number) => {
    if (youtubeUrls.length > 1) {
      onChange(youtubeUrls.filter((_, index) => index !== indexToRemove))
    }
  }

  const handleUrlChange = (index: number, value: string) => {
    const updatedUrls = [...youtubeUrls]
    updatedUrls[index] = value
    onChange(updatedUrls)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {youtubeUrls.map((youtubeUrl, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`youtubeUrl${index}`} className="text-navy-blue font-medium flex items-center gap-2">
                <Youtube className="w-4 h-4" />
                YouTube URL {index + 1}
              </Label>
              {youtubeUrls.length > 1 && (
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
              <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id={`youtubeUrl${index}`}
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                className="pl-10 border-2 border-light-gray focus:border-peach-orange transition-colors"
              />
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
        Add Another YouTube URL
      </Button>

      <div className="bg-light-gray/50 rounded-lg p-4 border border-light-gray">
        <p className="text-sm text-muted-foreground">
          <strong className="text-navy-blue">Tip:</strong> Share videos showcasing your projects, tutorials, or channel
        </p>
      </div>
    </div>
  )
}
