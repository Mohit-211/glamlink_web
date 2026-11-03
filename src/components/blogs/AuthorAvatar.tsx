import ApiImage from "@/components/common/ApiImage";
import { cn } from "@/lib/utils";

/** A Journal author's round photo (cropped round in the admin panel), else the first letter of their name. */
export default function AuthorAvatar({
  name,
  image,
  size,
  className,
}: {
  name?: string | null;
  image?: string | null;
  /** The circle's width in pixels, for the image request. */
  size: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex-shrink-0 overflow-hidden rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium",
        className
      )}
      style={{ width: size, height: size }}
    >
      {image ? (
        <ApiImage src={image} alt="" fill sizes={`${size}px`} className="object-cover" />
      ) : (
        (name?.trim().charAt(0) || "A").toUpperCase()
      )}
    </div>
  );
}
