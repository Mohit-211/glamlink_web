export default function SectionHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2 className="font-serif text-2xl md:text-3xl text-gray-900 mb-6 leading-snug">
      {children}
    </h2>
  );
}
