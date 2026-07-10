"use client";

import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import Modal from "./GlamCardForm/Modal";
import { GalleryMetaItem, GlamCardFormData } from "./GlamCardForm/types";
import getCroppedImg from "./GlamCardForm/cropImageHelper";

interface Props {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
}

const sectionClass =
  "space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm";
const labelClass = "text-sm font-medium text-gray-700";

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

/* Crop modal can be applied to three different targets. "gallery" crops
   are processed one file at a time via galleryCropQueue so multi-select
   uploads still get cropped individually before being added. */
type CropContext = "profile" | "gallery" | "thumbnail";

const MAX_VIDEO_SECONDS = 60;

const isMp4File = (file: File): boolean =>
  file.type === "video/mp4" || /\.mp4$/i.test(file.name);

// Reads duration via a throwaway <video> element's loaded metadata —
// no upload or decode needed, just enough to read the header.
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

const MediaAndProfileForm: React.FC<Props> = ({ data, setData }) => {
  /* ================= CROP MODAL (shared) ================= */

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [cropAspect, setCropAspect] = useState(16 / 9);

  const [cropContext, setCropContext] = useState<CropContext>("profile");
  const [cropThumbnailId, setCropThumbnailId] = useState<string | null>(null);
  const [galleryCropQueue, setGalleryCropQueue] = useState<File[]>([]);

  const onCropComplete = useCallback((_: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const openCropper = (
    file: File,
    context: CropContext,
    aspect: number,
    thumbnailId?: string
  ) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCropContext(context);
      setCropAspect(aspect);
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

    // cropContext === "gallery"
    addImagesToGallery([croppedFile]);

    if (galleryCropQueue.length) {
      const [next, ...rest] = galleryCropQueue;
      setGalleryCropQueue(rest);
      openCropper(next, "gallery", 16 / 9);
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
      // Existing profile image URL from the server (edit mode) — render directly, no object URL needed.
      setProfilePreview(data.profile_image);
    } else {
      setProfilePreview(null);
    }
  }, [data.profile_image]);

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    openCropper(file, "profile", 16 / 9);
    e.target.value = "";
  };

  /* ================= GALLERY ================= */

  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);
  const [videoThumbPreviews, setVideoThumbPreviews] = useState<Record<string, string>>({});
  const [mediaError, setMediaError] = useState<string | null>(null);

  const gallery_meta: GalleryMetaItem[] = data.gallery_meta || [];

  useEffect(() => {
    // data.images can hold a mix of new File uploads, plain string URLs, and
    // server objects ({file_uri, file_type, thumbnail_uri, ...}) in edit mode.
    // Only File instances need an object URL — everything else is already
    // renderable once we pull the right field out.
    const urls = (data.images || []).map((item) => getImageUrl(item));
    setGalleryPreview(urls);
    return () => {
      (data.images || []).forEach((item, i) => {
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
        const sourceImage = data.images?.[index];
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

  // Shared by direct video uploads and cropped-gallery-image results.
  const addImagesToGallery = (files: File[]) => {
    setData((prev) => {
      const existingImages = prev.images || [];
      const allowed = files.slice(0, 5 - existingImages.length);
      if (!allowed.length) return prev;

      const newMeta: GalleryMetaItem[] = allowed.map((_, index) => ({
        id: crypto.randomUUID(),
        caption: "",
        is_thumbnail: existingImages.length === 0 && index === 0,
        sort_order: existingImages.length + index,
      }));

      return {
        ...prev,
        images: [...existingImages, ...allowed],
        gallery_meta: [...(prev.gallery_meta || []), ...newMeta],
      };
    });
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setMediaError(null);

    const existingCount = data.images?.length || 0;
    const allowed = files.slice(0, 5 - existingCount);
    if (!allowed.length) {
      e.target.value = "";
      return;
    }

    const videoFiles = allowed.filter((f) => f.type?.startsWith("video/"));
    const imageFiles = allowed.filter((f) => !f.type?.startsWith("video/"));

    // Videos aren't croppable, but they must be validated first: .mp4 only,
    // under 60 seconds. Invalid ones are skipped with an inline error.
    const validVideos: File[] = [];
    for (const file of videoFiles) {
      if (!isMp4File(file)) {
        setMediaError(`"${file.name}" isn't an .mp4 file — only .mp4 videos are supported.`);
        continue;
      }
      try {
        const duration = await getVideoDuration(file);
        if (duration > MAX_VIDEO_SECONDS) {
          setMediaError(
            `"${file.name}" is ${Math.round(duration)}s long — videos must be under 60 seconds.`
          );
          continue;
        }
      } catch {
        setMediaError(`Couldn't read "${file.name}" — please try a different video.`);
        continue;
      }
      validVideos.push(file);
    }

    if (validVideos.length) addImagesToGallery(validVideos);

    // Images go through the shared crop modal, one at a time.
    if (imageFiles.length) {
      const [first, ...rest] = imageFiles;
      setGalleryCropQueue(rest);
      openCropper(first, "gallery", 16 / 9);
    }

    e.target.value = "";
  };

  const removeMedia = (id: string) => {
    setData((prev) => {
      const index = prev.gallery_meta.findIndex((m) => m.id === id);
      if (index === -1) return prev;

      const updatedImages = prev.images.filter((_, i) => i !== index);
      let updatedMeta = prev.gallery_meta.filter((m) => m.id !== id);

      if (updatedMeta.length && !updatedMeta.some((m) => m.is_thumbnail)) {
        updatedMeta[0].is_thumbnail = true;
      }

      return { ...prev, images: updatedImages, gallery_meta: updatedMeta };
    });
  };

  const setThumbnail = (id: string) => {
    setData((prev) => ({
      ...prev,
      gallery_meta: prev.gallery_meta.map((m) => ({
        ...m,
        is_thumbnail: m.id === id,
      })),
    }));
  };

  const updateCaption = (id: string, caption: string) => {
    setData((prev) => ({
      ...prev,
      gallery_meta: prev.gallery_meta.map((m) =>
        m.id === id ? { ...m, caption } : m
      ),
    }));
  };

  const handleVideoThumbnailUpload = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    openCropper(file, "thumbnail", 16 / 9, id);
    e.target.value = "";
  };

  /* ================= RENDER ================= */

  return (
    <section className={sectionClass}>
      <h2 className="text-lg font-semibold">Media & Profile</h2>

      {/* PROFILE */}
      <div className="space-y-3">
        <label className={labelClass}>Profile Image</label>
        <div className="flex items-center gap-5">
          <div className="relative w-32 h-32">
            <div className="w-32 h-32 rounded-full border overflow-hidden bg-gray-50 flex items-center justify-center">
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
            <label className="absolute bottom-0 right-0 cursor-pointer bg-teal-500 text-white p-2 rounded-full shadow hover:bg-teal-600">
              ✎
              <input type="file" hidden accept="image/*" onChange={handleProfileUpload} />
            </label>
          </div>
          <p className="text-sm text-gray-500">
            Square image works best. Face centered. Clean background.
          </p>
        </div>
      </div>

      {/* GALLERY HEADER */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <label className={labelClass}>Gallery (Max 5)</label>
          <p className="text-xs text-gray-400">Videos must be .mp4 and under 60 seconds</p>
        </div>
        <label className="cursor-pointer rounded-lg bg-teal-500 px-4 py-2 text-white hover:bg-teal-600">
          + Upload
          <input
            type="file"
            hidden
            multiple
            accept="image/*,video/mp4"
            onChange={handleGalleryUpload}
          />
        </label>
      </div>

      {mediaError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {mediaError}
        </p>
      )}

      {/* GALLERY GRID */}
      {gallery_meta.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {gallery_meta.map((item, index) => {
            const currentFile = data.images[index];
            const isVideo = isVideoItem(currentFile);
            const thumbPreview = videoThumbPreviews[item.id];

            return (
              <div
                key={item.id}
                className="border rounded-xl p-3 space-y-2 bg-gray-50"
              >
                {/* Media preview */}
                <div className="relative">
                  {isVideo ? (
                    thumbPreview ? (
                      <div className="relative h-32 w-full rounded-lg overflow-hidden">
                        <img
                          src={thumbPreview}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <svg
                            className="w-10 h-10 text-white opacity-90"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                          Video
                        </span>
                      </div>
                    ) : (
                      <div className="h-32 w-full rounded-lg bg-gray-900 flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-white opacity-70"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
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
                      className="h-32 w-full object-cover rounded-lg"
                    />
                  )}

                  {item.is_thumbnail && (
                    <span className="absolute top-1 left-1 bg-teal-500 text-white text-xs px-2 py-0.5 rounded">
                      Thumbnail
                    </span>
                  )}
                </div>

                {/* Caption */}
                <input
                  value={item.caption}
                  onChange={(e) => updateCaption(item.id, e.target.value)}
                  placeholder="Caption"
                  className="w-full border rounded px-2 py-1 text-sm"
                />

                {/* Video thumbnail upload */}
                {isVideo && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Video thumbnail</p>

                    {thumbPreview ? (
                      <div className="relative">
                        <img
                          src={thumbPreview}
                          className="h-16 w-full object-cover rounded-lg"
                        />
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
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
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
                <div className="flex justify-between text-xs">
                  {!item.is_thumbnail && (
                    <button
                      onClick={() => setThumbnail(item.id)}
                      className="text-teal-600 hover:underline"
                    >
                      Make Thumbnail
                    </button>
                  )}
                  <button
                    onClick={() => removeMedia(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">No media uploaded</p>
      )}

      {/* CROP MODAL — shared by profile photo, gallery photos, and video thumbnails */}
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
                aspect={cropAspect}
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
              <button
                onClick={cancelCrop}
                className="flex-1 border rounded py-2"
              >
                Cancel
              </button>
              <button
                onClick={applyCrop}
                className="flex-1 bg-teal-500 text-white rounded py-2 hover:bg-teal-600"
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