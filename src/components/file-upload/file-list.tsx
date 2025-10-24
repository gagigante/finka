"use client"

import { useState } from "react"
import { FileIcon, Download, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useFileDownload } from "@/hooks/mutations/files"
import { TaskFile } from "@/schemas/task-schema"

interface FileListProps {
  files: TaskFile[]
  onRemoveFile?: (fileId: string) => void
  isRemovingFile?: boolean
  removingFileId?: string
  className?: string
}

export function FileList({
  files,
  onRemoveFile,
  isRemovingFile = false,
  removingFileId,
  className
}: FileListProps) {
  const { downloadFile, generateDownloadUrl } = useFileDownload()
  const [isDownloading, setIsDownloading] = useState<string | null>(null)

  const handleDownload = async (file: TaskFile) => {
    try {
      setIsDownloading(file.id)
      // Extract the key from the URL
      const urlParts = file.url.split("/")
      const key = urlParts.slice(3).join("/") // Remove protocol and domain parts
      
      // Get the download URL and open it in a new tab
      const { downloadUrl } = await generateDownloadUrl({ key })
      window.open(downloadUrl, '_blank')
    } catch (error) {
      console.error("Error opening file:", error)
      toast.error("Failed to open file")
    } finally {
      setIsDownloading(null)
    }
  }

  if (files.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <p className="text-sm font-medium mb-2">Attached Files ({files.length})</p>
      <ul className="space-y-2">
        {files.map(file => (
          <li 
            key={file.id}
            className="flex items-center justify-between bg-muted/50 p-2 rounded-md text-sm"
          >
            <div className="flex items-center gap-2 truncate">
              <FileIcon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                disabled={isDownloading === file.id}
                onClick={() => handleDownload(file)}
              >
                {isDownloading === file.id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Download className="h-3 w-3" />
                )}
              </Button>
              
              {onRemoveFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={isRemovingFile || isDownloading === file.id}
                  onClick={() => onRemoveFile(file.id)}
                >
                  {isRemovingFile && removingFileId === file.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
