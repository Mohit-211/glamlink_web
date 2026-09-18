import { getBusinessProfile } from "@/api/Api";

/**
 * Public-facing professional row for the Directory. The raw
 * `businessCard/getAllProfiles` row (see usage in
 * src/components/professionals/ProfessionalsMarketplace.tsx) is already a
 * public listing (not a raw account record like the Topics `professionals`
 * relation), but this still allowlists fields explicitly so the Directory
 * only ever depends on what it actually renders.
 */
export interface DirectoryProfessional {
  id: number;
  name: string;
  professional_title?: string;
  profile_image?: string;
  specialty?: string;
  instagram?: string;
  is_founder?: boolean;
  locations?: { city?: string; state?: string }[];
  business_card_link?: string;
}

interface RawDirectoryProfessional {
  id: number;
  name?: string;
  professional_title?: string;
  profile_image?: string;
  specialty?: string;
  instagram?: string;
  is_founder?: boolean;
  locations?: { city?: string; state?: string }[];
  business_card_link?: string;
}

function toSafeDirectoryProfessional(
  raw: RawDirectoryProfessional
): DirectoryProfessional {
  return {
    id: raw.id,
    name: raw.name || "Glamlink Professional",
    professional_title: raw.professional_title,
    profile_image: raw.profile_image,
    specialty: raw.specialty,
    instagram: raw.instagram,
    is_founder: raw.is_founder,
    locations: raw.locations,
    business_card_link: raw.business_card_link,
  };
}

export async function getDirectoryProfessionals(): Promise<
  DirectoryProfessional[]
> {
  try {
    const res = await getBusinessProfile();
    const rows: RawDirectoryProfessional[] = Array.isArray(res?.data)
      ? res.data
      : [];
    return rows.map(toSafeDirectoryProfessional);
  } catch (error) {
    console.error("Failed to load directory professionals:", error);
    return [];
  }
}

export function getProfessionalLocation(
  professional: Pick<DirectoryProfessional, "locations">
): string {
  const location = professional.locations?.[0];
  return [location?.city, location?.state].filter(Boolean).join(", ");
}
