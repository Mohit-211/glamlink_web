export default function SectionHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2 className="section-title font-display mb-6">
      {children}
    </h2>
  );
}
