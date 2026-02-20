# Professional Features Plan

## Overview

Allow beauty professionals to control the visibility and display of their professional credentials, portfolio, pricing, and reviews on their public profile.

---

## Directory Structure

```
lib/features/profile-settings/professional/
├── types.ts
├── config.ts
├── components/
│   ├── ProfessionalSection.tsx      # Main section for settings page
│   ├── CertificationDisplay.tsx     # Certification visibility controls
│   ├── PortfolioPrivacy.tsx         # Before/after gallery privacy
│   ├── PricingVisibility.tsx        # Service pricing display options
│   └── ReviewsDisplay.tsx           # Reviews section configuration
├── hooks/
│   └── useProfessional.ts           # Fetch/update professional settings
└── index.ts
```

---

## Types

```typescript
// types.ts

export type PricingDisplay = 'public' | 'request_only' | 'range_only' | 'hidden';
export type PortfolioAccess = 'public' | 'clients_only' | 'private';
export type ReviewVisibility = 'all' | 'positive_only' | 'hidden';

export interface CertificationDisplaySettings {
  showCertifications: boolean;                  // Show certifications section
  showVerifiedBadge: boolean;                   // Show verified badge
  showCertificationDates: boolean;              // Show when certified
  showIssuingOrganization: boolean;             // Show who issued cert
  highlightedCertifications: string[];          // IDs of certs to feature
}

export interface PortfolioSettings {
  access: PortfolioAccess;
  showBeforeAfter: boolean;                     // Show before/after comparisons
  watermarkImages: boolean;                     // Add watermark to portfolio images
  allowDownload: boolean;                       // Allow customers to download images
  showClientTestimonials: boolean;              // Show testimonials on gallery items
  requireConsentForPublic: boolean;             // Only show with client consent
}

export interface PricingSettings {
  display: PricingDisplay;
  showStartingAt: boolean;                      // Show "Starting at $XX"
  showPriceRange: boolean;                      // Show "$50-$150" ranges
  showDuration: boolean;                        // Show service duration
  showAddOns: boolean;                          // Show add-on pricing
  consultationRequired: string[];               // Service IDs requiring consultation
  customPriceMessage?: string;                  // "Contact for pricing" message
}

export interface ReviewSettings {
  visibility: ReviewVisibility;
  showRating: boolean;                          // Show star rating
  showReviewCount: boolean;                     // Show total review count
  showReviewerName: boolean;                    // Show reviewer's name
  showReviewDate: boolean;                      // Show when reviewed
  highlightedReviews: string[];                 // IDs of reviews to feature
  minimumRatingToShow: number;                  // Only show reviews >= X stars (1-5)
  allowResponses: boolean;                      // Allow responding to reviews
  autoPublish: boolean;                         // Auto-publish or require approval
}

export interface ProfessionalSettings {
  certifications: CertificationDisplaySettings;
  portfolio: PortfolioSettings;
  pricing: PricingSettings;
  reviews: ReviewSettings;
}

export interface UseProfessionalReturn {
  settings: ProfessionalSettings;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  updateCertificationSettings: (updates: Partial<CertificationDisplaySettings>) => Promise<void>;
  updatePortfolioSettings: (updates: Partial<PortfolioSettings>) => Promise<void>;
  updatePricingSettings: (updates: Partial<PricingSettings>) => Promise<void>;
  updateReviewSettings: (updates: Partial<ReviewSettings>) => Promise<void>;
}
```

---

## Configuration

```typescript
// config.ts

export const PRICING_DISPLAY_OPTIONS: {
  value: PricingDisplay;
  label: string;
  description: string;
}[] = [
  {
    value: 'public',
    label: 'Show All Prices',
    description: 'Display full pricing on your profile',
  },
  {
    value: 'range_only',
    label: 'Show Price Ranges',
    description: 'Display price ranges like "$50-$150"',
  },
  {
    value: 'request_only',
    label: 'Request Quote',
    description: 'Customers must contact you for pricing',
  },
  {
    value: 'hidden',
    label: 'Hide All Prices',
    description: 'Do not display any pricing information',
  },
];

export const PORTFOLIO_ACCESS_OPTIONS: {
  value: PortfolioAccess;
  label: string;
  description: string;
}[] = [
  {
    value: 'public',
    label: 'Public',
    description: 'Anyone can view your portfolio',
  },
  {
    value: 'clients_only',
    label: 'Clients Only',
    description: 'Only past/current clients can view',
  },
  {
    value: 'private',
    label: 'Private',
    description: 'Only you can view your portfolio',
  },
];

export const REVIEW_VISIBILITY_OPTIONS: {
  value: ReviewVisibility;
  label: string;
  description: string;
  warning?: string;
}[] = [
  {
    value: 'all',
    label: 'Show All Reviews',
    description: 'Display all reviews on your profile',
  },
  {
    value: 'positive_only',
    label: 'Positive Only',
    description: 'Only show reviews 4 stars and above',
    warning: 'This may affect customer trust',
  },
  {
    value: 'hidden',
    label: 'Hide Reviews',
    description: 'Do not display reviews section',
    warning: 'Hiding reviews may significantly impact bookings',
  },
];

export const DEFAULT_PROFESSIONAL_SETTINGS: ProfessionalSettings = {
  certifications: {
    showCertifications: true,
    showVerifiedBadge: true,
    showCertificationDates: true,
    showIssuingOrganization: true,
    highlightedCertifications: [],
  },
  portfolio: {
    access: 'public',
    showBeforeAfter: true,
    watermarkImages: false,
    allowDownload: false,
    showClientTestimonials: true,
    requireConsentForPublic: true,
  },
  pricing: {
    display: 'public',
    showStartingAt: true,
    showPriceRange: true,
    showDuration: true,
    showAddOns: true,
    consultationRequired: [],
    customPriceMessage: 'Contact for custom pricing',
  },
  reviews: {
    visibility: 'all',
    showRating: true,
    showReviewCount: true,
    showReviewerName: true,
    showReviewDate: true,
    highlightedReviews: [],
    minimumRatingToShow: 1,
    allowResponses: true,
    autoPublish: true,
  },
};
```

---

## Components

### ProfessionalSection.tsx

Main section for settings page:
- Summary of current display settings
- Quick toggles for common options
- Links to detailed sub-sections
- Preview of how profile appears

### CertificationDisplay.tsx

Certification visibility controls:
- Master toggle for certifications section
- Toggle verified badge display
- Select which certifications to highlight
- Toggle dates and organizations

### PortfolioPrivacy.tsx

Portfolio/gallery privacy settings:
- Access level selector (public/clients/private)
- Before/after visibility toggle
- Watermark option
- Download permission
- Client consent requirement

### PricingVisibility.tsx

Service pricing display:
- Pricing display mode selector
- "Starting at" toggle
- Price range toggle
- Duration display toggle
- Services requiring consultation
- Custom pricing message

### ReviewsDisplay.tsx

Reviews section configuration:
- Visibility mode selector
- Rating display toggle
- Review count toggle
- Reviewer info toggles
- Highlighted reviews selector
- Response permissions
- Auto-publish setting

---

## Hook

```typescript
// hooks/useProfessional.ts

export function useProfessional(): UseProfessionalReturn {
  const { user } = useAuth();
  const [settings, setSettings] = useState<ProfessionalSettings>(DEFAULT_PROFESSIONAL_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, [user?.uid]);

  const fetchSettings = async () => {
    // GET /api/profile/professional
  };

  const updateCertificationSettings = async (updates: Partial<CertificationDisplaySettings>) => {
    // PATCH /api/profile/professional/certifications
  };

  const updatePortfolioSettings = async (updates: Partial<PortfolioSettings>) => {
    // PATCH /api/profile/professional/portfolio
  };

  const updatePricingSettings = async (updates: Partial<PricingSettings>) => {
    // PATCH /api/profile/professional/pricing
  };

  const updateReviewSettings = async (updates: Partial<ReviewSettings>) => {
    // PATCH /api/profile/professional/reviews
  };

  return {
    settings,
    isLoading,
    isSaving,
    error,
    updateCertificationSettings,
    updatePortfolioSettings,
    updatePricingSettings,
    updateReviewSettings,
  };
}
```

---

## API Endpoints

### GET /api/profile/professional
- Returns all professional display settings

### PATCH /api/profile/professional/certifications
- Update certification display settings
- Body: `{ showCertifications?, showVerifiedBadge?, ... }`

### PATCH /api/profile/professional/portfolio
- Update portfolio settings
- Body: `{ access?, showBeforeAfter?, ... }`

### PATCH /api/profile/professional/pricing
- Update pricing settings
- Body: `{ display?, showStartingAt?, ... }`

### PATCH /api/profile/professional/reviews
- Update review settings
- Body: `{ visibility?, showRating?, ... }`

---

## Database Schema

```typescript
// In brand document
brands/{brandId}
{
  // ... existing fields
  professionalSettings: {
    certifications: {
      showCertifications: true,
      showVerifiedBadge: true,
      showCertificationDates: true,
      showIssuingOrganization: true,
      highlightedCertifications: ['cert_1', 'cert_2'],
    },
    portfolio: {
      access: 'public',
      showBeforeAfter: true,
      watermarkImages: false,
      allowDownload: false,
      showClientTestimonials: true,
      requireConsentForPublic: true,
    },
    pricing: {
      display: 'public',
      showStartingAt: true,
      showPriceRange: true,
      showDuration: true,
      showAddOns: true,
      consultationRequired: ['service_1'],
      customPriceMessage: 'Contact for custom pricing',
    },
    reviews: {
      visibility: 'all',
      showRating: true,
      showReviewCount: true,
      showReviewerName: true,
      showReviewDate: true,
      highlightedReviews: ['review_1'],
      minimumRatingToShow: 1,
      allowResponses: true,
      autoPublish: true,
    },
    updatedAt: Timestamp,
  }
}
```

---

## UI Design

### Certification Display

```
┌─────────────────────────────────────────────────────────────┐
│ Certification Display                                       │
│ Control how your certifications appear                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Show certifications section                   [✓]          │
│ Display your certifications on your profile                 │
│                                                             │
│ ─────────────────────────────────────────────────────────── │
│                                                             │
│ Show verified badge                           [✓]          │
│ Display verified checkmark on your profile                  │
│                                                             │
│ Show certification dates                      [✓]          │
│ Display when you received certifications                    │
│                                                             │
│ Show issuing organization                     [✓]          │
│ Display who issued your certifications                      │
│                                                             │
│ ─────────────────────────────────────────────────────────── │
│                                                             │
│ Highlighted Certifications                                  │
│ Select certifications to feature prominently                │
│                                                             │
│ ☑️ Licensed Cosmetologist - California Board                │
│ ☑️ Master Colorist - Wella Professionals                    │
│ ☐ Advanced Cutting - Vidal Sassoon Academy                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Portfolio Privacy

```
┌─────────────────────────────────────────────────────────────┐
│ Portfolio Privacy                                           │
│ Control who can view your work                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Who can view your portfolio?                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ● 🌐 Public                                            │ │
│ │   Anyone can view your portfolio                       │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ○ 👥 Clients Only                                      │ │
│ │   Only past/current clients can view                   │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ○ 🔒 Private                                           │ │
│ │   Only you can view your portfolio                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Display Options                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Show before/after comparisons               [✓]        │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Add watermark to images                     [ ]        │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Allow image downloads                       [ ]        │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Show client testimonials                    [✓]        │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Require client consent for public           [✓]        │ │
│ │ Only show work with explicit client consent            │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Pricing Visibility

```
┌─────────────────────────────────────────────────────────────┐
│ Pricing Visibility                                          │
│ Control how pricing appears on your profile                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Pricing Display Mode                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ● Show All Prices                                      │ │
│ │   Display full pricing on your profile                 │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ○ Show Price Ranges                                    │ │
│ │   Display price ranges like "$50-$150"                 │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ○ Request Quote                                        │ │
│ │   Customers must contact you for pricing               │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ○ Hide All Prices                                      │ │
│ │   Do not display any pricing information               │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Display Options                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Show "Starting at" prices                   [✓]        │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Show service duration                       [✓]        │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Show add-on pricing                         [✓]        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Custom Price Message                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Contact for custom pricing                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│ Shown when prices are hidden or for consultation services   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Reviews Display

```
┌─────────────────────────────────────────────────────────────┐
│ Reviews Display                                             │
│ Configure your reviews section                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Reviews Visibility                                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ● Show All Reviews                                     │ │
│ │   Display all reviews on your profile                  │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ○ Positive Only                                        │ │
│ │   Only show reviews 4 stars and above                  │ │
│ │   ⚠️ This may affect customer trust                    │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ○ Hide Reviews                                         │ │
│ │   Do not display reviews section                       │ │
│ │   ⚠️ Hiding reviews may significantly impact bookings  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Display Options                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Show star rating                            [✓]        │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Show review count                           [✓]        │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Show reviewer name                          [✓]        │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Show review date                            [✓]        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Review Management                                           │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Allow responding to reviews                 [✓]        │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Auto-publish reviews                        [✓]        │ │
│ │ New reviews appear immediately              off = require approval │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Notes

1. **Profile Display Integration**:
   - These settings affect brand public pages
   - Public components must check settings before rendering
   - Cache settings for performance

2. **Watermarking**:
   - Consider server-side watermarking
   - Or client-side canvas watermark
   - Store watermarked versions

3. **Client Consent**:
   - Track consent per portfolio item
   - Consent UI in portfolio management
   - Filter portfolio by consent status

4. **Review Filtering**:
   - Apply filters server-side for performance
   - Still store all reviews (for owner view)
   - Consider implications of hiding negative reviews

5. **Pricing Display**:
   - Affects service cards on profile
   - "Starting at" uses lowest variant price
   - Range shows min-max of variants

6. **Preview Mode**:
   - Consider adding "View as customer" preview
   - Shows exactly how settings affect display

---

## Testing Checklist

- [ ] Certification visibility toggles work
- [ ] Highlighted certifications appear first
- [ ] Portfolio access levels enforced
- [ ] Watermarks applied correctly
- [ ] Download prevention works
- [ ] Pricing modes display correctly
- [ ] Custom price message appears
- [ ] Review filtering works
- [ ] Minimum rating filter applied
- [ ] Response permission enforced
- [ ] Auto-publish vs approval works

---

## Dependencies

- Canvas API - For watermarking (optional)
- Lucide icons - Award, Image, DollarSign, Star icons
- Date formatting utilities

---

## Priority

**Medium** - Important for professional control, but platform works without it
