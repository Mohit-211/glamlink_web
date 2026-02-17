"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import Cropper from "react-easy-crop";
import Modal from "./GlamCardForm/Modal";
import { GalleryMetaItem, GlamCardFormData } from "./GlamCardForm/types";
import getCroppedImg from "./GlamCardForm/cropImageHelper";

/* ================= TYPES ================= */

interface Props {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
}

/* ================= STYLES ================= */

const sectionClass =
  "space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm";
const labelClass = "text-sm font-medium text-gray-700";

/* ================= COMPONENT ================= */

const MediaAndProfileForm: React.FC<Props> = ({ data, setData }) => {
  /* ================= PROFILE IMAGE ================= */

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  /* Generate preview safely */
  useEffect(() => {
    if (data.profile_image instanceof File) {
      const url = URL.createObjectURL(data.profile_image);
      setProfilePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [data.profile_image]);

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

    setData((prev) => ({
      ...prev,
      profile_image: croppedFile,
    }));

    setIsCropOpen(false);
  };

  /* ================= GALLERY ================= */

  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);
  const gallery_meta: GalleryMetaItem[] = data.gallery_meta || [];

  /* Sync previews when images change */
  useEffect(() => {
    const urls = data.images.map((file) => URL.createObjectURL(file));
    setGalleryPreview(urls);

    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [data.images]);

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

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

  const removeMedia = (id: string) => {
    setData((prev) => {
      const index = prev.gallery_meta.findIndex((m) => m.id === id);
      if (index === -1) return prev;

      const updatedImages = prev.images.filter((_, i) => i !== index);
      let updatedMeta = prev.gallery_meta.filter((m) => m.id !== id);

      if (updatedMeta.length && !updatedMeta.some((m) => m.is_thumbnail)) {
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
                <img
                  src={profilePreview}
                  className="w-full h-full object-cover"
                />
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
      </div>

      {/* GALLERY HEADER */}
      <div className="flex justify-between items-center pt-2">
        <label className={labelClass}>Gallery (Max 5)</label>

        <label className="cursor-pointer rounded-lg bg-teal-500 px-4 py-2 text-white hover:bg-teal-600">
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

      {/* GALLERY GRID */}
      {gallery_meta.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {gallery_meta.map((item, index) => (
            <div
              key={item.id}
              className="border rounded-xl p-3 space-y-2 bg-gray-50"
            >
              <div className="relative">
                <img
                  src={galleryPreview[index]}
                  className="h-32 w-full object-cover rounded-lg"
                />

                {item.is_thumbnail && (
                  <span className="absolute top-1 left-1 bg-teal-500 text-white text-xs px-2 py-0.5 rounded">
                    Thumbnail
                  </span>
                )}
              </div>

              <input
                value={item.caption}
                onChange={(e) => updateCaption(item.id, e.target.value)}
                placeholder="Caption"
                className="w-full border rounded px-2 py-1 text-sm"
              />

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
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">No media uploaded</p>
      )}

      {/* CROP MODAL */}
      {isCropOpen && (
        <Modal onClose={() => setIsCropOpen(false)}>
          <div className="w-[90vw] max-w-md space-y-4">
            <div className="relative h-80 bg-black rounded overflow-hidden">
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
                onClick={() => setIsCropOpen(false)}
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
