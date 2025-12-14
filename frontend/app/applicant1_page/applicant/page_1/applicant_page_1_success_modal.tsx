"use client"

import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ApplicantPage1SuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ApplicantPage1SuccessModal({ isOpen, onClose }: ApplicantPage1SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl text-navy-blue">Application Submitted!</DialogTitle>
          <DialogDescription className="text-center text-base">
            Thank you for your application. We've received your resume and GitHub projects. Our team will review your
            submission and get back to you soon.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-4">
          <Button onClick={onClose} className="bg-peach-orange hover:bg-light-peach text-navy-blue font-semibold">
            Submit Another Application
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
