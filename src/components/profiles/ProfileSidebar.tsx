import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  ChevronDown,
  CreditCard,
  ExternalLink,
  GraduationCap,
  Mail,
  MessageCircle,
  Mic,
  Newspaper,
  Phone,
  Play,
  Tag,
  Truck,
  type LucideIcon,
} from "lucide-react";
import ApiImage from "@/components/common/ApiImage";
import type { ProfileDetail } from "@/lib/api/types";
import { formatDate, formatDuration } from "@/lib/format";
import { articleHref, issueHref, videoHref } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { BlockHeading, viewAll, type PanelAction } from "./ProfilePanel";
import { accessCardHref, telHref, type ProfileView } from "./profileData";
import { trackAs } from "./profileEvents";
import { PROFILE_SECTIONS, profileSectionHref } from "./profileSections";

const ROLE_LABEL = { cover: "On the cover", featured: "Featured", mentioned: "Mentioned" } as const;

/** A sidebar item: a square picture beside its kicker, title, details and call to action. */
function SideCard({
  href,
  track,
  image,
  imageClassName = "h-28 w-28",
  play = false,
  kicker,
  title,
  meta,
  cta,
}: {
  href: string;
  track: Record<string, string>;
  image: string | null;
  imageClassName?: string;
  play?: boolean;
  kicker?: string | null;
  title: string;
  meta?: string;
  cta: string;
}) {
  return (
    <Link href={href} className="group flex gap-4" {...track}>
      <div className={cn("relative shrink-0 overflow-hidden rounded-2xl bg-muted", imageClassName)}>
        <ApiImage
          src={image}
          alt=""
          fill
          sizes="112px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {play && (
          <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-card/95 text-primary shadow-soft transition-colors group-hover:bg-secondary group-hover:text-primary-foreground">
              <Play className="ml-0.5 h-4 w-4 fill-current" />
            </span>
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        {kicker && <p className="eyebrow mb-1 truncate">{kicker}</p>}
        <h3 className="line-clamp-3 text-base font-semibold leading-snug transition-colors group-hover:text-secondary">
          {title}
        </h3>
        {meta && <p className="mt-1 text-xs text-muted-foreground">{meta}</p>}
        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary transition-colors group-hover:text-secondary">
          {cta}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

/**
 * A sidebar block: its heading, one item, and "View all" under the item (the
 * column is too narrow for a long heading and the link side by side).
 */
function SideBlock({
  id,
  title,
  more,
  children,
}: {
  id: string;
  title: string;
  more: PanelAction | null;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id}>
      <BlockHeading id={id} title={title} />
      {children}
      {more && (
        <Link href={more.href} className="link-glamlink mt-4 inline-flex items-center gap-1 text-sm">
          {more.label}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </section>
  );
}

/** "View all <things>" when a list has more than the one item shown. */
const moreLink = (count: number, things: string, href: string): PanelAction | null =>
  viewAll(count, 1, href) && { label: `View all ${things}`, href };

const button = (primary: boolean) => cn(primary ? "btn-primary" : "btn-outline", "w-full");

/** The page's ways in touch: website, contact (email and phone), Access card and booking. The first is filled. */
function Actions({ profile, view }: { profile: ProfileDetail; view: ProfileView }) {
  const cardHref = accessCardHref(profile);
  const contact = Boolean(profile.email || profile.phone);
  const actions: ReactNode[] = [];

  if (view.website) {
    actions.push(
      <a
        key="website"
        href={view.website}
        target="_blank"
        rel="noopener noreferrer"
        className={button(actions.length === 0)}
        {...trackAs("WEBSITE_CLICK", view.website)}
      >
        Visit Website
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    );
  }
  if (contact) {
    actions.push(
      <details key="contact" className="group">
        <summary className={cn(button(actions.length === 0), "list-none [&::-webkit-details-marker]:hidden")}>
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          {profile.type === "brand" ? "Contact Brand" : "Contact"}
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <ul className="mt-3 space-y-2.5 rounded-2xl border border-border bg-card p-4 text-sm">
          {profile.email && (
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <a href={`mailto:${profile.email}`} className="link-glamlink break-all" {...trackAs("EMAIL_CLICK")}>
                {profile.email}
              </a>
            </li>
          )}
          {profile.phone && (
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <a href={telHref(profile.phone)} className="link-glamlink" {...trackAs("PHONE_CLICK")}>
                {profile.phone}
              </a>
            </li>
          )}
        </ul>
      </details>
    );
  }
  if (cardHref) {
    actions.push(
      <Link key="card" href={cardHref} className={button(actions.length === 0)} {...trackAs("ACCESS_CARD_CLICK")}>
        <CreditCard className="h-4 w-4" aria-hidden="true" />
        View Access card
      </Link>
    );
  }
  if (view.bookingLink) {
    actions.push(
      <a
        key="booking"
        href={view.bookingLink}
        target="_blank"
        rel="noopener noreferrer"
        className={button(actions.length === 0)}
        {...trackAs("BOOKING_CLICK")}
      >
        <CalendarCheck className="h-4 w-4" aria-hidden="true" />
        Book now
      </a>
    );
  }

  return actions.length > 0 ? <div className="grid gap-3">{actions}</div> : null;
}

export default function ProfileSidebar({ profile, view }: { profile: ProfileDetail; view: ProfileView }) {
  const lines: { icon: LucideIcon; text: string }[] = [];
  if (view.category) lines.push({ icon: Tag, text: view.category });
  if (view.shipping) lines.push({ icon: Truck, text: view.shipping });
  if (view.quick.has_education) lines.push({ icon: GraduationCap, text: "Educational resources" });
  if (view.quick.on_podcast) lines.push({ icon: Mic, text: "Featured on The Beauty Vault" });
  if (view.quick.in_journal) lines.push({ icon: Newspaper, text: "Featured in the Glamlink Journal" });

  const hasActions = Boolean(
    view.website || profile.email || profile.phone || accessCardHref(profile) || view.bookingLink
  );
  const episode = view.podcast.rows[0];
  const article = view.journal.rows[0];
  const issue = view.magazine.rows[0];
  const video = view.otherVideos[0];
  const slug = profile.slug;

  return (
    <aside aria-label={`More from ${profile.name}`} className="min-w-0 space-y-10">
      {(lines.length > 0 || hasActions) && (
        <div className="space-y-6 rounded-3xl bg-muted/60 p-6">
          {lines.length > 0 && (
            <section aria-labelledby="profile-quick-heading">
              <BlockHeading id="profile-quick-heading" title="Quick Info" />
              <ul className="space-y-3 text-base">
                {lines.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3">
                    <Icon className="h-4.5 w-4.5 shrink-0 text-secondary" aria-hidden="true" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {hasActions && <Actions profile={profile} view={view} />}
        </div>
      )}

      {episode && (
        <SideBlock
          id="profile-podcast-heading"
          title={PROFILE_SECTIONS.podcast.title}
          more={moreLink(view.podcast.count, "episodes", profileSectionHref(slug, "podcast"))}
        >
          <SideCard
            href={videoHref(episode)}
            track={trackAs("PODCAST_CLICK", episode.slug)}
            image={episode.thumbnail}
            play
            title={episode.title}
            meta={[formatDate(episode.published_at), formatDuration(episode.duration_seconds)].filter(Boolean).join(" · ")}
            cta="Watch Episode"
          />
        </SideBlock>
      )}

      {article && (
        <SideBlock
          id="profile-journal-heading"
          title={PROFILE_SECTIONS.articles.title}
          more={moreLink(view.journal.count, "articles", profileSectionHref(slug, "articles"))}
        >
          <SideCard
            href={articleHref(article)}
            track={trackAs("JOURNAL_CLICK", article.id)}
            image={article.cover_image}
            kicker={article.journal_category?.title}
            title={article.title}
            cta="Read the Article"
          />
        </SideBlock>
      )}

      {issue && (
        <SideBlock
          id="profile-magazine-heading"
          title={PROFILE_SECTIONS.magazine.title}
          more={moreLink(view.magazine.count, "issues", profileSectionHref(slug, "magazine"))}
        >
          <SideCard
            href={issueHref(issue.slug)}
            track={{}}
            image={issue.cover_image}
            imageClassName="aspect-3/4 w-24"
            kicker={issue.role ? ROLE_LABEL[issue.role] : null}
            title={issue.title}
            meta={issue.role && issue.page_number ? `Page ${issue.page_number}` : formatDate(issue.publish_date)}
            cta="Read the Issue"
          />
        </SideBlock>
      )}

      {video && (
        <SideBlock
          id="profile-videos-heading"
          title={PROFILE_SECTIONS.videos.title}
          more={moreLink(view.videos.count, "videos", profileSectionHref(slug, "videos"))}
        >
          <SideCard
            href={videoHref(video)}
            track={{}}
            image={video.thumbnail}
            play
            kicker={video.series?.name}
            title={video.title}
            meta={formatDuration(video.duration_seconds)}
            cta="Watch"
          />
        </SideBlock>
      )}
    </aside>
  );
}
