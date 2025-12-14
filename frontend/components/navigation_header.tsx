"use client"

import { useState } from "react"
import Link from "next/link"
import { Sparkles, User, ArrowLeftRight } from "lucide-react"

interface NavigationHeaderProps {
  currentMode: "applicant" | "recruiter" | "home"
}

export default function NavigationHeader({ currentMode }: NavigationHeaderProps) {
  const [showModeSwitcher, setShowModeSwitcher] = useState(false)

  return (
    <header className="border-b border-[#e0f5f3] bg-[#004038] sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-lg bg-[#00756a] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">HireFlow</span>
          </Link>

          {/* Profile/Mode Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowModeSwitcher(!showModeSwitcher)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
            >
              <User className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">
                {currentMode === "applicant" && "Applicant Mode"}
                {currentMode === "recruiter" && "Recruiter Mode"}
                {currentMode === "home" && "Select Mode"}
              </span>
              <ArrowLeftRight className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            {showModeSwitcher && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowModeSwitcher(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-[#e0f5f3] overflow-hidden z-20">
                  <div className="p-2">
                    <Link href="/applicant/page_1" onClick={() => setShowModeSwitcher(false)}>
                      <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#e0f5f3] transition-colors cursor-pointer">
                        <div className="h-10 w-10 rounded-full bg-[#e0f5f3] flex items-center justify-center">
                          <User className="h-5 w-5 text-[#00756a]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#004038]">Applicant</p>
                          <p className="text-xs text-[#00756a]">Submit application</p>
                        </div>
                      </div>
                    </Link>
                    <Link href="/recruiter/dashboard" onClick={() => setShowModeSwitcher(false)}>
                      <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#e0f5f3] transition-colors cursor-pointer">
                        <div className="h-10 w-10 rounded-full bg-[#e0f5f3] flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-[#00756a]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#004038]">Recruiter</p>
                          <p className="text-xs text-[#00756a]">Manage applications</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="border-t border-[#e0f5f3] p-2">
                    <Link href="/" onClick={() => setShowModeSwitcher(false)}>
                      <div className="px-4 py-2 text-sm text-[#00756a] hover:text-[#004038] hover:bg-[#e0f5f3] rounded-lg transition-colors cursor-pointer">
                        Back to Home
                      </div>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
