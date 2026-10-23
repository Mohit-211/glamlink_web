export default function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="eyebrow mb-2">
      {children}
    </p>
  );
}
