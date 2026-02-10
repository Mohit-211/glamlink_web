"use client";

import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import Modal from "./Modal";
import getCroppedImg from "./cropImageHelper";
import { GalleryMetaItem, GlamCardFormData } from "./types";

/* ================= TYPES ================= */

interface Props {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
}

/* ================= STYLES ================= */

const sectionClass =
  "space-y-6 rounded-xl border border-gray-200 bg-white p-6";
const labelClass = "text-sm font-medium text-gray-700";

/* ================= COMPONENT ================= */

const MediaAndProfileForm: React.FC<Props> = ({ data, setData }) => {
  /* ===== PROFILE IMAGE CROP ===== */
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  /* ===== GALLERY PREVIEW (UI ONLY) ===== */
  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);

  const gallery_meta: GalleryMetaItem[] = data.gallery_meta || [];

  /* ================= CROP ================= */

  const onCropComplete = useCallback((_: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setIsCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const applyCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);

    setData(prev => ({
      ...prev,
      profile_image: croppedFile, // ✅ single profile image
    }));

    setIsCropOpen(false);
  };

  /* ================= GALLERY ================= */

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    // UI previews
    setGalleryPreview(prev => [
      ...prev,
      ...fileArray.map(file => URL.createObjectURL(file)),
    ]);

    setData(prev => {
      const existingImages = prev.images || [];

      const newFiles = fileArray.slice(
        0,
        5 - existingImages.length
      );

      const newMeta: GalleryMetaItem[] = newFiles.map((_, index) => ({
        id: crypto.randomUUID(),
        caption: "",
        is_thumbnail: false,
        sort_order: existingImages.length + index + 1,
      }));

      let mergedMeta = [...(prev.gallery_meta || []), ...newMeta];

      if (!mergedMeta.some(m => m.is_thumbnail)) {
        mergedMeta[0].is_thumbnail = true;
      }

      return {
        ...prev,
        images: [...existingImages, ...newFiles],
        gallery_meta: mergedMeta,
      };
    });
  };

  const removeMedia = (id: string) => {
    setData(prev => {
      const index = prev.gallery_meta.findIndex(m => m.id === id);

      setGalleryPreview(p => p.filter((_, i) => i !== index));

      const updatedImages = prev.images.filter((_, i) => i !== index);
      let updatedMeta = prev.gallery_meta.filter(m => m.id !== id);

      if (updatedMeta.length && !updatedMeta.some(m => m.is_thumbnail)) {
        updatedMeta[0].is_thumbnail = true;
      }

      return {
        ...prev,
        images: updatedImages,
        gallery_meta: updatedMeta,
      };
    });
  };

  const setThumbnail = (id: string) => {
    setData(prev => ({
      ...prev,
      gallery_meta: prev.gallery_meta.map(m => ({
        ...m,
        is_thumbnail: m.id === id,
      })),
    }));
  };

  const updateCaption = (id: string, caption: string) => {
    setData(prev => ({
      ...prev,
      gallery_meta: prev.gallery_meta.map(m =>
        m.id === id ? { ...m, caption } : m
      ),
    }));
  };

  /* ================= CLEANUP ================= */

  useEffect(() => {
    return () => {
      galleryPreview.forEach(url => URL.revokeObjectURL(url));
    };
  }, [galleryPreview]);

  /* ================= RENDER ================= */

  return (
    <section className={sectionClass}>
      <h2 className="text-lg font-semibold">Media & Profile</h2>

      {/* PROFILE IMAGE */}
      <div className="space-y-2">
        <label className={labelClass}>Profile Image</label>

        <div className="relative w-32 h-32">
          <div className="w-32 h-32 rounded-full border border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50">
            {data?.profile_image ? (
              <img
                src={URL.createObjectURL(data.profile_image)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm text-center px-4">
                Upload<br />Profile Image
              </span>
            )}
          </div>

          <label className="absolute bottom-0 right-0 cursor-pointer bg-teal-500 text-white p-2 rounded-full shadow-md hover:bg-teal-600">
            🔄
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleProfileUpload}
            />
          </label>
        </div>
      </div>

      {/* GALLERY */}
      <div className="flex justify-between items-center">
        <label className={labelClass}>Gallery & Portfolio</label>
        <label className="cursor-pointer rounded-lg bg-teal-500 px-4 py-2 text-white">
          + Upload
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleGalleryUpload}
          />
        </label>
      </div>

      {gallery_meta.length ? (
        gallery_meta.map((item, index) => (
          <div key={item.id} className="rounded-xl border p-4 space-y-4">
            <div className="flex justify-between">
              {item.is_thumbnail && (
                <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded">
                  Thumbnail
                </span>
              )}
              <button
                onClick={() => removeMedia(item.id)}
                className="text-red-600"
              >
                Remove
              </button>
            </div>

            <img
              src={galleryPreview[index]}
              className="h-48 w-full object-contain rounded"
            />

            <input
              value={item.caption}
              onChange={e =>
                updateCaption(item.id, e.target.value)
              }
              placeholder="Caption"
              className="w-full border rounded px-3 py-2"
            />

            {!item.is_thumbnail && (
              <button
                onClick={() => setThumbnail(item.id)}
                className="text-teal-600"
              >
                Set as Thumbnail
              </button>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-400">No media uploaded</p>
      )}

      {/* CROP MODAL */}
      {isCropOpen && (
        <Modal onClose={() => setIsCropOpen(false)}>
          <div className="w-[90vw] max-w-md">
            <div className="relative h-80 w-full bg-black rounded overflow-hidden">
              <Cropper
                image={imageSrc!}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-600">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setIsCropOpen(false)}
                className="flex-1 rounded border py-2"
              >
                Cancel
              </button>

              <button
                onClick={applyCrop}
                className="flex-1 rounded bg-teal-500 py-2 text-white"
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
