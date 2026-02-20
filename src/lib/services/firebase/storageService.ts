import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  getBlob,
  deleteObject,
  listAll,
  UploadMetadata
} from 'firebase/storage';
import { storage } from '@/lib/config/firebase';

// Type guard for storage
const storageTyped = storage as any;

class StorageService {
  private checkStorage() {
    if (!storage) {
      throw new Error('Firebase Storage is not initialized. Check your environment variables.');
    }
  }

  async uploadImage(
    file: File | Blob,
    path: string,
    metadata?: UploadMetadata,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      this.checkStorage();
      const storageRef = ref(storageTyped, path);

      // Use resumable upload for files larger than 5MB for better reliability
      const RESUMABLE_THRESHOLD = 5 * 1024 * 1024; // 5MB

      if (file.size > RESUMABLE_THRESHOLD) {
        // Use resumable upload for large files (videos, high-res images)
        return new Promise((resolve, reject) => {
          const uploadTask = uploadBytesResumable(storageRef, file, metadata);

          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              if (onProgress) {
                onProgress(progress);
              }
            },
            (error) => {
              reject(new Error(`Failed to upload file: ${error.message}`));
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
              } catch (error: any) {
                reject(new Error(`Failed to get download URL: ${error.message}`));
              }
            }
          );
        });
      } else {
        // Use simple upload for small files
        const snapshot = await uploadBytes(storageRef, file, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      }
    } catch (error: any) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  async uploadFile(
    file: File | Blob,
    path: string,
    metadata?: UploadMetadata,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      this.checkStorage();
      const storageRef = ref(storageTyped, path);

      // Use resumable upload for files larger than 5MB for better reliability
      const RESUMABLE_THRESHOLD = 5 * 1024 * 1024; // 5MB

      if (file.size > RESUMABLE_THRESHOLD) {
        // Use resumable upload for large files
        return new Promise((resolve, reject) => {
          const uploadTask = uploadBytesResumable(storageRef, file, metadata);

          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              if (onProgress) {
                onProgress(progress);
              }
            },
            (error) => {
              reject(new Error(`Failed to upload file: ${error.message}`));
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
              } catch (error: any) {
                reject(new Error(`Failed to get download URL: ${error.message}`));
              }
            }
          );
        });
      } else {
        // Use simple upload for small files
        const snapshot = await uploadBytes(storageRef, file, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      }
    } catch (error: any) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async uploadUserProfileImage(userId: string, file: File | Blob): Promise<string> {
    const path = `users/${userId}/profile.jpg`;
    return await this.uploadImage(file, path, {
      contentType: 'image/jpeg',
      customMetadata: {
        uploadedBy: userId,
        type: 'profile'
      }
    });
  }

  async uploadBrandProfileImage(
    brandId: string,
    file: File | Blob
  ): Promise<string> {
    const path = `brands/${brandId}/profile.jpg`;
    return await this.uploadImage(file, path, {
      contentType: file.type || 'image/jpeg',
      customMetadata: {
        brandId,
        imageType: 'profile',
        uploadedAt: new Date().toISOString()
      }
    });
  }

  async uploadBrandCoverImage(
    brandId: string,
    file: File | Blob
  ): Promise<string> {
    const path = `brands/${brandId}/cover.jpg`;
    return await this.uploadImage(file, path, {
      contentType: file.type || 'image/jpeg',
      customMetadata: {
        brandId,
        imageType: 'cover',
        uploadedAt: new Date().toISOString()
      }
    });
  }

  async uploadBrandProductImage(
    brandId: string,
    productId: string,
    file: File | Blob,
    imageType: 'main' | 'additional' = 'main'
  ): Promise<string> {
    const timestamp = Date.now();
    const path = `brands/${brandId}/products/${productId}/${imageType}_${timestamp}.jpg`;
    return await this.uploadImage(file, path, {
      contentType: file.type || 'image/jpeg',
      customMetadata: {
        brandId,
        productId,
        imageType,
        uploadedAt: new Date().toISOString()
      }
    });
  }

  async uploadBrandProviderImage(
    brandId: string,
    providerId: string,
    file: File | Blob,
    imageType: 'profile' | 'portfolio' = 'profile'
  ): Promise<string> {
    const timestamp = Date.now();
    const path = `brands/${brandId}/providers/${providerId}/${imageType}_${timestamp}.jpg`;
    return await this.uploadImage(file, path, {
      contentType: file.type || 'image/jpeg',
      customMetadata: {
        brandId,
        providerId,
        imageType,
        uploadedAt: new Date().toISOString()
      }
    });
  }

  async uploadBrandBeforeAfterImage(
    brandId: string,
    transformationId: string,
    file: File | Blob,
    imageType: 'before' | 'after'
  ): Promise<string> {
    const path = `brands/${brandId}/transformations/${transformationId}/${imageType}.jpg`;
    return await this.uploadImage(file, path, {
      contentType: file.type || 'image/jpeg',
      customMetadata: {
        brandId,
        transformationId,
        imageType,
        uploadedAt: new Date().toISOString()
      }
    });
  }

  async uploadBrandTrainingImage(
    brandId: string,
    trainingId: string,
    file: File | Blob
  ): Promise<string> {
    const timestamp = Date.now();
    const path = `brands/${brandId}/training/${trainingId}/cert_${timestamp}.jpg`;
    return await this.uploadImage(file, path, {
      contentType: file.type || 'image/jpeg',
      customMetadata: {
        brandId,
        trainingId,
        uploadedAt: new Date().toISOString()
      }
    });
  }

  async uploadBrandReviewImage(
    brandId: string,
    reviewId: string,
    file: File | Blob,
    index: number
  ): Promise<string> {
    const path = `brands/${brandId}/reviews/${reviewId}/image_${index}.jpg`;
    return await this.uploadImage(file, path, {
      contentType: file.type || 'image/jpeg',
      customMetadata: {
        brandId,
        reviewId,
        imageIndex: index.toString(),
        uploadedAt: new Date().toISOString()
      }
    });
  }

  async uploadAnalysisImage(
    userId: string,
    analysisId: string,
    file: File | Blob
  ): Promise<string> {
    const path = `users/${userId}/analyses/${analysisId}.jpg`;
    return await this.uploadImage(file, path, {
      contentType: 'image/jpeg',
      customMetadata: {
        uploadedBy: userId,
        type: 'analysis'
      }
    });
  }

  async uploadPortfolioImage(
    professionalId: string,
    file: File | Blob,
    imageId: string
  ): Promise<string> {
    const path = `professionals/${professionalId}/portfolio/${imageId}.jpg`;
    return await this.uploadImage(file, path, {
      contentType: 'image/jpeg',
      customMetadata: {
        uploadedBy: professionalId,
        type: 'portfolio'
      }
    });
  }

  async uploadReviewImage(
    reviewId: string,
    imageIndex: number,
    file: File | Blob
  ): Promise<string> {
    const path = `reviews/${reviewId}/image_${imageIndex}.jpg`;
    return await this.uploadImage(file, path, {
      contentType: 'image/jpeg',
      customMetadata: {
        type: 'review'
      }
    });
  }

  async uploadMagazineImage(
    issueId: string,
    sectionId: string,
    file: File | Blob,
    imageType: string = 'content'
  ): Promise<string> {
    const timestamp = Date.now();
    const fileName = file instanceof File ? file.name : 'image.jpg';
    const path = `magazine/${issueId}/${sectionId}/${imageType}_${timestamp}_${fileName}`;
    return await this.uploadImage(file, path, {
      contentType: file.type || 'image/jpeg',
      customMetadata: {
        issueId,
        sectionId,
        imageType,
        uploadedAt: new Date().toISOString()
      }
    });
  }

  async uploadMagazineVideo(
    issueId: string,
    sectionId: string,
    file: File | Blob,
    videoType: string = 'content'
  ): Promise<string> {
    const timestamp = Date.now();
    const fileName = file instanceof File ? file.name : 'video.mp4';
    const path = `magazine/${issueId}/${sectionId}/video_${timestamp}_${fileName}`;
    return await this.uploadImage(file, path, {
      contentType: file.type || 'video/mp4',
      customMetadata: {
        issueId,
        sectionId,
        videoType,
        uploadedAt: new Date().toISOString()
      }
    });
  }

  async deleteImage(path: string): Promise<void> {
    try {
      const storageRef = ref(storageTyped, path);
      await deleteObject(storageRef);
    } catch (error: any) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(storageTyped, path);
      await deleteObject(storageRef);
    } catch (error: any) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async deleteUserImages(userId: string): Promise<void> {
    try {
      const userRef = ref(storageTyped, `users/${userId}`);
      const listResult = await listAll(userRef);
      
      const deletePromises = listResult.items.map(item => deleteObject(item));
      await Promise.all(deletePromises);
    } catch (error: any) {
      throw new Error(`Failed to delete user images: ${error.message}`);
    }
  }

  async deleteProfessionalPortfolio(professionalId: string): Promise<void> {
    try {
      const portfolioRef = ref(storageTyped, `professionals/${professionalId}/portfolio`);
      const listResult = await listAll(portfolioRef);
      
      const deletePromises = listResult.items.map(item => deleteObject(item));
      await Promise.all(deletePromises);
    } catch (error: any) {
      throw new Error(`Failed to delete portfolio: ${error.message}`);
    }
  }

  getImageUrl(path: string): Promise<string> {
    const storageRef = ref(storageTyped, path);
    return getDownloadURL(storageRef);
  }

  /**
   * Download a video file as a Blob using Firebase SDK with authentication
   * This avoids CORS issues when extracting video frames
   * @param videoUrl - The Firebase Storage URL of the video
   * @returns Promise<Blob> - The video file as a Blob
   */
  async getVideoBlob(videoUrl: string): Promise<Blob> {
    try {
      this.checkStorage();
      
      // Extract the path from the Firebase Storage URL
      // URL format: https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[encoded-path]?alt=media&token=[token]
      const pathMatch = videoUrl.match(/\/o\/(.*?)\?/);
      if (!pathMatch) {
        throw new Error('Invalid Firebase Storage URL format');
      }
      
      // Decode the path (Firebase encodes special characters)
      const path = decodeURIComponent(pathMatch[1]);
      
      // Create a reference to the file
      const storageRef = ref(storageTyped, path);
      
      // Download the file as a Blob using Firebase SDK (with authentication)
      const blob = await getBlob(storageRef);
      
      return blob;
    } catch (error: any) {
      console.error('Error downloading video as blob:', error);
      throw new Error(`Failed to download video: ${error.message}`);
    }
  }

  async compressImage(
    file: File | Blob,
    maxWidth: number = 1200,
    maxHeight: number = 1200,
    quality: number = 0.8
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      // Detect the original file type
      const isPNG = (file as File).type === 'image/png' || 
                    (file as File).name?.endsWith('.png');
      const outputFormat = isPNG ? 'image/png' : 'image/jpeg';
      
      const reader = new FileReader();
      reader.readAsDataURL(file as Blob);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          
          // For PNG files, ensure transparent background
          if (isPNG && ctx) {
            ctx.clearRect(0, 0, width, height);
          }
          
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            outputFormat,
            isPNG ? undefined : quality // PNG doesn't use quality parameter
          );
        };
      };
    });
  }

  /**
   * Upload Get Featured submission files to Firebase Storage
   * This method handles all the different file types from Get Featured forms
   */
  async uploadGetFeaturedFiles(
    files: Array<{ name: string; type: string; size: number; data: string }>,
    submissionId: string,
    fieldKey: string
  ): Promise<Array<{ url: string; name: string; type: string; size: number }>> {
    try {
      this.checkStorage();

      if (!files || files.length === 0) {
        return [];
      }

      const uploadPromises = files.map(async (file) => {
        // Convert base64 to blob for upload
        const base64Data = file.data;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: file.type });

        // Create storage path
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const path = `get-featured-submissions/${submissionId}/${fieldKey}/${fileName}`;

        // Upload to Firebase Storage
        const downloadURL = await this.uploadImage(blob, path, {
          contentType: file.type,
          customMetadata: {
            submissionId,
            fieldKey,
            originalName: file.name,
            uploadedAt: new Date().toISOString()
          }
        });

        return {
          url: downloadURL,
          name: file.name,
          type: file.type,
          size: file.size
        };
      });

      const results = await Promise.all(uploadPromises);
      console.log(`✅ Uploaded ${results.length} files for field: ${fieldKey}`);

      return results;
    } catch (error: any) {
      console.error(`❌ Failed to upload files for field ${fieldKey}:`, error);
      throw new Error(`Failed to upload files: ${error.message}`);
    }
  }

  /**
   * Process all files in a Get Featured submission
   * Replaces base64 data with Firebase Storage URLs
   */
  async processGetFeaturedSubmission(
    submissionData: any,
    submissionId: string
  ): Promise<any> {
    try {
      console.log('📁 Processing Get Featured submission files...');

      const processedSubmission = { ...submissionData };

      // Define all file fields that may contain base64 data
      const fileFields = [
        'headshots',
        'workPhotos',
        'contentPlanningMedia',
        'beforeAfterPhotos',
        'portfolioPhotos',
        'professionalPhotos'
      ];

      let totalFilesUploaded = 0;

      // Process each file field
      for (const fieldKey of fileFields) {
        const files = processedSubmission[fieldKey];

        if (Array.isArray(files) && files.length > 0) {
          console.log(`📤 Processing ${fieldKey}: ${files.length} files`);

          // Check if files have base64 data that needs to be uploaded
          const filesWithData = files.filter(file => file && file.data);

          if (filesWithData.length > 0) {
            // Upload files and get URLs
            const uploadedFiles = await this.uploadGetFeaturedFiles(
              filesWithData,
              submissionId,
              fieldKey
            );

            // Replace files array with URLs and metadata (no base64 data)
            processedSubmission[fieldKey] = uploadedFiles;
            totalFilesUploaded += uploadedFiles.length;
          } else {
            // Files might already have URLs, keep as is
            console.log(`✅ ${fieldKey} files already have URLs, skipping upload`);
          }
        }
      }

      console.log(`✅ Get Featured submission processing complete. Uploaded ${totalFilesUploaded} files.`);

      return processedSubmission;
    } catch (error: any) {
      console.error('❌ Failed to process Get Featured submission:', error);
      throw new Error(`Failed to process submission: ${error.message}`);
    }
  }
}

// Export singleton instance
const storageService = new StorageService();
export default storageService;
  