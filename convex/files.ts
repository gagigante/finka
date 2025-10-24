import { v } from "convex/values";
import { action, mutation } from "./_generated/server";
import { ConvexError } from "convex/values";

// AWS S3 configuration
const REGION = process.env.S3_REGION; // Replace with your AWS region
const S3_BUCKET = process.env.S3_BUCKET_NAME; // Replace with your S3 bucket name
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

console.log("S3 Config:", { 
  REGION, 
  S3_BUCKET, 
  hasAccessKey: !!AWS_ACCESS_KEY_ID,
  hasSecretKey: !!AWS_SECRET_ACCESS_KEY
});

// Generate a presigned URL for uploading a file to S3
export const generateUploadUrl = action({
  args: {
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
  },
  handler: async (ctx, { fileName, fileType, fileSize }) => {
    const authUser = await ctx.auth.getUserIdentity();
    if (!authUser) {
      throw new ConvexError("Unauthorized");
    }

    // Import AWS SDK dynamically (since it's only available in Node.js)
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");

    // Check if required configuration is available
    if (!REGION) {
      throw new ConvexError("AWS S3 region is missing. Please set the S3_REGION environment variable.");
    }
    
    if (!S3_BUCKET) {
      throw new ConvexError("AWS S3 bucket name is missing. Please set the S3_BUCKET_NAME environment variable.");
    }
    
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      throw new ConvexError("AWS credentials are missing. Please set the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.");
    }

    // Create S3 client with explicit credentials
    const client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      }
    });

    // Generate a unique file key (path in S3)
    const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    const key = `task-files/${fileId}-${fileName}`;

    // Create command for S3 upload with CORS headers
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      ContentType: fileType,
    });

    // Generate presigned URL (valid for 5 minutes) with CORS support
    const signedUrl = await getSignedUrl(client, command, { 
      expiresIn: 300,
      // Add CORS headers to the presigned URL
      signingRegion: REGION
    });

    // Return the URL and file info
    return {
      uploadUrl: signedUrl,
      fileId,
      key,
    };
  },
});

// Save file metadata after successful upload
export const saveFileMetadata = mutation({
  args: {
    taskId: v.optional(v.id("tasks")),
    fileId: v.string(),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    key: v.string(),
  },
  handler: async (ctx, { taskId, fileId, fileName, fileType, fileSize, key }) => {
    const authUser = await ctx.auth.getUserIdentity();
    if (!authUser) {
      throw new ConvexError("Unauthorized");
    }

    // Generate the public URL for the file
    const fileUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

    const fileData = {
      id: fileId,
      name: fileName,
      url: fileUrl,
      size: fileSize,
      type: fileType,
      uploadedAt: new Date().toISOString(),
    };

    // If taskId is provided, update the task with the new file
    if (taskId) {
      const task = await ctx.db.get(taskId);
      if (!task) {
        throw new ConvexError("Task not found");
      }

      const files = task.files || [];
      await ctx.db.patch(taskId, {
        files: [...files, fileData],
      });
    }

    return fileData;
  },
});

// Generate a presigned URL for downloading a file from S3
export const generateDownloadUrl = action({
  args: {
    key: v.string(),
  },
  handler: async (ctx, { key }) => {
    const authUser = await ctx.auth.getUserIdentity();
    if (!authUser) {
      throw new ConvexError("Unauthorized");
    }

    // Import AWS SDK dynamically
    const { S3Client, GetObjectCommand } = await import("@aws-sdk/client-s3");
    const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");

    // Check if required configuration is available
    if (!REGION) {
      throw new ConvexError("AWS S3 region is missing. Please set the S3_REGION environment variable.");
    }
    
    if (!S3_BUCKET) {
      throw new ConvexError("AWS S3 bucket name is missing. Please set the S3_BUCKET_NAME environment variable.");
    }
    
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      throw new ConvexError("AWS credentials are missing. Please set the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.");
    }

    // Create S3 client with explicit credentials
    const client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      }
    });

    // Create command for S3 download
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    });

    // Generate presigned URL (valid for 15 minutes)
    const signedUrl = await getSignedUrl(client, command, { expiresIn: 900 });

    return {
      downloadUrl: signedUrl,
    };
  },
});

// Remove a file from a task and optionally delete it from S3
export const removeFile = mutation({
  args: {
    taskId: v.id("tasks"),
    fileId: v.string(),
    deleteFromS3: v.optional(v.boolean()),
  },
  handler: async (ctx, { taskId, fileId, deleteFromS3 = true }) => {
    const authUser = await ctx.auth.getUserIdentity();
    if (!authUser) {
      throw new ConvexError("Unauthorized");
    }

    const task = await ctx.db.get(taskId);
    if (!task) {
      throw new ConvexError("Task not found");
    }

    const files = task.files || [];
    const fileToRemove = files.find(file => file.id === fileId);
    
    if (!fileToRemove) {
      throw new ConvexError("File not found in task");
    }

    // Update the task with the file removed
    await ctx.db.patch(taskId, {
      files: files.filter(file => file.id !== fileId),
    });

    return { success: true, fileKey: fileToRemove.url.split(`https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/`)[1] };
  },
});

// Delete a file from S3
export const deleteFileFromS3 = action({
  args: {
    key: v.string(),
  },
  handler: async (ctx, { key }) => {
    const authUser = await ctx.auth.getUserIdentity();
    if (!authUser) {
      throw new ConvexError("Unauthorized");
    }
    
    // Import AWS SDK dynamically
    const { S3Client, DeleteObjectCommand } = await import("@aws-sdk/client-s3");

    // Check if required configuration is available
    if (!REGION) {
      throw new ConvexError("AWS S3 region is missing. Please set the S3_REGION environment variable.");
    }
    
    if (!S3_BUCKET) {
      throw new ConvexError("AWS S3 bucket name is missing. Please set the S3_BUCKET_NAME environment variable.");
    }
    
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      throw new ConvexError("AWS credentials are missing. Please set the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.");
    }

    // Create S3 client with explicit credentials
    const client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      }
    });

    // Create command for S3 delete
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    });

    // Execute the delete command
    await client.send(command);

    return { success: true };
  },
});
