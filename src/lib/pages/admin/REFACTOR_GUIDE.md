# Admin Directory Refactor Guide

**Generated:** 2025-12-05
**Total Files:** 100+ TypeScript/JavaScript files
**Total Lines:** 27,360

## Files by Size (Largest to Smallest)

| Lines | File Path |
|------:|:----------|
| 1,298 | config/fields/digital.ts |
| 1,261 | components/magazine/digital/EditorCanvas.tsx |
| 674 | components/magazine/digital/editor/index.tsx |
| 471 | components/magazine/digital/editor/preview/ImageWithCaptionPreview.tsx |
| 461 | config/editFields.ts |
| 378 | config/fields/magazine.ts |
| 368 | components/shared/editing/fields/ArrayField.tsx |
| 365 | components/promos/config.ts |
| 337 | components/magazine/digital/lib/services/pdfConfigurationService.ts |
| 328 | components/magazine/digital/editor/hooks/useCanvasPreview.tsx |
| 320 | components/magazine/digital/hooks/useCanvasGeneration.tsx |
| 318 | store/slices/magazineSlice.ts |
| 318 | components/magazine/digital/lib/utils/pdf/canvasToPdfConverter.ts |
| 316 | components/shared/editing/fields/custom/media/imageUpload.tsx |
| 307 | components/shared/table/TableHeader.tsx |
| 305 | components/magazine/digital/lib/types/index.ts |
| 298 | components/magazine/digital/editor/types.ts |
| 285 | store/slices/digitalPagesSlice.ts |
| 273 | components/magazine/digital/lib/utils/pdf/calculatePageInfo.ts |
| 273 | components/magazine/digital/editor/DigitalPageCanvas.tsx |
| 270 | components/shared/editing/fields/custom/promotion/PromotionField.tsx |
| 269 | components/shared/editing/modal/batch/useBatchModal.ts |
| 259 | store/slices/promosSlice.ts |
| 252 | components/shared/editing/form/useFormProvider.ts |
| 251 | store/slices/professionalsSlice.ts |
| 251 | config/digitalPreviewComponents.ts |
| 250 | components/shared/editing/fields/html/TiptapEditorToolbar.tsx |
| 249 | config/fields/professionals.ts |
| 249 | components/magazine/digital/lib/services/pdfGenerationService.ts |
| 245 | config/displayTables.ts |
| 244 | components/magazine/digital/lib/utils/config/sectionPageConfig.ts |
| 243 | components/shared/editing/fields/backgroundColor/useBackgroundColor.ts |
| 237 | components/magazine/digital/editor/PageCreator.tsx |
| 234 | components/shared/editing/fields/custom/gallery/useGalleryField.ts |
| 232 | components/shared/editing/fields/custom/media/useImageUpload.ts |
| 232 | components/magazine/digital/editor/PdfConfigPanel.tsx |
| 227 | config/records/professionals.ts |
| 224 | components/promos/usePromosAPI.ts |
| 220 | components/shared/editing/modal/batch/BatchModalContent.tsx |
| 211 | config/fields/promos.ts |
| 210 | components/magazine/useMagazineAPI.ts |
| 209 | components/shared/editing/fields/custom/media/ImageCropModal.tsx |
| 209 | components/magazine/digital/editor/preview/ArticleImagesDiagonalPreview.tsx |
| 208 | components/shared/editing/fields/backgroundColor/ExpandedColors.tsx |
| 202 | components/professionals/useProfessionalsAPI.ts |
| 200 | components/shared/editing/fields/custom/gallery/GalleryField.tsx |
| 200 | components/magazine/digital/editor/preview/ArticleTwoImagesTopPreview.tsx |
| 199 | components/magazine/digital/editor/preview/ArticleStartHeroPreview.tsx |
| 199 | components/magazine/MagazineSections.tsx |
| 198 | components/shared/editing/fields/custom/media/useImageCropModal.ts |
| 198 | components/promos/PromoJsonEditor.tsx |
| 197 | components/magazine/digital/MagazineDigitalPages.tsx |
| 196 | components/magazine/digital/editor/preview/ImageWithTwoCaptionsPreview.tsx |
| 191 | components/shared/editing/fields/html/useTiptapEditor.ts |
| 181 | components/magazine/digital/lib/utils/pdf/generatePDFFromCanvas.ts |
| 180 | components/shared/editing/fields/backgroundColor/index.tsx |
| 176 | components/magazine/digital/editor/hooks/useDigitalPagePdf.ts |
| 175 | components/magazine/MagazineTab.tsx |
| 172 | types/forms.ts |
| 170 | components/shared/common/Icons.tsx |
| 167 | components/shared/editing/modal/batch/BatchModal.tsx |
| 166 | components/shared/editing/fields/custom/location/useLocationField.ts |
| 165 | components/magazine/digital/editor/preview/ArticleImageCenterWithQuotePreview.tsx |
| 163 | components/shared/editing/fields/custom/promotion/usePromotionField.ts |
| 161 | components/magazine/useMagazineTab.ts |
| 160 | components/shared/editing/fields/custom/location/LocationField.tsx |
| 159 | components/promos/PromosTab.tsx |
| 156 | components/shared/editing/fields/custom/media/imageCropUtils.ts |
| 153 | components/magazine/digital/editor/preview/ArticleTwoColumnTextPreview.tsx |
| 151 | components/magazine/digital/DigitalSectionEditor.tsx |
| 150 | components/shared/table/SimpleTable.tsx |
| 143 | components/shared/editing/modal/PreviewContainer.tsx |
| 143 | components/magazine/digital/editor/preview/ImageWithCornerCaptionPreview.tsx |
| 142 | components/shared/editing/fields/typography/TypographySettings.tsx |
| 141 | components/magazine/digital/pdf-manager/SectionCard.tsx |
| 139 | components/shared/editing/form/useJsonEditor.ts |
| 136 | hooks/usePromosRedux.ts |
| 136 | components/shared/editing/fields/custom/specialties/SpecialtiesField.tsx |
| 136 | components/magazine/web/preview/TableOfContentsPreview.tsx |
| 136 | components/magazine/digital/hooks/useImageProcessor.ts |
| 134 | components/shared/editing/FormModal.tsx |
| 133 | components/magazine/digital/editor/preview/TwoColumnWithQuotePreview.tsx |
| 133 | components/magazine/digital/editor/preview/ImageWithTitlePreview.tsx |
| 129 | components/shared/editing/useFormModal.ts |
| 128 | components/shared/editing/form/JsonEditor.tsx |
| 128 | components/professionals/ProfessionalsTab.tsx |
| 128 | components/magazine/digital/EditorHeader.tsx |
| 126 | components/shared/editing/modal/TabsContainer.tsx |
| 126 | components/shared/editing/fields/html/RawHtmlModal.tsx |
| 124 | components/magazine/web/preview/CoverPreview.tsx |
| 120 | server/firebaseTrainingService.ts |
| 120 | components/magazine/digital/editor/form/useCanvasEditor.ts |
| 117 | components/shared/editing/form/FormRenderer.tsx |
| 116 | components/professionals/ProfessionalModal.tsx |
| 116 | components/magazine/digital/pdf-manager/index.tsx |
| 115 | server/firebaseReviewService.ts |
| 110 | components/shared/editing/fields/html/useRawHtmlModal.ts |
| 109 | hooks/useProfessionalsRedux.ts |
| 109 | components/professionals/ProfessionalItem.tsx |

---

## Refactor Recommendations

### Priority 1: Split Large Configuration Files (1,298-461 lines)

The `config/fields/digital.ts` (1,298 lines) and `config/editFields.ts` (461 lines) files are massive configuration files that define field schemas for various page types. **Recommendation:** Split these by feature area into separate files like `digital/imageLayouts.ts`, `digital/textLayouts.ts`, `digital/complexLayouts.ts`. Each file should contain related field configurations and their default data functions. This would improve maintainability and make it easier to locate specific configurations. Consider creating an index file that re-exports all configurations for backward compatibility.

### Priority 2: Refactor EditorCanvas Component (1,261 lines)

The `EditorCanvas.tsx` is an extremely complex component handling canvas rendering, PDF generation, image processing, and user interactions all in one file. **Recommendation:** Extract separate concerns into dedicated hooks and utilities: `useCanvasState.ts` (canvas state management), `useCanvasInteractions.ts` (mouse/keyboard events), `useCanvasRendering.ts` (drawing logic), and `CanvasToolbar.tsx` (UI controls component). The main component should orchestrate these pieces rather than implementing everything inline. This separation would dramatically improve testability and code reusability.

### Priority 3: Consolidate Preview Components (471-133 lines each)

There are 12+ preview components for different page layouts, each 130-471 lines, with significant code duplication in helper functions (`getImageUrl`, `getImageObjectFit`, `getImageObjectPosition`). **Recommendation:** Create a `shared/previewHelpers.ts` utility file exporting all common functions, and a `BasePreviewComponent` wrapper that provides consistent styling, empty state handling, and error boundaries. Each preview component should focus solely on its unique layout logic, reducing duplication by ~40%. This would also make it easier to maintain consistent behavior across all previews (e.g., image loading, error handling, typography).

---

## File Categories

- **Configuration Files (10):** Field definitions, display tables, preview components
- **Redux Slices (4):** State management for magazine, digital pages, promos, professionals
- **Editor Components (15+):** Canvas editors, preview components, page creators
- **Form System (20+):** Fields, modals, providers, renderers
- **PDF Generation (6):** Services, converters, configuration, utils
- **API Hooks (4):** Magazine, digital, promos, professionals data operations
- **Shared Components (10+):** Tables, icons, modals, toolbars

---

*This guide provides a snapshot of file complexity to help prioritize refactoring efforts. Focus on the largest files first as they typically contain the most technical debt and maintenance burden.*
