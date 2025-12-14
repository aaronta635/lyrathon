"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileText, X, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ApplicantPage1PdfUploadProps {
  onFileSelect: (file: File | null) => void
  currentFile: File | null
  error?: string
}

export function ApplicantPage1PdfUpload({ onFileSelect, currentFile, error }: ApplicantPage1PdfUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      onFileSelect(selectedFile)
    } else if (selectedFile) {
      alert("Please upload a PDF file only")
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/pdf") {
      onFileSelect(droppedFile)
    } else if (droppedFile) {
      alert("Please upload a PDF file only")
    }
  }

  const handleRemoveFile = () => {
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      {!currentFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-peach-orange bg-light-peach/10"
              : error
                ? "border-red-500 bg-red-50"
                : "border-light-gray hover:border-peach-orange"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdfUpload"
          />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-peach-orange/20 flex items-center justify-center">
              <Upload className="w-8 h-8 text-peach-orange" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-navy-blue">Drop your PDF here or click to browse</p>
              <p className="text-sm text-muted-foreground">Maximum file size: 10MB</p>
            </div>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-navy-blue hover:bg-navy-blue/90 text-white"
            >
              Choose File
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-light-gray rounded-lg p-6 bg-light-gray/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-peach-orange flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-navy-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-navy-blue truncate">{currentFile.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(currentFile.size)}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="flex-shrink-0 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-2 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Upload ready</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
