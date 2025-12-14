"use client"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface ApplicantPage2LoginRequiredProps {
  requiresLogin: boolean | null
  onChange: (required: boolean) => void
  error?: string
}

export function ApplicantPage2LoginRequired({ requiresLogin, onChange, error }: ApplicantPage2LoginRequiredProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-navy-blue">
        Does the server need to log in to interact with your project?
      </Label>
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => onChange(true)}
          className={`flex-1 border-2 h-20 ${
            requiresLogin === true
              ? "bg-peach-orange border-peach-orange text-navy-blue"
              : "border-light-gray hover:border-peach-orange"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                requiresLogin === true ? "bg-navy-blue border-navy-blue" : "border-muted-foreground"
              }`}
            >
              {requiresLogin === true && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="font-semibold">Yes</span>
          </div>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => onChange(false)}
          className={`flex-1 border-2 h-20 ${
            requiresLogin === false
              ? "bg-peach-orange border-peach-orange text-navy-blue"
              : "border-light-gray hover:border-peach-orange"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                requiresLogin === false ? "bg-navy-blue border-navy-blue" : "border-muted-foreground"
              }`}
            >
              {requiresLogin === false && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="font-semibold">No</span>
          </div>
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <p className="text-xs text-muted-foreground">Let us know if we need login credentials to test your project</p>
    </div>
  )
}
