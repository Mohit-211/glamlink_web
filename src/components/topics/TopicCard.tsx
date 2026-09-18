import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Topic, getTopicImage, getTopicSummary } from "@/lib/topics";

interface TopicCardProps {
  topic: Topic;
  compact?: boolean;
}

const TopicCard = ({ topic, compact = false }: TopicCardProps) => {
  const href = `/topics/${topic.slug || topic.id}`;
  const blurb = getTopicSummary(topic);

  return (
    <Link
      href={href}
      className="group flex flex-col h-full bg-white rounded-[1.5rem] overflow-hidden border border-gray-100
        hover:border-transparent hover:shadow-[0_20px_45px_-15px_rgba(35,174,184,0.35)] hover:-translate-y-1
        transition-all duration-300"
    >
      <div
        className={`relative w-full overflow-hidden flex-shrink-0 ${
          compact ? "aspect-[16/10]" : "aspect-[16/9]"
        }`}
      >
        <Image
          unoptimized={process.env.NODE_ENV === "development"}
          src={getTopicImage(topic)}
          alt={topic.name}
          fill
          className="object-cover group-hover:scale-[1.06] transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-serif text-white text-xl leading-snug drop-shadow-sm">
            {topic.name}
          </h3>
        </div>
      </div>

      {!compact && (
        <div className="flex flex-col flex-1 p-5">
          <p className="text-[13px] leading-relaxed text-gray-500 font-light line-clamp-2 flex-1">
            {blurb}
          </p>
          <div className="flex items-center gap-1.5 pt-4 mt-4 border-t border-gray-100 text-[12px] font-medium text-[#23AEB8] group-hover:gap-2.5 transition-all duration-200">
            Explore topic
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>
      )}
    </Link>
  );
};

export default TopicCard;
