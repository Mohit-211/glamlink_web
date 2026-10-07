import type { PartnershipWay } from "./partnerContent";

export default function PartnershipCard({ way, index }: { way: PartnershipWay; index: number }) {
  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-soft">
        <img
          src={way.image}
          alt={way.imageAlt}
          loading="lazy"
          style={{ objectPosition: way.imagePosition }}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <span className="text-xs font-semibold tracking-[0.2em] text-primary">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-display mt-2 text-2xl font-semibold leading-tight text-foreground">
          {way.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{way.description}</p>
      </div>
    </article>
  );
}
