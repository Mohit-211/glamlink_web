import { Mic } from "lucide-react";

interface PodcastGuestCardProps {
  name: string;
  role: string;
  date?: string;
  index?: number;
}

const getInitials = (name: string) =>
  name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

const formatDate = (date?: string) => {
  if (!date) return "";
  const parsed = new Date(`${date}T00:00:00`);
  if (isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const PodcastGuestCard = ({ name, role, date, index = 0 }: PodcastGuestCardProps) => {
  const formattedDate = formatDate(date);

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border p-5 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground"
        >
          {getInitials(name)}
        </div>
        <span className="flex items-center gap-1 text-[10px] font-medium tracking-wide uppercase text-muted-foreground/80">
          <Mic className="h-3 w-3" />
          Podcast
        </span>
      </div>
      <h3 className="text-foreground text-[15px] leading-snug">{name}</h3>
      <p className="text-[12px] text-muted-foreground font-normal mt-1 flex-1">{role}</p>
      {formattedDate && (
        <p className="text-[11px] text-muted-foreground/80 mt-3 pt-3 border-t border-border">
          Episode airing {formattedDate}
        </p>
      )}
    </div>
  );
};

export default PodcastGuestCard;
