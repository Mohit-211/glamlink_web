import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { resolveCompany, getCompanyRelatedArticles, getCompanyCategoryLabel } from "@/lib/companies";
import CompanyProfileHeader from "@/components/directory/CompanyProfileHeader";
import CompanyInformation from "@/components/directory/CompanyInformation";
import CompanyLinks from "@/components/directory/CompanyLinks";
import CompanyRelatedArticles from "@/components/directory/CompanyRelatedArticles";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const company = await resolveCompany(id);

  if (!company) {
    return { title: "Company Not Found | Glamlink" };
  }

  const companyUrl = `https://glamlink.net/directory/company/${company.id}`;
  const description =
    company.description || `${getCompanyCategoryLabel(company)} on the Glamlink Directory.`;

  return {
    title: `${company.name} | Glamlink Directory`,
    description,
    alternates: { canonical: companyUrl },
    openGraph: {
      title: `${company.name} | Glamlink Directory`,
      description,
      url: companyUrl,
      type: "website",
      ...(company.logo ? { images: [{ url: company.logo }] } : {}),
    },
  };
}

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = await resolveCompany(id);

  if (!company) {
    notFound();
  }

  const relatedArticles = await getCompanyRelatedArticles(company);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 pb-16">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6 pt-28">
          <Link
            href="/journal/directory"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-[#24bbcb] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Directory
          </Link>
        </div>

        <CompanyProfileHeader company={company} />
        <CompanyInformation company={company} />
        <CompanyLinks company={company} />
        <CompanyRelatedArticles articles={relatedArticles} companyName={company.name} />

        <div className="max-w-[1100px] mx-auto px-5 sm:px-6 pt-4">
          <Link
            href="/journal/directory"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-[#24bbcb] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Directory
          </Link>
        </div>
      </main>
    </div>
  );
}
