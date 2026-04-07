interface FeatureCardProps {
  price: string;
  priceNote?: string;
  title: string;
  description: string;
  items: string[];
  badge?: string;
  featured?: boolean;
}

export default function FeatureCard({
  price,
  priceNote,
  title,
  description,
  items,
  badge,
  featured,
}: FeatureCardProps) {
  return (
    <div
      className={`relative rounded-2xl border p-6 transition ${
        featured ? "border-primary bg-primary/5" : "border-border bg-card"
      }`}
    >
      {badge && (
        <span className="absolute top-0 right-4 bg-primary text-white text-[10px] px-2 py-1 rounded-b">
          {badge}
        </span>
      )}

      <p className="text-2xl font-semibold text-primary">{price}</p>

      {priceNote && (
        <p className="text-xs text-muted-foreground">{priceNote}</p>
      )}

      <h3 className="text-sm font-medium mt-2">{title}</h3>

      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((item, i) => (
          <li key={i}>→ {item}</li>
        ))}
      </ul>
    </div>
  );
}
