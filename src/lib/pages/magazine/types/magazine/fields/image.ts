// Image type that supports both string URLs and objects with crop data
export type ImageFieldType = string | {
  url: string;
  originalUrl?: string;
  cropData?: any;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPositionX?: number;
  objectPositionY?: number;
};