"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { LinkFieldType, getLinkUrl, getLinkAction } from "../../types/magazine/fields/linkAction";

// Dynamically import dialogs to avoid SSR issues
const ProDownloadDialog = dynamic(() => import("@/lib/components/modals/ProDownloadDialog"), { ssr: false });

const UserDownloadDialog = dynamic(() => import("@/lib/components/modals/UserDownloadDialog"), { ssr: false });

interface MagazineLinkProps {
  field: LinkFieldType | undefined | null;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

export default function MagazineLink({ field, children, className = "", target = "_blank", rel = "noopener noreferrer", onClick }: MagazineLinkProps) {
  const [showProDialog, setShowProDialog] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);

  const url = getLinkUrl(field);
  const action = getLinkAction(field);

  // For popup actions, we don't need a URL - they trigger dialogs
  // For regular links, we need a URL
  if (!url && action === "link") {
    return <>{children}</>;
  }

  // Handle click based on action type
  const handleClick = (e: React.MouseEvent) => {
    if (action === "pro-popup") {
      e.preventDefault();
      setShowProDialog(true);
    } else if (action === "user-popup") {
      e.preventDefault();
      setShowUserDialog(true);
    }

    // Call additional onClick handler if provided
    if (onClick) {
      onClick();
    }
  };

  // For popup actions, render as button styled as link
  if (action === "pro-popup" || action === "user-popup") {
    return (
      <>
        <button onClick={handleClick} className={`text-left ${className || ""}`} type="button">
          {children}
        </button>

        {showProDialog && <ProDownloadDialog isOpen={showProDialog} onClose={() => setShowProDialog(false)} />}

        {showUserDialog && <UserDownloadDialog isOpen={showUserDialog} onClose={() => setShowUserDialog(false)} />}
      </>
    );
  }

  // Default link behavior
  return (
    <Link href={url} target={target} rel={rel} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

// Inline link component for use within text
export function InlineMagazineLink({ field, text, className = "text-glamlink-teal hover:text-glamlink-purple transition-colors" }: { field: LinkFieldType | undefined | null; text: string; className?: string }) {
  return (
    <MagazineLink field={field} className={className}>
      {text}
    </MagazineLink>
  );
}
