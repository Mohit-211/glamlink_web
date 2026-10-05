"use client";

import { BadgeCheck, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { getProfessionalType, type DirectoryBusiness } from "@/lib/directory";
import { directoryThemeStyle } from "./directoryTheme";

interface ClaimProfileModalProps {
  business: DirectoryBusiness | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (business: DirectoryBusiness) => void;
}

export default function ClaimProfileModal({ business, onOpenChange, onConfirm }: ClaimProfileModalProps) {
  return (
    <Dialog open={!!business} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md rounded-3xl p-0 overflow-hidden gap-0"
        style={directoryThemeStyle}
      >
        {business && (
          <>
            <div className="relative h-32 bg-muted">
              <img src={business.imageUrl} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-5 right-12 text-white">
                <p className="font-semibold leading-tight truncate">{business.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-white/85">
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  {getProfessionalType(business.professionalType)?.label} · {business.city},{" "}
                  {business.state}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BadgeCheck className="w-7 h-7" aria-hidden="true" />
              </span>
              <DialogTitle className="font-display mt-5 text-2xl sm:text-3xl font-semibold">
                Is this your business?
              </DialogTitle>
              <DialogDescription className="mt-3 text-muted-foreground">
                Claim your profile and start building your Glamlink presence.
              </DialogDescription>

              <button
                type="button"
                onClick={() => onConfirm(business)}
                className="btn-primary mt-7 w-full py-3.5"
              >
                <BadgeCheck className="w-4 h-4" aria-hidden="true" />
                Claim This Profile
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="mt-3 w-full rounded-full py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Not now
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
