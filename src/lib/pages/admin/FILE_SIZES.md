# Admin Directory File Sizes

Analysis of .ts and .tsx files in `/lib/pages/admin/` by line count.

*Generated: December 15, 2025*

---

## 500+ Lines (11 files)

| Lines | File Path |
|-------|-----------|
| 1393 | `config/fields/digital/previews.ts` |
| 1054 | `components/magazine/digital/editor/preview/designs/util/usePageData.ts` |
| 790 | `components/magazine/web/editor/config/content-discovery/shared.ts` |
| 654 | `components/get-featured/data/all.ts` |
| 538 | `components/magazine/web/editor/config/content-defaults/coin-drop-defaults.ts` |
| 521 | `components/magazine/web/editor/config/content-defaults/spotlight-city-defaults.ts` |
| 521 | `components/magazine/digital/editor/page-creator/custom-layout/ObjectForm.tsx` |
| 519 | `components/magazine/digital/editor/pdf-config/PdfConfigPanel.tsx` |
| 516 | `components/magazine/web/editor/config/content-defaults/glamlink-stories-defaults.ts` |
| 514 | `components/shared/editing/fields/ArrayField.tsx` |
| 506 | `components/magazine/web/preview/designs/content/shared/BusinessProfile.tsx` |

---

## 400-499 Lines (8 files)

| Lines | File Path |
|-------|-----------|
| 499 | `components/shared/editing/fields/custom/location/MultiLocationField.tsx` |
| 483 | `config/fields/getFeatured.ts` |
| 477 | `components/magazine/digital/editor/header/AddLayoutTab.tsx` |
| 473 | `components/magazine/digital/editor/preview/designs/custom/CustomObjectRenderer.tsx` |
| 464 | `components/magazine/digital/editor/types.ts` |
| 461 | `config/editFields.ts` |
| 457 | `config/fields/digital/defaults.ts` |
| 454 | `components/magazine/web/preview/designs/content/top-product-spotlight/ProductDetails.tsx` |

---

## 300-399 Lines (42 files)

| Lines | File Path |
|-------|-----------|
| 398 | `components/shared/editing/fields/custom/sections-config/SectionsConfigEditor.tsx` |
| 398 | `components/magazine/web/preview/designs/content/shared/CallToAction.tsx` |
| 390 | `components/magazine/digital/pdf-manager/hooks/useCombinedPdf.ts` |
| 383 | `components/magazine/useMagazineSections.ts` |
| 381 | `components/magazine/digital/editor/header/useHeader.ts` |
| 378 | `config/fields/magazine.ts` |
| 373 | `components/magazine/web/preview/designs/content/shared/EmbeddableBusinessCard.tsx` |
| 366 | `components/magazine/web/preview/designs/content/shared/MediaItem.tsx` |
| 365 | `components/promos/config.ts` |
| 363 | `components/magazine/digital/editor/preview/designs/image/ImageWithCaptionPreview.tsx` |
| 354 | `components/magazine/web/preview/designs/CustomSectionPreview.tsx` |
| 352 | `components/magazine/digital/editor/useDigitalPageEditor.ts` |
| 349 | `components/magazine/digital/editor/util-pdf-canvas/canvas/CanvasCreator.tsx` |
| 343 | `config/displayTables.ts` |
| 343 | `components/magazine/digital/editor/preview/designs/article/TwoColumnWithQuotePreview.tsx` |
| 337 | `components/magazine/digital/lib/services/pdfConfigurationService.ts` |
| 333 | `components/magazine/web/preview/designs/content/top-treatment/BeforeAfterImages.tsx` |
| 330 | `config/fields/professionals.ts` |
| 328 | `store/slices/professionalsSlice.ts` |
| 328 | `components/magazine/digital/editor/preview/CustomLayoutOverlay.tsx` |
| 326 | `store/slices/digitalPagesSlice.ts` |
| 325 | `config/digitalPreviewComponents.ts` |
| 324 | `components/professionals/useProfessionalsAPI.ts` |
| 323 | `components/magazine/web/preview/designs/content/rising-star/StarProfile.tsx` |
| 323 | `components/magazine/digital/editor/page-creator/custom-layout/types.ts` |
| 320 | `components/magazine/digital/hooks/useCanvasGeneration.tsx` |
| 318 | `store/slices/magazineSlice.ts` |
| 318 | `components/magazine/digital/lib/utils/pdf/canvasToPdfConverter.ts` |
| 317 | `components/shared/editing/fields/custom/media/imageUpload.tsx` |
| 315 | `components/get-featured/useGetFeaturedTab.ts` |
| 307 | `components/shared/table/TableHeader.tsx` |
| 305 | `components/magazine/digital/lib/types/index.ts` |
| 303 | `components/shared/editing/form/useFormProvider.ts` |
| 300 | `components/get-featured/form/useFormConfigsAPI.ts` |

---

## Summary

| Category | Count |
|----------|-------|
| 500+ lines | 11 |
| 400-499 lines | 8 |
| 300-399 lines | 42 |
| **Total large files** | **61** |

---

## Notes

- Files in `config/` directories tend to be large due to field definitions and defaults
- Magazine-related components are the largest category
- Consider breaking down files over 500 lines into smaller modules
- The `previews.ts` file at 1393 lines is the largest and may benefit from splitting
