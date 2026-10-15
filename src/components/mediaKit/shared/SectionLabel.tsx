export default function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="text-[10px] tracking-[.15em] uppercase text-muted-foreground/80 mb-2">
      {children}
    </p>
  );
}
