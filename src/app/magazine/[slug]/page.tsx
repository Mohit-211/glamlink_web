import { issues2025, issues2026 } from "@/data/issues";

export default function IssuePage({
  params,
}: {
  params: { slug: string };
}) {
  const issue = [...issues2026, ...issues2025].find(
    (i) => i.slug === params.slug
  );

  if (!issue) {
    return <div className="p-10">Issue not found</div>;
  }

  return (
    <section className="py-16">
      <div className="container-glamlink max-w-4xl">

        <h1 className="text-3xl font-serif mb-2">
          {issue.title}
        </h1>

        <p className="text-muted-foreground mb-8">
          {/* {issue.month} {issue.year} */}
        </p>

        <img
          src={issue.cover}
          alt={issue.title}
          className="rounded-xl mb-10"
        />

      </div>
    </section>
  );
}
