"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, FileIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileToUpload } from "@/hooks/mutations/files"

interface FileUploadAreaProps {
  files: FileToUpload[]
  onAddFiles: (files: FileToUpload[]) => void
  onRemoveFile: (fileId: string) => void
  isUploading?: boolean
  className?: string
}

export function FileUploadArea({
  files,
  onAddFiles,
  onRemoveFile,
  isUploading = false,
  className
}: FileUploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const processFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return

    // Convert FileList to array and create FileToUpload objects
    const newFiles: FileToUpload[] = Array.from(fileList).map(file => ({
      file,
      id: crypto.randomUUID()
    }))

    // Check if any file is too large (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    const oversizedFiles = newFiles.filter(f => f.file.size > MAX_FILE_SIZE)
    
    if (oversizedFiles.length > 0) {
      toast.error(`${oversizedFiles.length} file(s) exceed the 10MB size limit`)
      // Filter out oversized files
      const validFiles = newFiles.filter(f => f.file.size <= MAX_FILE_SIZE)
      onAddFiles(validFiles)
    } else {
      onAddFiles(newFiles)
    }
  }, [onAddFiles])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    processFiles(e.dataTransfer.files)
  }, [processFiles])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files)
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [processFiles])

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
          isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          isUploading && "opacity-50 pointer-events-none"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center py-4">
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium">
            Drag and drop files here, or click to select files
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Maximum file size: 10MB
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Files to upload ({files.length})</p>
          <ul className="space-y-2">
            {files.map(fileToUpload => (
              <li 
                key={fileToUpload.id}
                className="flex items-center justify-between bg-muted/50 p-2 rounded-md text-sm"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileIcon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{fileToUpload.file.name}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    ({(fileToUpload.file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={isUploading}
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveFile(fileToUpload.id)
                  }}
                >
                  {isUploading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
