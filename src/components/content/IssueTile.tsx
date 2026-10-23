import Link from "next/link";
import ApiImage from "@/components/common/ApiImage";
import { formatDate } from "@/lib/format";
import { issueHref } from "@/lib/routes";
import type { MagazineIssue, MagazineRole } from "@/lib/api/types";

const ROLE_LABEL: Record<MagazineRole, string> = {
  cover: "On the cover",
  featured: "Featured",
  mentioned: "Mentioned",
};

interface IssueTileProps {
  issue: MagazineIssue;
  /** The account's part in the issue, on profile pages. */
  role?: MagazineRole;
  pageNumber?: number | null;
}

/** A magazine issue: cover, title and date (or the account's part in it). */
export default function IssueTile({ issue, role, pageNumber }: IssueTileProps) {
  const date = formatDate(issue.publish_date);
  const note = role ? [ROLE_LABEL[role], pageNumber ? `page ${pageNumber}` : ""].filter(Boolean).join(", ") : date;

  return (
    <Link href={issueHref(issue.slug)} className="group flex flex-col">
      <div className="relative aspect-3/4 overflow-hidden rounded-xl border border-border bg-muted shadow-soft transition-shadow group-hover:shadow-medium">
        <ApiImage
          src={issue.cover_image}
          alt=""
          fill
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <h3 className="mt-3 text-sm font-semibold transition-colors group-hover:text-secondary">{issue.title}</h3>
      {note && <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>}
    </Link>
  );
}
