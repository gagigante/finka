import { useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { type Id } from "../../../convex/_generated/dataModel";
import { useState } from "react";
import { toast } from "sonner";

// Re-export API functions for type safety
// Note: Using 'any' type here as a workaround until the Convex API types are generated
const filesApi = {
  generateUploadUrl: (api as any).files?.generateUploadUrl,
  saveFileMetadata: (api as any).files?.saveFileMetadata,
  generateDownloadUrl: (api as any).files?.generateDownloadUrl,
  removeFile: (api as any).files?.removeFile,
  deleteFileFromS3: (api as any).files?.deleteFileFromS3,
};

export interface UploadFileOptions {
  onSuccess?: (fileData: any) => void;
  onError?: (error: Error) => void;
}

export interface FileToUpload {
  file: File;
  id: string;
}

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const generateUploadUrl = useAction(filesApi.generateUploadUrl);
  const saveFileMetadata = useMutation(filesApi.saveFileMetadata);
  
  const uploadFile = async (
    fileToUpload: FileToUpload,
    taskId?: Id<"tasks">,
    options?: UploadFileOptions
  ) => {
    const { file } = fileToUpload;
    
    try {
      setIsUploading(true);
      setProgress(0);
      
      // Step 1: Get a presigned URL from the server
      const { uploadUrl, fileId, key } = await generateUploadUrl({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });
      
      // Step 2: Upload the file to S3 using the presigned URL
      console.log("Uploading to presigned URL:", uploadUrl);
      
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
        mode: "cors",
      });
      
      if (!uploadResponse.ok) {
        console.error("Failed to upload file to S3", {
          status: uploadResponse.status,
          statusText: uploadResponse.statusText,
        });
        
        // Try to get more error details
        try {
          const errorText = await uploadResponse.text();
          console.error("Error response:", errorText);
        } catch (e) {
          console.error("Could not read error response", e);
        }
        
        throw new Error(`Failed to upload file to S3: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }
      
      // Step 3: Save the file metadata in Convex
      const fileData = await saveFileMetadata({
        taskId,
        fileId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        key,
      });
      
      setProgress(100);
      options?.onSuccess?.(fileData);
      return fileData;
    } catch (error) {
      console.error("Error uploading file:", error);
      options?.onError?.(error as Error);
      toast.error("Failed to upload file. Please try again.");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  const removeFile = useMutation(filesApi.removeFile);
  const deleteFileFromS3 = useAction(filesApi.deleteFileFromS3);
  
  const handleRemoveFile = async (
    taskId: Id<"tasks">,
    fileId: string,
    options?: { onSuccess?: () => void; onError?: (error: Error) => void }
  ) => {
    try {
      // First remove the file from the task
      const { fileKey } = await removeFile({ taskId, fileId });
      
      // Then delete it from S3
      if (fileKey) {
        await deleteFileFromS3({ key: fileKey });
      }
      
      options?.onSuccess?.();
      return true;
    } catch (error) {
      console.error("Error removing file:", error);
      options?.onError?.(error as Error);
      throw error;
    }
  };
  
  return {
    uploadFile,
    removeFile: handleRemoveFile,
    isUploading,
    progress,
  };
}

export function useFileDownload() {
  const generateDownloadUrl = useAction(filesApi.generateDownloadUrl);
  
  const downloadFile = async (key: string, fileName: string) => {
    try {
      // Get a presigned URL for downloading
      const { downloadUrl } = await generateDownloadUrl({ key });
      
      // Create a temporary link and trigger the download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file. Please try again.");
    }
  };
  
  return { downloadFile, generateDownloadUrl };
}
