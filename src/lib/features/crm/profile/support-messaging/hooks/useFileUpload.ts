'use client';

import { useState, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/config/firebase';
import type { Attachment } from '../types/attachment';
import { validateFile, getAttachmentType } from '../types/attachment';

export interface UploadProgress {
  id: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error' | 'cancelled';
  error?: string;
  url?: string;
}

export interface UseFileUploadReturn {
  /** Upload a file to Firebase Storage */
  uploadFile: (file: File, conversationId: string) => Promise<Attachment | null>;
  /** Cancel an ongoing upload */
  cancelUpload: (uploadId: string) => void;
  /** Delete an uploaded file */
  deleteFile: (url: string) => Promise<boolean>;
  /** Current upload progress for all files */
  uploads: Map<string, UploadProgress>;
  /** Whether any upload is in progress */
  isUploading: boolean;
  /** Clear completed/failed uploads from the list */
  clearCompletedUploads: () => void;
}

/**
 * Hook for uploading files to Firebase Storage
 */
export function useFileUpload(): UseFileUploadReturn {
  const [uploads, setUploads] = useState<Map<string, UploadProgress>>(new Map());
  const [uploadTasks] = useState<Map<string, ReturnType<typeof uploadBytesResumable>>>(new Map());

  const isUploading = Array.from(uploads.values()).some((u) => u.status === 'uploading');

  const uploadFile = useCallback(
    async (file: File, conversationId: string): Promise<Attachment | null> => {
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        console.error('File validation failed:', validation.error);
        return null;
      }

      if (!storage) {
        console.error('Firebase Storage not initialized');
        return null;
      }

      const uploadId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const timestamp = Date.now();
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `support_attachments/${conversationId}/${timestamp}_${safeFileName}`;
      const storageRef = ref(storage, storagePath);

      // Initialize upload progress
      setUploads((prev) => {
        const next = new Map(prev);
        next.set(uploadId, {
          id: uploadId,
          fileName: file.name,
          progress: 0,
          status: 'uploading',
        });
        return next;
      });

      return new Promise((resolve) => {
        const uploadTask = uploadBytesResumable(storageRef, file, {
          contentType: file.type,
          customMetadata: {
            originalName: file.name,
            conversationId,
          },
        });

        uploadTasks.set(uploadId, uploadTask);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploads((prev) => {
              const next = new Map(prev);
              const current = next.get(uploadId);
              if (current) {
                next.set(uploadId, { ...current, progress });
              }
              return next;
            });
          },
          (error) => {
            console.error('Upload error:', error);
            uploadTasks.delete(uploadId);

            const errorMessage =
              error.code === 'storage/canceled' ? 'Upload cancelled' : 'Upload failed';

            setUploads((prev) => {
              const next = new Map(prev);
              const current = next.get(uploadId);
              if (current) {
                next.set(uploadId, {
                  ...current,
                  status: error.code === 'storage/canceled' ? 'cancelled' : 'error',
                  error: errorMessage,
                });
              }
              return next;
            });
            resolve(null);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              uploadTasks.delete(uploadId);

              setUploads((prev) => {
                const next = new Map(prev);
                const current = next.get(uploadId);
                if (current) {
                  next.set(uploadId, {
                    ...current,
                    progress: 100,
                    status: 'completed',
                    url,
                  });
                }
                return next;
              });

              const attachment: Attachment = {
                id: uploadId,
                type: getAttachmentType(file.type),
                url,
                name: file.name,
                size: file.size,
                mimeType: file.type,
                uploadedAt: new Date(),
              };

              resolve(attachment);
            } catch (error) {
              console.error('Error getting download URL:', error);
              setUploads((prev) => {
                const next = new Map(prev);
                const current = next.get(uploadId);
                if (current) {
                  next.set(uploadId, {
                    ...current,
                    status: 'error',
                    error: 'Failed to get download URL',
                  });
                }
                return next;
              });
              resolve(null);
            }
          }
        );
      });
    },
    [uploadTasks]
  );

  const cancelUpload = useCallback(
    (uploadId: string) => {
      const task = uploadTasks.get(uploadId);
      if (task) {
        task.cancel();
        uploadTasks.delete(uploadId);
      }
    },
    [uploadTasks]
  );

  const deleteFile = useCallback(async (url: string): Promise<boolean> => {
    if (!storage) return false;

    try {
      const fileRef = ref(storage, url);
      await deleteObject(fileRef);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }, []);

  const clearCompletedUploads = useCallback(() => {
    setUploads((prev) => {
      const next = new Map(prev);
      for (const [id, upload] of next) {
        if (upload.status !== 'uploading') {
          next.delete(id);
        }
      }
      return next;
    });
  }, []);

  return {
    uploadFile,
    cancelUpload,
    deleteFile,
    uploads,
    isUploading,
    clearCompletedUploads,
  };
}
