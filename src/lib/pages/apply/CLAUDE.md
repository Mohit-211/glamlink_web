# Apply Module - Architecture Documentation

## Overview

The Apply module provides a unified system for beauty professionals to submit applications for:
1. **Featured Placement** - Get featured in Glamlink magazine (4 form types)
2. **Digital Business Card** - Get a professional digital business card

## Architecture

### Directory Structure

```
/lib/pages/apply/
├── shared/                      # Shared components and utilities
│   ├── components/
│   │   ├── fields/             # 15 reusable field components
│   │   ├── layout/             # Hero, TwoBoxesSection, FinalCTASection, ContentPreview
│   │   └── form-utils/         # DynamicMissingFieldsSummary, PerformanceMonitor
│   ├── hooks/                  # useTabValidationOptimized, useMediaValidation, etc.
│   ├── utils/                  # dataSanitizer, fileProcessor
│   ├── services/               # formConfigService
│   └── types/                  # Shared type definitions
├── featured/                    # Get Featured application
│   ├── components/
│   │   ├── FeaturedForm.tsx    # Main form orchestrator
│   │   ├── FeaturedPageClient.tsx  # Page wrapper
│   │   ├── forms/              # Form type components
│   │   │   ├── ProfileInfoForm.tsx
│   │   │   ├── CoverForm.tsx
│   │   │   ├── LocalSpotlightForm.tsx
│   │   │   ├── TopTreatmentForm.tsx
│   │   │   ├── RisingStarForm.tsx
│   │   │   └── FormHandler.tsx
│   │   └── admin/              # Admin components
│   ├── config/
│   │   ├── fields.ts           # Field definitions (1018 lines)
│   │   ├── formLayouts.ts      # Form layouts
│   │   └── templates.ts        # Default templates
│   ├── hooks/
│   │   ├── useFeaturedSubmission.ts
│   │   └── useVideoInteractions.ts
│   ├── templates/
│   │   ├── CoverFeatureDefault.tsx
│   │   └── RisingStarDefault.tsx
│   └── types.ts                # Feature-specific types
└── get-digital-card/            # Digital Business Card application
    ├── components/
    │   ├── DigitalCardForm.tsx
    │   └── DigitalCardPageClient.tsx
    ├── config/
    │   └── fields.ts
    ├── hooks/
    │   └── useDigitalCardSubmission.ts
    └── types.ts

/app/apply/
├── featured/
│   ├── page.tsx                # Main application page
│   └── view/
│       └── page.tsx            # Admin submissions view
└── digital-card/
    └── page.tsx                # Digital card application page

/app/get-featured/              # Redirects to /apply/featured
/app/get-digital-card/          # Redirects to /apply/digital-card
```

## Key Features

### Shared Component Architecture
- 15 reusable field components used across both applications
- Consistent layout components (Hero, TwoBoxesSection, etc.)
- Generic validation hooks that work with any form configuration
- Centralized data sanitization and file processing

### Featured Application (4 Form Types)
1. Cover Feature - Magazine cover placement
2. Local Spotlight - Local professional spotlight
3. Top Treatment - Featured treatment showcase
4. Rising Star - Rising star profile

### Digital Card Application
Simplified single-page form for professional digital business cards

## Usage

### Adding a New Field

1. Update field configuration in `config/fields.ts`
2. Add to type definition in `types.ts`
3. Initialize in form state
4. Render using shared field component

### Validation

The module uses `useTabValidationOptimized` hook:
- Generic validation that works with any field layout
- Real-time error feedback
- Progress tracking
- Missing fields summary

### Data Submission

All submissions use:
1. `sanitizeFormData()` - Remove undefined/null values
2. `validateFirestoreDataSize()` - Ensure data < 1MB
3. Submit to API endpoint
4. Store in Firestore collection

## API Endpoints

- `POST /api/get-featured/submit` - Submit featured application
- `GET /api/get-featured/submissions` - Get all submissions (admin)
- `PATCH /api/get-featured/submissions/[id]/review` - Update review status
- `POST /api/apply/digital-card/submit` - Submit digital card application

## Firestore Collections

- `get-featured-forms` - Featured application submissions
- `digital-card-applications` - Digital card submissions

## Migration Notes

This module consolidates the former `/lib/pages/get-featured/` into a unified apply system with:
- Shared components extracted to `/shared/`
- Feature-specific code in `/featured/` and `/get-digital-card/`
- Backward-compatible redirects from old routes
- Updated import paths using absolute references

## Best Practices

1. Always use shared field components
2. Sanitize data before submission
3. Use TypeScript strictly
4. Handle errors gracefully
5. Validate file sizes before upload

For detailed implementation examples, see individual component files and the feature-specific README files.
