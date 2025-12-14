"use client"

import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchFilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedRole: string
  onRoleChange: (role: string) => void
  selectedSkillFilter: string
  onSkillFilterChange: (skill: string) => void
  onAdvancedFiltersClick: () => void
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedSkillFilter,
  onSkillFilterChange,
  onAdvancedFiltersClick,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search candidates by name, skills, or company..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Role filter */}
      <Select value={selectedRole} onValueChange={onRoleChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="frontend">Frontend</SelectItem>
          <SelectItem value="backend">Backend</SelectItem>
          <SelectItem value="fullstack">Full-stack</SelectItem>
          <SelectItem value="devops">DevOps</SelectItem>
        </SelectContent>
      </Select>

      {/* Skills filter */}
      <Select value={selectedSkillFilter} onValueChange={onSkillFilterChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="All Skills" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Skills</SelectItem>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="nodejs">Node.js</SelectItem>
          <SelectItem value="python">Python</SelectItem>
          <SelectItem value="aws">AWS</SelectItem>
        </SelectContent>
      </Select>

      {/* Advanced filters button */}
      <Button
        variant="outline"
        onClick={onAdvancedFiltersClick}
        className="w-full md:w-auto flex items-center gap-2 bg-transparent"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Advanced Filters
      </Button>
    </div>
  )
}
