import { Mic } from "lucide-react";

interface PodcastGuestCardProps {
  name: string;
  role: string;
  date?: string;
  index?: number;
}

const PALETTES = [
<<<<<<< HEAD
  { bg: "rgba(36,187,203,0.12)", text: "#1d8b93" },
=======
  { bg: "rgba(35,174,184,0.12)", text: "#1d8b93" },
>>>>>>> 30a95675f69487a1ecbe33c4b72d31fa8e1de320
  { bg: "rgba(147,51,234,0.10)", text: "#7e22ce" },
  { bg: "rgba(217,119,6,0.10)", text: "#b45309" },
  { bg: "rgba(219,39,119,0.10)", text: "#be185d" },
];

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
  const palette = PALETTES[index % PALETTES.length];
  const formattedDate = formatDate(date);

  return (
<<<<<<< HEAD
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#24bbcb]/40 hover:shadow-lg transition-all duration-300">
=======
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#23AEB8]/40 hover:shadow-lg transition-all duration-300">
>>>>>>> 30a95675f69487a1ecbe33c4b72d31fa8e1de320
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
          style={{ background: palette.bg, color: palette.text }}
        >
          {getInitials(name)}
        </div>
        <span className="flex items-center gap-1 text-[10px] font-medium tracking-wide uppercase text-gray-400">
          <Mic className="h-3 w-3" />
          Podcast
        </span>
      </div>
      <h3 className="font-serif text-gray-900 text-[15px] leading-snug">{name}</h3>
      <p className="text-[12px] text-gray-500 font-light mt-1 flex-1">{role}</p>
      {formattedDate && (
        <p className="text-[11px] text-gray-400 mt-3 pt-3 border-t border-gray-100">
          Episode airing {formattedDate}
        </p>
      )}
    </div>
  );
};

export default PodcastGuestCard;
