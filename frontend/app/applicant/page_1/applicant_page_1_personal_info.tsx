"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ApplicantPage1PersonalInfoProps {
  fullName: string
  email: string
  onChange: (field: string, value: string) => void
  errors: Record<string, string>
}

export function ApplicantPage1PersonalInfo({
  fullName,
  email,
  onChange,
  errors,
}: ApplicantPage1PersonalInfoProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-navy-blue font-medium">
          Full Name *
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          className={`border-2 ${errors.fullName ? "border-red-500" : "border-light-gray focus:border-peach-orange"}`}
        />
        {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-navy-blue font-medium">
          Email Address *
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="john.doe@example.com"
          value={email}
          onChange={(e) => onChange("email", e.target.value)}
          className={`border-2 ${errors.email ? "border-red-500" : "border-light-gray focus:border-peach-orange"}`}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>
    </div>
  )
}
