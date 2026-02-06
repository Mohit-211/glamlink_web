"use client";
import React, { useState, useCallback } from "react";
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

    const croppedImage = await getCroppedImg(
      imageSrc,
      croppedAreaPixels
    );

    setData(prev => ({
      ...prev,
      profileImage: croppedImage,
    }));

    setIsCropOpen(false);
  };

  /* ================= GALLERY ================= */

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const uploads: GalleryMetaItem[] = [];
    const existingCount = gallery_meta.length;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        uploads.push({
          id: crypto.randomUUID(),
          src: reader.result as string,
          caption: "",
          is_thumbnail: false,
          sort_order: existingCount + uploads.length + 1,
        });

        if (uploads.length === files.length) {
          setData(prev => {
            let merged = [...prev.gallery_meta, ...uploads].slice(0, 5);

            // Ensure exactly one thumbnail
            if (!merged.some(i => i.is_thumbnail)) {
              merged = merged.map((i, idx) => ({
                ...i,
                is_thumbnail: idx === 0,
              }));
            }

            return { ...prev, gallery_meta: merged };
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (id: string) => {
    setData(prev => {
      let filtered = prev.gallery_meta.filter(m => m.id !== id);

      if (filtered.length && !filtered.some(m => m.is_thumbnail)) {
        filtered = filtered.map((m, i) => ({
          ...m,
          is_thumbnail: i === 0,
        }));
      }

      return { ...prev, gallery_meta: filtered };
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

  /* ================= RENDER ================= */

  return (
    <section className={sectionClass}>
      <h2 className="text-lg font-semibold">Media & Profile</h2>

      {/* PROFILE IMAGE */}
      <label className={labelClass}>Profile Image</label>
      <label className="inline-flex cursor-pointer rounded-full bg-teal-500 px-4 py-2 text-white">
        Choose file
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleProfileUpload}
        />
      </label>

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
        gallery_meta.map(item => (
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
              src={item.src}
              className="h-48 w-full object-contain rounded"
            />

            <input
              value={item.caption || ""}
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
          <Cropper
            image={imageSrc!}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
          <button
            onClick={applyCrop}
            className="mt-4 w-full rounded bg-teal-500 py-2 text-white"
          >
            Apply
          </button>
        </Modal>
      )}
    </section>
  );
};

export default MediaAndProfileForm;
