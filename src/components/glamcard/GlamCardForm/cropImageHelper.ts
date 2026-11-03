import { TOKENS } from "@/lib/designTokens";

/** The longest side a card photo is saved at: sharp on the card and its page, at a fraction of a phone photo's size. */
const MAX_SIDE = 1600;
const JPEG_QUALITY = 0.86;

export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * The cropped part of a photo as a JPEG at most MAX_SIDE pixels on its longest side. It used to be a PNG at the
 * photo's full size: a phone photo became 10 to 20 MB, and a card with five of them took minutes to send (Nov 4).
 */
export default function getCroppedImg(imageSrc: string, pixelCrop: PixelCrop): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const scale = Math.min(1, MAX_SIDE / Math.max(pixelCrop.width, pixelCrop.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(pixelCrop.width * scale);
      canvas.height = Math.round(pixelCrop.height * scale);
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject("Canvas context not found");

      // JPEG has no transparency: a see-through PNG gets a white background, as the card shows it on white
      ctx.fillStyle = TOKENS.card;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Failed to crop image");
          resolve(new File([blob], "photo.jpg", { type: "image/jpeg" }));
        },
        "image/jpeg",
        JPEG_QUALITY
      );
    };
    image.onerror = (error) => reject(error);
  });
}
