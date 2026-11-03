"use client";

import ShareButton from "@/components/common/ShareButton";

interface ShareProductButtonProps {
  url: string;
  title: string;
}

/** The Share button of articles and products: the share sheet, else a copied link. */
const ShareProductButton = ({ url, title }: ShareProductButtonProps) => (
  <ShareButton url={url} title={title} className="btn-outline rounded-full px-5 py-2.5 text-sm font-medium" />
);

export default ShareProductButton;
