import { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
}

const SectionHeader = ({ eyebrow, title, description }: SectionHeaderProps) => {
  return (
    <div className="text-center space-y-4">
      <p className="text-[11px] uppercase tracking-widest text-[#24bbcb] font-semibold">
        {eyebrow}
      </p>

      <h1 className="font-display text-2xl md:text-3xl tracking-tight">
        {title}
      </h1>

      <p className="text-sm text-muted-foreground max-w-lg mx-auto">
        {description}
      </p>
    </div>
  );
};

export default SectionHeader;
