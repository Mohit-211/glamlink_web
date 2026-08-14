"use client";

import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import Modal from "./GlamCardForm/Modal";
import { FieldErrors, GalleryMetaItem, GlamCardFormData } from "./GlamCardForm/types";
import getCroppedImg from "./GlamCardForm/cropImageHelper";

interface Props {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
  errors?: FieldErrors;
  clearError?: (key: string) => void;
}

const sectionClass =
  "space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm";
const labelClass = "text-sm font-medium text-gray-700";

const MAX_MEDIA_TOTAL = 5; // shared cap across photos + videos combined
const MAX_VIDEO_SECONDS = 60;

/* ================= HELPERS =================
   data.images can hold a mix of shapes:
   - new File uploads (from <input type="file">)
   - plain string URLs
   - server objects returned by the API, e.g.
     { id, file_type, file_uri, thumbnail_uri, ... }
   These helpers normalize any single entry into a renderable URL / video flag
   so the rest of the component doesn't need to care which shape it got. */
const getImageUrl = (item: any): string => {
  if (item instanceof File) return URL.createObjectURL(item);
  if (typeof item === "string") return item;
  if (item && typeof item === "object") return item.file_uri || item.url || "";
  return "";
};

const isVideoItem = (item: any): boolean => {
  if (item instanceof File) return item.type?.startsWith("video/") ?? false;
  if (item && typeof item === "object") {
    if (item.file_type === "video") return true;
    const uri = item.file_uri || item.url || "";
    return /\.(mp4|mov|webm|avi|mkv)$/i.test(uri);
  }
  return false;
};

const getThumbnailUrl = (item: any): string => {
  if (item && typeof item === "object" && !(item instanceof File)) {
    return item.thumbnail_uri || "";
  }
  return "";
};

type CropContext = "profile" | "gallery" | "thumbnail";

const CROP_ASPECTS: Record<CropContext, number> = {
  profile: 1,
  gallery: 4 / 3,
  thumbnail: 16 / 9,
};

const urlToFile = async (url: string): Promise<File> => {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new Error("Couldn't reach that URL” check the link and try again.");
  }
  if (!res.ok) throw new Error(`Couldn't load that image (status ${res.status}).`);
  const blob = await res.blob();
  if (!blob.type.startsWith("image/")) {
    throw new Error("That URL doesn't point to an image.");
  }
  const filename = url.split("/").pop()?.split(/[?#]/)[0] || `image-${Date.now()}.jpg`;
  return new File([blob], filename, { type: blob.type });
};

const isMp4File = (file: File): boolean =>
  file.type === "video/mp4" || /\.mp4$/i.test(file.name);


const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const videoEl = document.createElement("video");
    videoEl.preload = "metadata";
    videoEl.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(videoEl.duration);
    };
    videoEl.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read video metadata"));
    };
    videoEl.src = url;
  });
};

// Auto-generates a poster image for a video by grabbing a frame partway
// through it. Used as the default thumbnail immediately on upload; the
// user can still replace it manually afterwards.
const generateVideoThumbnail = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const videoEl = document.createElement("video");
    videoEl.preload = "metadata";
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.src = url;

    const cleanup = () => URL.revokeObjectURL(url);

    videoEl.onloadedmetadata = () => {
      // Grab a frame ~1s in (or the midpoint for very short clips) so we
      // don't land on a black/blank opening frame.
      videoEl.currentTime = Math.min(1, videoEl.duration / 2 || 0);
    };

    videoEl.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = videoEl.videoWidth;
      canvas.height = videoEl.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx || !canvas.width || !canvas.height) {
        cleanup();
        reject(new Error("Could not read video frame"));
        return;
      }
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          cleanup();
          if (!blob) {
            reject(new Error("Could not capture thumbnail"));
            return;
          }
          resolve(
            new File([blob], `${file.name.replace(/\.[^/.]+$/, "")}-thumb.jpg`, {
              type: "image/jpeg",
            })
          );
        },
        "image/jpeg",
        0.85
      );
    };

    videoEl.onerror = () => {
      cleanup();
      reject(new Error("Could not load video"));
    };
  });
};

const MediaAndProfileForm: React.FC<Props> = ({ data, setData, errors, clearError }) => {
  /* ================= CROP MODAL (shared) ================= */

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  const [cropContext, setCropContext] = useState<CropContext>("profile");
  const [cropThumbnailId, setCropThumbnailId] = useState<string | null>(null);
  const [galleryCropQueue, setGalleryCropQueue] = useState<File[]>([]);

  const onCropComplete = useCallback((_: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const openCropper = (
    file: File,
    context: CropContext,
    thumbnailId?: string
  ) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCropContext(context);
      setCropThumbnailId(thumbnailId ?? null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setIsCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const cancelCrop = () => {
    setIsCropOpen(false);
    setGalleryCropQueue([]);
    setCropThumbnailId(null);
  };

  const applyCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);

    if (cropContext === "profile") {
      setData((prev) => ({ ...prev, profile_image: croppedFile }));
      clearError?.("profile_image");
      setIsCropOpen(false);
      return;
    }

    if (cropContext === "thumbnail") {
      if (cropThumbnailId) {
        setData((prev) => ({
          ...prev,
          gallery_meta: prev.gallery_meta.map((m) =>
            m.id === cropThumbnailId ? { ...m, thumbnail_file: croppedFile } : m
          ),
        }));
      }
      setIsCropOpen(false);
      setCropThumbnailId(null);
      return;
    }

    addMediaToGallery([croppedFile]);

    if (galleryCropQueue.length) {
      const [next, ...rest] = galleryCropQueue;
      setGalleryCropQueue(rest);
      openCropper(next, "gallery");
    } else {
      setIsCropOpen(false);
    }
  };

  /* ================= PROFILE IMAGE ================= */

  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  useEffect(() => {
    if (data.profile_image instanceof File) {
      const url = URL.createObjectURL(data.profile_image);
      setProfilePreview(url);
      return () => URL.revokeObjectURL(url);
    }
    if (typeof data.profile_image === "string" && data.profile_image) {
      setProfilePreview(data.profile_image);
    } else {
      setProfilePreview(null);
    }
  }, [data.profile_image]);

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    openCropper(file, "profile");
    e.target.value = "";
  };

  const [profileUrlInput, setProfileUrlInput] = useState("");
  const [profileUrlLoading, setProfileUrlLoading] = useState(false);
  const [profileUrlError, setProfileUrlError] = useState<string | null>(null);

  const handleProfileUrlAdd = async () => {
    const url = profileUrlInput.trim();
    if (!url) return;
    setProfileUrlError(null);
    setProfileUrlLoading(true);
    try {
      const file = await urlToFile(url);
      openCropper(file, "profile");
      setProfileUrlInput("");
    } catch (err) {
      setProfileUrlError(
        err instanceof Error ? err.message : "Couldn't load that image URL."
      );
    } finally {
      setProfileUrlLoading(false);
    }
  };

  /* ================= GALLERY (photos + videos) ================= */

  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);
  const [videoThumbPreviews, setVideoThumbPreviews] = useState<Record<string, string>>({});
  const [mediaError, setMediaError] = useState<string | null>(null);

  const gallery_meta: GalleryMetaItem[] = data.gallery_meta || [];
  const images = data.images || [];

  const photoCount = images.filter((img) => !isVideoItem(img)).length;
  const videoCount = images.filter((img) => isVideoItem(img)).length;
  const totalMediaCount = photoCount + videoCount;

  useEffect(() => {

    const urls = images.map((item) => getImageUrl(item));
    setGalleryPreview(urls);
    return () => {
      images.forEach((item, i) => {
        if (item instanceof File) URL.revokeObjectURL(urls[i]);
      });
    };
  }, [data.images]);

  useEffect(() => {
    const entries: Record<string, string> = {};
    gallery_meta.forEach((item, index) => {
      if (item.thumbnail_file instanceof File) {
        entries[item.id] = URL.createObjectURL(item.thumbnail_file);
      } else {
        // Fall back to a thumbnail URL that may have come from the server
        // alongside this gallery item (e.g. for existing videos in edit mode).
        const sourceImage = images[index];
        const serverThumb = getThumbnailUrl(sourceImage);
        if (serverThumb) entries[item.id] = serverThumb;
      }
    });
    setVideoThumbPreviews(entries);
    return () => {
      gallery_meta.forEach((item) => {
        if (item.thumbnail_file instanceof File && entries[item.id]) {
          URL.revokeObjectURL(entries[item.id]);
        }
      });
    };
  }, [data.gallery_meta, data.images]);

  // Shared by cropped photo uploads and validated video uploads.
  // `thumbnailFiles` (parallel to `files`) lets videos carry an
  // auto-generated poster straight into gallery_meta.
  const addMediaToGallery = (files: File[], thumbnailFiles: (File | undefined)[] = []) => {
    clearError?.("images");
    setData((prev) => {
      const existingImages = prev.images || [];
      const existingMeta = prev.gallery_meta || [];

      const newMeta: GalleryMetaItem[] = files.map((file, index) => ({
        id: crypto.randomUUID(),
        caption: "",
        is_thumbnail: false,
        sort_order: existingImages.length + index,
        thumbnail_file: thumbnailFiles[index],
      }));

      return {
        ...prev,
        images: [...existingImages, ...files],
        gallery_meta: [...existingMeta, ...newMeta],
      };
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setMediaError(null);

    const remainingSlots = MAX_MEDIA_TOTAL - totalMediaCount;
    if (remainingSlots <= 0) {
      setMediaError(`You can upload up to ${MAX_MEDIA_TOTAL} media items total.`);
      e.target.value = "";
      return;
    }

    const allowed = files.slice(0, remainingSlots);
    const [first, ...rest] = allowed;
    setGalleryCropQueue(rest);
    openCropper(first, "gallery");
    e.target.value = "";
  };

  const [galleryUrlInput, setGalleryUrlInput] = useState("");
  const [galleryUrlLoading, setGalleryUrlLoading] = useState(false);

  const handleGalleryUrlAdd = async () => {
    const url = galleryUrlInput.trim();
    if (!url) return;
    setMediaError(null);

    if (totalMediaCount >= MAX_MEDIA_TOTAL) {
      setMediaError(`You can upload up to ${MAX_MEDIA_TOTAL} media items total.`);
      return;
    }

    setGalleryUrlLoading(true);
    try {
      const file = await urlToFile(url);
      openCropper(file, "gallery");
      setGalleryUrlInput("");
    } catch (err) {
      setMediaError(err instanceof Error ? err.message : "Couldn't load that image URL.");
    } finally {
      setGalleryUrlLoading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setMediaError(null);

    const remainingSlots = MAX_MEDIA_TOTAL - totalMediaCount;
    if (remainingSlots <= 0) {
      setMediaError(`You can upload up to ${MAX_MEDIA_TOTAL} media items total.`);
      e.target.value = "";
      return;
    }

    const allowed = files.slice(0, remainingSlots);

    // Videos aren't croppable, but they must be validated first: .mp4 only,
    // under 60 seconds. Invalid ones are skipped with an inline error.
    const validVideos: File[] = [];
    for (const file of allowed) {
      if (!isMp4File(file)) {
        setMediaError("Only .mp4 videos are supported.");
        continue;
      }
      try {
        const duration = await getVideoDuration(file);
        if (duration > MAX_VIDEO_SECONDS) {
          setMediaError("Videos must be under 60 seconds.");
          continue;
        }
      } catch {
        setMediaError("Couldn't read that video — please try a different one.");
        continue;
      }
      validVideos.push(file);
    }

    if (validVideos.length) {
      // Auto-generate a poster frame for each video so it never sits with a
      // blank thumbnail. If generation fails, it just falls back to the
      // placeholder icon and the user can upload one manually.
      const autoThumbnails = await Promise.all(
        validVideos.map((file) => generateVideoThumbnail(file).catch(() => undefined))
      );
      addMediaToGallery(validVideos, autoThumbnails);
    }

    e.target.value = "";
  };

  const removeMedia = (id: string) => {
    setData((prev) => {
      const index = prev.gallery_meta.findIndex((m) => m.id === id);
      if (index === -1) return prev;

      const updatedImages = prev.images.filter((_, i) => i !== index);
      const updatedMeta = prev.gallery_meta.filter((m) => m.id !== id);

      return { ...prev, images: updatedImages, gallery_meta: updatedMeta };
    });
  };

  const handleVideoThumbnailUpload = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    openCropper(file, "thumbnail", id);
    e.target.value = "";
  };

  /* ================= RENDER ================= */

  const renderMediaCard = (item: GalleryMetaItem, index: number, isVideo: boolean) => {
    const thumbPreview = videoThumbPreviews[item.id];

    return (
      <div key={item.id} className="border rounded-xl p-3 space-y-2 bg-gray-50">
        {/* Media preview */}
        <div className="relative">
          {isVideo ? (
            thumbPreview ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <img src={thumbPreview} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <svg className="w-10 h-10 text-white opacity-90" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                  Video
                </span>
              </div>
            ) : (
              <div className="relative w-full aspect-video rounded-lg bg-gray-900 flex items-center justify-center">
                <svg className="w-10 h-10 text-white opacity-70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                  Video
                </span>
              </div>
            )
          ) : (
            <img
              src={galleryPreview[index]}
              className="w-full aspect-[4/3] object-cover rounded-lg"
            />
          )}
        </div>

        {/* Video poster (thumbnail) upload — auto-generated by default, replaceable */}
        {isVideo && (
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Video thumbnail</p>

            {thumbPreview ? (
              <div className="relative">
                <img src={thumbPreview} className="w-full aspect-video object-cover rounded-lg" />
                <label className="absolute bottom-1 right-1 cursor-pointer bg-black/60 text-white text-xs px-2 py-0.5 rounded hover:bg-black/80">
                  Change
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleVideoThumbnailUpload(item.id, e)}
                  />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-1 border border-dashed border-gray-300 rounded-lg py-3 cursor-pointer hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 16.5V18a1.5 1.5 0 001.5 1.5h15A1.5 1.5 0 0021 18v-1.5M12 3v12m0-12L8.5 6.5M12 3l3.5 3.5"
                  />
                </svg>
                <span className="text-xs text-gray-400">Upload thumbnail</span>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleVideoThumbnailUpload(item.id, e)}
                />
              </label>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end text-xs">
          <button onClick={() => removeMedia(item.id)} className="text-red-600 hover:underline">
            Remove
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className={sectionClass}>
      <h2 className="text-lg font-semibold">Media & Profile</h2>

      {/* PROFILE */}
      <div id="field-profile_image" className="space-y-3">
        <label className={labelClass}>Profile Image</label>
        <div className="flex items-center gap-5">
          <div className="relative w-32 h-32">
            <div
              className={`w-32 h-32 rounded-full border overflow-hidden bg-gray-50 flex items-center justify-center ${errors?.profile_image ? "border-2 border-red-500" : ""
                }`}
            >
              {profilePreview ? (
                <img src={profilePreview} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-sm text-center">
                  Upload
                  <br />
                  Profile
                </span>
              )}
            </div>
            <label className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#24bbcb] text-white shadow-md transition hover:bg-[#1faebe]">
              <span className="text-sm leading-none">✎</span>

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleProfileUpload}
              />
            </label>
          </div>
          <p className="text-sm text-gray-500">
            Square image works best. Face centered. Clean background.
          </p>
        </div>
        {errors?.profile_image && (
          <p className="text-sm text-red-500">{errors.profile_image}</p>
        )}

        <div className="flex items-center gap-2">
          <input
            type="url"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
            placeholder="Or paste an image URL"
            value={profileUrlInput}
            onChange={(e) => setProfileUrlInput(e.target.value)}
          />
          <button
            type="button"
            onClick={handleProfileUrlAdd}
            disabled={!profileUrlInput.trim() || profileUrlLoading}
            className="rounded-lg bg-[#24bbcb] px-4 py-2 text-xs font-medium text-white hover:bg-[#24bbcb] disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {profileUrlLoading ? "Loading..." : "Add"}
          </button>
        </div>
        {profileUrlError && (
          <p className="text-xs text-red-500">{profileUrlError}</p>
        )}
      </div>

      <div id="field-images">
        <p
          className={`text-xs pt-2 ${errors?.images ? "text-red-500 font-medium" : "text-gray-500"
            }`}
        >
          Gallery media: {totalMediaCount}/{MAX_MEDIA_TOTAL} used (photos + videos combined)
        </p>
        {errors?.images && (
          <p className="mt-1 text-sm text-red-500">{errors.images}</p>
        )}



        {/* PHOTOS SECTION */}
        <div
          className={`space-y-4 pt-2 border-t ${errors?.images ? "border-red-300" : "border-gray-100"
            }`}
        >
          <div className="flex justify-between items-center pt-4">
            <label className={labelClass}>Photos ({photoCount})</label>
            <label
              className={`rounded-lg px-4 py-2 text-white ${totalMediaCount >= MAX_MEDIA_TOTAL
                  ? "bg-gray-300 cursor-not-allowed"
                  : "cursor-pointer bg-[#24bbcb] hover:bg-[#24bbcb]"
                }`}
            >
              + Upload Photos
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                disabled={totalMediaCount >= MAX_MEDIA_TOTAL}
                onChange={handlePhotoUpload}
              />
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="url"
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              placeholder="Or paste an image URL"
              value={galleryUrlInput}
              onChange={(e) => setGalleryUrlInput(e.target.value)}
              disabled={totalMediaCount >= MAX_MEDIA_TOTAL}
            />
            <button
              type="button"
              onClick={handleGalleryUrlAdd}
              disabled={
                !galleryUrlInput.trim() ||
                galleryUrlLoading ||
                totalMediaCount >= MAX_MEDIA_TOTAL
              }
              className="rounded-lg bg-[#24bbcb] px-4 py-2 text-xs font-medium text-white hover:bg-[#24bbcb] disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {galleryUrlLoading ? "Loading..." : "+ Add URL"}
            </button>
          </div>

          {photoCount ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallery_meta.map((item, index) =>
                !isVideoItem(images[index]) ? renderMediaCard(item, index, false) : null
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No photos uploaded</p>
          )}
        </div>
      </div>

      {/* VIDEOS SECTION */}
      <div className="space-y-4 pt-2 border-t border-gray-100">
        <div className="flex justify-between items-center pt-4">
          <div>
            <label className={labelClass}>Videos ({videoCount})</label>
            <p className="text-xs text-gray-400">Must be .mp4 and under 60 seconds</p>
            {mediaError && (
              <p className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {mediaError}
              </p>
            )}
          </div>
          <label
            className={`rounded-lg px-4 py-2 text-white ${totalMediaCount >= MAX_MEDIA_TOTAL
                ? "bg-gray-300 cursor-not-allowed"
                : "cursor-pointer bg-[#24bbcb] hover:bg-[#24bbcb]"
              }`}
          >
            + Upload Videos
            <input
              type="file"
              hidden
              multiple
              accept="video/mp4"
              disabled={totalMediaCount >= MAX_MEDIA_TOTAL}
              onChange={handleVideoUpload}
            />
          </label>
        </div>

        {videoCount ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {gallery_meta.map((item, index) =>
              isVideoItem(images[index]) ? renderMediaCard(item, index, true) : null
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No videos uploaded</p>
        )}
      </div>

      {isCropOpen && (
        <Modal onClose={cancelCrop}>
          <div className="w-[90vw] max-w-md space-y-4">
            {cropContext === "gallery" && galleryCropQueue.length > 0 && (
              <p className="text-center text-xs text-gray-500">
                {galleryCropQueue.length} more photo
                {galleryCropQueue.length > 1 ? "s" : ""} to crop after this one
              </p>
            )}
            <div className="relative h-80 bg-black rounded overflow-hidden">
              <Cropper
                image={imageSrc!}
                crop={crop}
                zoom={zoom}
                aspect={CROP_ASPECTS[cropContext]}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex gap-3">
              <button onClick={cancelCrop} className="flex-1 border rounded py-2">
                Cancel
              </button>
              <button
                onClick={applyCrop}
                className="flex-1 bg-[#24bbcb] text-white rounded py-2 hover:bg-[#24bbcb]"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default MediaAndProfileForm;