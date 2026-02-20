/**
 * Treatment Content Configuration
 *
 * Contains detailed content for each treatment:
 * - Descriptions (short and long)
 * - FAQs
 * - Price ranges
 * - Healing times and durations
 * - Related treatments
 */

import type { FAQ, TreatmentCategory } from '../types';

// =============================================================================
// TREATMENT CONTENT TYPE
// =============================================================================

export interface TreatmentContent {
  slug: string;
  name: string;
  category: TreatmentCategory;
  shortDescription: string;
  longDescription: string;
  whatToExpect: string;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  duration: string;
  healingTime: string;
  resultsLast: string;
  relatedTreatments: string[];
  faqs: FAQ[];
  image: string;
}

// =============================================================================
// TREATMENT CONTENT DATA
// =============================================================================

export const TREATMENT_CONTENT: Record<string, TreatmentContent> = {
  // ---------------------------------------------------------------------------
  // INJECTABLES
  // ---------------------------------------------------------------------------
  botox: {
    slug: 'botox',
    name: 'Botox',
    category: 'injectables',
    shortDescription: 'Reduce fine lines and wrinkles with this FDA-approved treatment.',
    longDescription:
      'Botox is a neurotoxin that temporarily relaxes facial muscles to smooth wrinkles and prevent new ones from forming. It is the most popular cosmetic procedure in the United States, with millions of treatments performed annually. Results typically appear within 3-7 days and last 3-4 months.',
    whatToExpect:
      'Your injector will map out the treatment areas and use a fine needle to inject small amounts of Botox into specific muscles. The procedure takes 10-20 minutes with minimal discomfort. You can return to normal activities immediately, but should avoid lying down or strenuous exercise for a few hours.',
    priceRange: { min: 200, max: 600, currency: 'USD' },
    duration: '15-30 minutes',
    healingTime: 'None (minimal redness)',
    resultsLast: '3-4 months',
    relatedTreatments: ['dermal-fillers', 'lip-filler', 'microneedling'],
    faqs: [
      {
        question: 'Does Botox hurt?',
        answer:
          'Most patients report minimal discomfort, often described as a small pinch. The needles used are very fine, and the procedure is quick.',
      },
      {
        question: 'How long does Botox last?',
        answer:
          'Results typically last 3-4 months. With regular treatments, some patients find their results last longer over time.',
      },
      {
        question: 'Can I go back to work after Botox?',
        answer:
          'Yes, there is no downtime. You can return to normal activities immediately, though you should avoid lying down for 4 hours.',
      },
      {
        question: 'At what age should I start Botox?',
        answer:
          "There's no specific age. Many people start in their late 20s to early 30s as a preventive measure, while others begin when lines become more noticeable.",
      },
    ],
    image: '/images/treatments/botox.jpg',
  },

  'dermal-fillers': {
    slug: 'dermal-fillers',
    name: 'Dermal Fillers',
    category: 'injectables',
    shortDescription: 'Restore volume and enhance facial contours with hyaluronic acid fillers.',
    longDescription:
      'Dermal fillers are injectable gels made from hyaluronic acid that add volume, smooth wrinkles, and enhance facial features. They can be used to plump lips, fill nasolabial folds, enhance cheeks, and restore under-eye hollows. Results are immediate and can last 6-18 months depending on the product and area treated.',
    whatToExpect:
      'After a consultation, your injector will mark the treatment areas. A topical numbing cream may be applied for comfort. The filler is injected using a fine needle or cannula. You may see immediate results with some swelling that subsides within a few days.',
    priceRange: { min: 500, max: 1500, currency: 'USD' },
    duration: '30-60 minutes',
    healingTime: '1-2 days (mild swelling)',
    resultsLast: '6-18 months',
    relatedTreatments: ['lip-filler', 'botox', 'chemical-peels'],
    faqs: [
      {
        question: 'Are dermal fillers safe?',
        answer:
          'Yes, when performed by a trained professional. Hyaluronic acid is a naturally occurring substance in the body, making it well-tolerated.',
      },
      {
        question: 'Can fillers be dissolved?',
        answer:
          'Yes, hyaluronic acid fillers can be dissolved with an enzyme called hyaluronidase if needed.',
      },
      {
        question: 'How much filler do I need?',
        answer:
          'This varies by individual and treatment area. Most people need 1-2 syringes per area for optimal results.',
      },
    ],
    image: '/images/treatments/dermal-fillers.jpg',
  },

  'lip-filler': {
    slug: 'lip-filler',
    name: 'Lip Filler',
    category: 'injectables',
    shortDescription: 'Enhance lip volume and shape for a fuller, more defined pout.',
    longDescription:
      'Lip filler treatments use hyaluronic acid to add volume, definition, and hydration to the lips. Whether you want subtle enhancement or a more dramatic look, a skilled injector can customize the treatment to your desired outcome. Results are immediate and typically last 6-12 months.',
    whatToExpect:
      'Your injector will discuss your goals and map out the injection points. Numbing cream is applied for comfort. Small amounts of filler are carefully injected to achieve the desired shape and volume. Some swelling is normal and subsides within a few days.',
    priceRange: { min: 400, max: 800, currency: 'USD' },
    duration: '15-30 minutes',
    healingTime: '2-3 days (swelling)',
    resultsLast: '6-12 months',
    relatedTreatments: ['lip-blush', 'dermal-fillers', 'botox'],
    faqs: [
      {
        question: 'Will my lips look natural?',
        answer:
          'With a skilled injector and appropriate amount of filler, results can look very natural. Start conservative and add more if desired.',
      },
      {
        question: 'How much swelling should I expect?',
        answer:
          'Lips typically swell 20-50% immediately after treatment. Most swelling resolves within 2-3 days, with final results visible at 2 weeks.',
      },
      {
        question: 'Can I wear lipstick after?',
        answer:
          'Wait at least 24 hours before applying lipstick or lip products to avoid infection at the injection sites.',
      },
    ],
    image: '/images/treatments/lip-filler.jpg',
  },

  // ---------------------------------------------------------------------------
  // PERMANENT MAKEUP
  // ---------------------------------------------------------------------------
  'lip-blush': {
    slug: 'lip-blush',
    name: 'Lip Blush',
    category: 'permanent-makeup',
    shortDescription: 'Semi-permanent lip color that enhances your natural lip tone.',
    longDescription:
      'Lip blush is a semi-permanent makeup technique that deposits pigment into the lips to enhance their natural color, define the shape, and create the appearance of fuller lips. Unlike lip filler, lip blush adds color rather than volume. Results last 2-5 years with proper care.',
    whatToExpect:
      'The procedure takes about 2-3 hours including numbing time. A topical anesthetic is applied for comfort. Your artist will map out the shape and select a custom color. The pigment is deposited using a fine needle or machine. Lips will appear darker initially and heal to a softer shade.',
    priceRange: { min: 400, max: 800, currency: 'USD' },
    duration: '2-3 hours',
    healingTime: '7-10 days',
    resultsLast: '2-5 years',
    relatedTreatments: ['lip-filler', 'lip-liner-tattoo', 'microblading'],
    faqs: [
      {
        question: 'Does lip blush hurt?',
        answer:
          'A topical numbing cream is applied to minimize discomfort. Most clients describe the sensation as slight scratching or vibration.',
      },
      {
        question: 'How long does healing take?',
        answer:
          'Initial healing takes 7-10 days. During this time, lips may be dry and the color will appear darker before lightening.',
      },
      {
        question: 'Do I need a touch-up?',
        answer:
          'Yes, a touch-up 6-8 weeks after the initial appointment is recommended to perfect the color and address any areas that healed unevenly.',
      },
    ],
    image: '/images/treatments/lip-blush.jpg',
  },

  microblading: {
    slug: 'microblading',
    name: 'Microblading',
    category: 'permanent-makeup',
    shortDescription: 'Natural-looking eyebrow hair strokes for fuller, defined brows.',
    longDescription:
      'Microblading is a semi-permanent eyebrow technique that creates realistic hair-like strokes using a handheld tool with fine needles. It is ideal for filling in sparse brows, creating shape, or enhancing your natural brow. Results last 1-3 years depending on skin type and aftercare.',
    whatToExpect:
      'Your appointment begins with a consultation and brow mapping to design your perfect shape. Numbing cream is applied for comfort. The artist creates individual strokes that mimic natural brow hairs. The process takes 2-3 hours. Brows will appear darker initially and lighten during healing.',
    priceRange: { min: 350, max: 700, currency: 'USD' },
    duration: '2-3 hours',
    healingTime: '7-14 days',
    resultsLast: '1-3 years',
    relatedTreatments: ['brow-lamination', 'brow-tinting', 'lip-blush'],
    faqs: [
      {
        question: 'Is microblading safe?',
        answer:
          'Yes, when performed by a trained and licensed professional using sterile equipment. Always verify your artist\'s credentials.',
      },
      {
        question: 'Will microblading work on my skin type?',
        answer:
          'Microblading works best on normal to dry skin. Oily skin may cause strokes to blur over time. Your artist can recommend alternatives if needed.',
      },
      {
        question: 'How do I prepare for my appointment?',
        answer:
          'Avoid alcohol, caffeine, and blood thinners 24-48 hours before. Do not wax or tint brows for 1 week prior.',
      },
    ],
    image: '/images/treatments/microblading.jpg',
  },

  'eyeliner-tattoo': {
    slug: 'eyeliner-tattoo',
    name: 'Eyeliner Tattoo',
    category: 'permanent-makeup',
    shortDescription: 'Wake up with perfectly defined eyes every day.',
    longDescription:
      'Permanent eyeliner tattoo deposits pigment along the lash line to create the appearance of fuller lashes and defined eyes. Options range from subtle lash enhancement to a classic liner look. Results last 3-5 years and can save hours on daily makeup application.',
    whatToExpect:
      'The procedure begins with numbing the eye area. Your artist will discuss the style and thickness you want. Pigment is deposited along the lash line using a specialized machine. The process takes 1-2 hours. Some swelling and tenderness is normal for 1-3 days.',
    priceRange: { min: 300, max: 600, currency: 'USD' },
    duration: '1-2 hours',
    healingTime: '5-7 days',
    resultsLast: '3-5 years',
    relatedTreatments: ['lash-extensions', 'lash-lift', 'microblading'],
    faqs: [
      {
        question: 'Can I wear contacts during the procedure?',
        answer:
          'No, contacts must be removed before the procedure. Bring glasses to wear home and avoid contacts for 3-5 days after.',
      },
      {
        question: 'How dark will the liner be?',
        answer:
          'The liner will appear darker initially and heal to a softer shade. Your artist will select a color that works with your skin tone.',
      },
    ],
    image: '/images/treatments/eyeliner-tattoo.jpg',
  },

  'lip-liner-tattoo': {
    slug: 'lip-liner-tattoo',
    name: 'Lip Liner Tattoo',
    category: 'permanent-makeup',
    shortDescription: 'Define and enhance your lip shape with semi-permanent liner.',
    longDescription:
      'Lip liner tattoo creates a defined lip border and can correct asymmetry or enhance your natural lip shape. It can be done alone or combined with lip blush for a complete look. The subtle enhancement gives the appearance of fuller, more defined lips.',
    whatToExpect:
      'Your artist will map out the desired lip shape and apply numbing cream. Pigment is deposited along the lip border to define and enhance. The procedure takes 1-2 hours. Lips will be swollen for 1-2 days and the color will soften during healing.',
    priceRange: { min: 300, max: 550, currency: 'USD' },
    duration: '1-2 hours',
    healingTime: '5-7 days',
    resultsLast: '2-4 years',
    relatedTreatments: ['lip-blush', 'lip-filler', 'microblading'],
    faqs: [
      {
        question: "What's the difference between lip liner and lip blush?",
        answer:
          'Lip liner defines the border of the lips while lip blush fills in the entire lip with color. They can be combined for a complete look.',
      },
    ],
    image: '/images/treatments/lip-liner-tattoo.jpg',
  },

  // ---------------------------------------------------------------------------
  // SKIN TREATMENTS
  // ---------------------------------------------------------------------------
  facials: {
    slug: 'facials',
    name: 'Facials',
    category: 'skin-treatments',
    shortDescription: 'Professional skin care treatments customized for your skin type.',
    longDescription:
      'Professional facials cleanse, exfoliate, and nourish the skin to promote a clear, well-hydrated complexion. Treatments can address specific concerns like acne, aging, hyperpigmentation, or dehydration. Regular facials help maintain healthy skin between more intensive treatments.',
    whatToExpect:
      'Your esthetician will analyze your skin and recommend a customized treatment. Typical facials include cleansing, exfoliation, extraction (if needed), a mask, and moisturizer. Add-ons like LED therapy or chemical peels may be included. Sessions last 60-90 minutes.',
    priceRange: { min: 75, max: 250, currency: 'USD' },
    duration: '60-90 minutes',
    healingTime: 'None to 1 day',
    resultsLast: '4-6 weeks',
    relatedTreatments: ['chemical-peels', 'microneedling', 'dermaplaning'],
    faqs: [
      {
        question: 'How often should I get a facial?',
        answer:
          'Most skin types benefit from a facial every 4-6 weeks, which aligns with the skin cell turnover cycle.',
      },
      {
        question: 'Will I break out after a facial?',
        answer:
          'Some purging is normal, especially if extractions were done. This typically clears within a few days.',
      },
    ],
    image: '/images/treatments/facials.jpg',
  },

  'chemical-peels': {
    slug: 'chemical-peels',
    name: 'Chemical Peels',
    category: 'skin-treatments',
    shortDescription: 'Resurface skin and reduce signs of aging, acne, and hyperpigmentation.',
    longDescription:
      'Chemical peels use acids to remove damaged outer layers of skin, revealing smoother, more even-toned skin beneath. Peels range from gentle (lunchtime peels) to deep treatments requiring downtime. They effectively treat fine lines, acne scars, sun damage, and uneven skin tone.',
    whatToExpect:
      'Your provider will select the appropriate peel strength for your skin concerns. The solution is applied and may tingle or sting. Light peels have no downtime, while deeper peels cause peeling for 5-10 days. Sun protection is essential during healing.',
    priceRange: { min: 100, max: 500, currency: 'USD' },
    duration: '30-60 minutes',
    healingTime: '3-10 days',
    resultsLast: '1-6 months',
    relatedTreatments: ['facials', 'microneedling', 'dermaplaning'],
    faqs: [
      {
        question: 'What strength peel do I need?',
        answer:
          'Your provider will recommend a peel based on your skin type, concerns, and available downtime. Start with a lighter peel if new to chemical exfoliation.',
      },
      {
        question: 'Can I wear makeup after a peel?',
        answer:
          'Light peels allow makeup immediately. Deeper peels require waiting until peeling is complete, usually 5-10 days.',
      },
    ],
    image: '/images/treatments/chemical-peels.jpg',
  },

  microneedling: {
    slug: 'microneedling',
    name: 'Microneedling',
    category: 'skin-treatments',
    shortDescription: 'Stimulate collagen production for smoother, firmer skin.',
    longDescription:
      'Microneedling uses tiny needles to create controlled micro-injuries in the skin, triggering the natural healing process and collagen production. It effectively treats fine lines, acne scars, large pores, and uneven texture. Results improve over several weeks as collagen builds.',
    whatToExpect:
      'Numbing cream is applied for 20-30 minutes before treatment. A pen-like device with tiny needles is passed over the skin. You may feel pressure and slight discomfort. Skin will be red like a sunburn for 1-3 days. Full results appear after 4-6 weeks.',
    priceRange: { min: 200, max: 600, currency: 'USD' },
    duration: '45-60 minutes',
    healingTime: '1-3 days',
    resultsLast: '3-6 months',
    relatedTreatments: ['chemical-peels', 'botox', 'facials'],
    faqs: [
      {
        question: 'How many sessions do I need?',
        answer:
          'Most people see best results with 3-6 sessions spaced 4-6 weeks apart. Maintenance treatments can be done every 6-12 months.',
      },
      {
        question: 'Can microneedling remove acne scars?',
        answer:
          'Yes, microneedling is very effective for acne scars. Multiple sessions are typically needed for significant improvement.',
      },
    ],
    image: '/images/treatments/microneedling.jpg',
  },

  dermaplaning: {
    slug: 'dermaplaning',
    name: 'Dermaplaning',
    category: 'skin-treatments',
    shortDescription: 'Exfoliate dead skin and remove peach fuzz for smooth, glowing skin.',
    longDescription:
      'Dermaplaning is a physical exfoliation technique that uses a sterile surgical blade to gently scrape away dead skin cells and fine vellus hair (peach fuzz). The result is instantly smoother skin that allows for better product absorption and flawless makeup application.',
    whatToExpect:
      'Your esthetician will cleanse and prep your skin. Using a surgical blade held at a 45-degree angle, they will gently scrape the surface of your skin. The treatment is painless and takes about 30 minutes. Skin may be slightly pink immediately after.',
    priceRange: { min: 75, max: 200, currency: 'USD' },
    duration: '30-45 minutes',
    healingTime: 'None',
    resultsLast: '3-4 weeks',
    relatedTreatments: ['facials', 'chemical-peels', 'microneedling'],
    faqs: [
      {
        question: 'Will my hair grow back thicker?',
        answer:
          'No, this is a myth. Vellus hair will grow back the same texture. Only terminal hair (like beard hair) can change when cut.',
      },
      {
        question: 'Is dermaplaning safe for all skin types?',
        answer:
          'Dermaplaning is safe for most skin types but is not recommended for active acne or very sensitive skin.',
      },
    ],
    image: '/images/treatments/dermaplaning.jpg',
  },

  // ---------------------------------------------------------------------------
  // LASHES & BROWS
  // ---------------------------------------------------------------------------
  'lash-extensions': {
    slug: 'lash-extensions',
    name: 'Lash Extensions',
    category: 'lashes-brows',
    shortDescription: 'Achieve fuller, longer lashes without mascara.',
    longDescription:
      'Lash extensions are individual synthetic or natural fiber lashes applied to each natural lash using medical-grade adhesive. They create a customizable look from natural enhancement to full glamour. With proper care, extensions last 2-4 weeks before needing a fill.',
    whatToExpect:
      'You will lie comfortably with eyes closed for 1.5-2.5 hours. Your lash artist will isolate each natural lash and attach an extension. The process is painless and many clients nap during their appointment. Avoid water and steam for 24-48 hours after.',
    priceRange: { min: 150, max: 350, currency: 'USD' },
    duration: '1.5-2.5 hours',
    healingTime: 'None',
    resultsLast: '2-4 weeks',
    relatedTreatments: ['lash-lift', 'brow-lamination', 'eyeliner-tattoo'],
    faqs: [
      {
        question: 'Will lash extensions damage my natural lashes?',
        answer:
          'When applied correctly by a trained professional and cared for properly, extensions should not damage natural lashes.',
      },
      {
        question: 'How often do I need fills?',
        answer:
          'Most clients need a fill every 2-3 weeks. Your natural lash cycle causes extensions to fall out with the natural lash.',
      },
    ],
    image: '/images/treatments/lash-extensions.jpg',
  },

  'brow-lamination': {
    slug: 'brow-lamination',
    name: 'Brow Lamination',
    category: 'lashes-brows',
    shortDescription: 'Get fluffy, brushed-up brows that stay in place all day.',
    longDescription:
      'Brow lamination is a semi-permanent treatment that restructures brow hairs to keep them in a desired shape. It creates a fuller, more uniform look by redirecting hairs to cover sparse areas. The "laminated" look is trendy and low-maintenance.',
    whatToExpect:
      'A lifting solution is applied to soften the hair bonds, then a neutralizer sets the new shape. The process takes 45-60 minutes. Your brows will appear fuller and stay brushed up for 6-8 weeks. A tint is often included for added definition.',
    priceRange: { min: 60, max: 150, currency: 'USD' },
    duration: '45-60 minutes',
    healingTime: 'None',
    resultsLast: '6-8 weeks',
    relatedTreatments: ['microblading', 'brow-tinting', 'lash-lift'],
    faqs: [
      {
        question: 'Is brow lamination safe?',
        answer:
          'Yes, when done by a trained professional. The solutions used are similar to those in lash lifts and perms.',
      },
      {
        question: 'Can I get lamination if I have thin brows?',
        answer:
          'Yes! Lamination can make thin brows appear fuller by redirecting hairs. However, very sparse brows may benefit more from microblading.',
      },
    ],
    image: '/images/treatments/brow-lamination.jpg',
  },

  'lash-lift': {
    slug: 'lash-lift',
    name: 'Lash Lift',
    category: 'lashes-brows',
    shortDescription: 'Lift and curl your natural lashes for an eye-opening effect.',
    longDescription:
      'A lash lift is a semi-permanent treatment that lifts and curls your natural lashes from the root, creating the appearance of longer, fuller lashes without extensions. It is low-maintenance and perfect for those who want to enhance their natural lashes.',
    whatToExpect:
      'Your lashes are attached to a silicone rod, then a lifting solution is applied followed by a setting solution. The process takes 45-60 minutes. Results last 6-8 weeks as your natural lashes grow out. A tint is often added for extra impact.',
    priceRange: { min: 75, max: 150, currency: 'USD' },
    duration: '45-60 minutes',
    healingTime: 'None',
    resultsLast: '6-8 weeks',
    relatedTreatments: ['lash-extensions', 'brow-lamination', 'eyeliner-tattoo'],
    faqs: [
      {
        question: 'Can I wear mascara with a lash lift?',
        answer:
          'Yes, but many clients find they do not need mascara after a lift and tint. Wait 24-48 hours before applying any products.',
      },
      {
        question: 'Is a lash lift better than extensions?',
        answer:
          'It depends on your lifestyle. Lash lifts are lower maintenance but work with your natural lashes. Extensions provide more dramatic, customizable results.',
      },
    ],
    image: '/images/treatments/lash-lift.jpg',
  },

  'brow-tinting': {
    slug: 'brow-tinting',
    name: 'Brow Tinting',
    category: 'lashes-brows',
    shortDescription: 'Add color and definition to your brows with semi-permanent dye.',
    longDescription:
      'Brow tinting uses semi-permanent dye to enhance the color of your eyebrows, making them appear fuller and more defined. It is a quick treatment that can dramatically improve sparse or light-colored brows. Results last 3-6 weeks.',
    whatToExpect:
      'Your brow artist will select a dye color that complements your hair and skin tone. The dye is applied and left for 5-10 minutes, then removed. The entire process takes about 15-20 minutes. Avoid water on brows for 24 hours.',
    priceRange: { min: 20, max: 50, currency: 'USD' },
    duration: '15-20 minutes',
    healingTime: 'None',
    resultsLast: '3-6 weeks',
    relatedTreatments: ['brow-lamination', 'microblading', 'lash-lift'],
    faqs: [
      {
        question: 'Is brow tinting safe?',
        answer:
          'Yes, when using professional dyes and performed by a trained technician. A patch test may be recommended if you have sensitive skin.',
      },
    ],
    image: '/images/treatments/brow-tinting.jpg',
  },

  // ---------------------------------------------------------------------------
  // HAIR REMOVAL
  // ---------------------------------------------------------------------------
  'laser-hair-removal': {
    slug: 'laser-hair-removal',
    name: 'Laser Hair Removal',
    category: 'hair-removal',
    shortDescription: 'Permanent hair reduction using advanced laser technology.',
    longDescription:
      'Laser hair removal uses concentrated light to target and destroy hair follicles, resulting in permanent hair reduction. Multiple sessions are needed as hair grows in cycles. It is effective on most body areas and provides long-lasting smooth skin.',
    whatToExpect:
      'The treatment area is cleaned and a cooling gel may be applied. The laser device is passed over the skin, delivering pulses of light. You may feel a snapping sensation. Sessions are quick (15-60 minutes depending on area). Hair falls out over 1-3 weeks.',
    priceRange: { min: 150, max: 500, currency: 'USD' },
    duration: '15-60 minutes',
    healingTime: 'None to 1 day',
    resultsLast: 'Permanent reduction',
    relatedTreatments: ['waxing', 'sugaring', 'threading'],
    faqs: [
      {
        question: 'How many sessions do I need?',
        answer:
          'Most people need 6-8 sessions spaced 4-6 weeks apart for optimal results. Maintenance sessions may be needed once or twice a year.',
      },
      {
        question: 'Does laser work on all skin tones?',
        answer:
          'Modern lasers work on most skin tones. However, it works best on dark hair and may be less effective on light, gray, or red hair.',
      },
    ],
    image: '/images/treatments/laser-hair-removal.jpg',
  },

  waxing: {
    slug: 'waxing',
    name: 'Waxing',
    category: 'hair-removal',
    shortDescription: 'Smooth, hair-free skin that lasts for weeks.',
    longDescription:
      'Waxing removes hair from the root using warm wax, providing smooth skin for 3-6 weeks. It can be done on virtually any body part and results in finer, sparser regrowth over time. Hard wax is typically used for sensitive areas while soft wax works well for larger areas.',
    whatToExpect:
      'Warm wax is applied in the direction of hair growth, then quickly removed. The process causes brief discomfort but becomes easier with regular treatments. Full body waxing takes 60-90 minutes while smaller areas take 15-30 minutes.',
    priceRange: { min: 25, max: 150, currency: 'USD' },
    duration: '15-90 minutes',
    healingTime: 'None to 1 day',
    resultsLast: '3-6 weeks',
    relatedTreatments: ['sugaring', 'laser-hair-removal', 'threading'],
    faqs: [
      {
        question: 'How long does hair need to be for waxing?',
        answer:
          'Hair should be about 1/4 inch (roughly 2-3 weeks of growth) for the wax to grip effectively.',
      },
      {
        question: 'Does waxing hurt?',
        answer:
          'There is some discomfort, but it lessens with regular treatments as hair becomes finer. Taking ibuprofen beforehand can help.',
      },
    ],
    image: '/images/treatments/waxing.jpg',
  },

  threading: {
    slug: 'threading',
    name: 'Threading',
    category: 'hair-removal',
    shortDescription: 'Precise hair removal for eyebrows and facial hair.',
    longDescription:
      'Threading is an ancient hair removal technique using twisted cotton thread to remove hair at the follicle level. It provides precise shaping for eyebrows and is gentle enough for sensitive facial skin. Results last 2-4 weeks.',
    whatToExpect:
      'Your technician uses a doubled cotton thread twisted in the middle. The thread is rolled over the skin to catch and remove hairs. Eyebrow threading takes about 10-15 minutes. Some redness may occur but subsides within an hour.',
    priceRange: { min: 15, max: 40, currency: 'USD' },
    duration: '10-30 minutes',
    healingTime: 'None',
    resultsLast: '2-4 weeks',
    relatedTreatments: ['waxing', 'brow-lamination', 'brow-tinting'],
    faqs: [
      {
        question: 'Is threading better than waxing for eyebrows?',
        answer:
          'Threading offers more precision and is better for sensitive skin. Waxing may be faster but can irritate delicate eye areas.',
      },
    ],
    image: '/images/treatments/threading.jpg',
  },

  sugaring: {
    slug: 'sugaring',
    name: 'Sugaring',
    category: 'hair-removal',
    shortDescription: 'Natural, gentle hair removal using sugar paste.',
    longDescription:
      'Sugaring is a natural hair removal method using a paste made from sugar, lemon, and water. It is gentler than waxing, removes hair in the direction of growth, and can extract shorter hairs. The natural ingredients make it ideal for sensitive skin.',
    whatToExpect:
      'A ball of sugar paste is applied against hair growth and flicked off in the direction of growth. This technique is less painful than waxing and causes less irritation. Sessions take similar time to waxing based on the area treated.',
    priceRange: { min: 35, max: 175, currency: 'USD' },
    duration: '15-90 minutes',
    healingTime: 'None',
    resultsLast: '3-6 weeks',
    relatedTreatments: ['waxing', 'laser-hair-removal', 'threading'],
    faqs: [
      {
        question: "What's the difference between sugaring and waxing?",
        answer:
          'Sugaring uses all-natural ingredients, removes hair in the direction of growth (less breakage), and can grab shorter hairs. It is generally less painful.',
      },
    ],
    image: '/images/treatments/sugaring.jpg',
  },

  // ---------------------------------------------------------------------------
  // BODY TREATMENTS
  // ---------------------------------------------------------------------------
  massage: {
    slug: 'massage',
    name: 'Massage',
    category: 'body-treatments',
    shortDescription: 'Relax, relieve tension, and rejuvenate with therapeutic massage.',
    longDescription:
      'Professional massage therapy uses various techniques to manipulate muscles and soft tissues, reducing stress, relieving pain, and promoting relaxation. Types include Swedish, deep tissue, hot stone, and sports massage. Regular massage supports overall wellness.',
    whatToExpect:
      'You will undress to your comfort level and lie on a massage table covered with sheets. Your therapist will use oils or lotions and various techniques based on your needs. Sessions typically last 60-90 minutes. Drink plenty of water after.',
    priceRange: { min: 75, max: 200, currency: 'USD' },
    duration: '60-90 minutes',
    healingTime: 'None',
    resultsLast: 'Variable',
    relatedTreatments: ['body-wraps', 'facials', 'spray-tan'],
    faqs: [
      {
        question: 'Which massage type is best for me?',
        answer:
          'Swedish is best for relaxation, deep tissue for chronic tension, sports for athletic recovery, and hot stone for deep relaxation and muscle relief.',
      },
    ],
    image: '/images/treatments/massage.jpg',
  },

  'body-sculpting': {
    slug: 'body-sculpting',
    name: 'Body Sculpting',
    category: 'body-treatments',
    shortDescription: 'Non-invasive fat reduction and body contouring.',
    longDescription:
      'Body sculpting treatments use various technologies (cryolipolysis, radiofrequency, ultrasound) to reduce stubborn fat and tighten skin without surgery. They target areas resistant to diet and exercise like the abdomen, thighs, and arms. Results develop over several weeks.',
    whatToExpect:
      'Treatment varies by technology. CoolSculpting freezes fat cells using applicators placed on target areas. Radiofrequency treatments heat tissue to promote collagen and fat reduction. Multiple sessions are typically needed for optimal results.',
    priceRange: { min: 500, max: 2000, currency: 'USD' },
    duration: '30-60 minutes',
    healingTime: 'None to 1 week',
    resultsLast: 'Permanent fat reduction',
    relatedTreatments: ['body-wraps', 'massage', 'spray-tan'],
    faqs: [
      {
        question: 'Is body sculpting a weight loss treatment?',
        answer:
          'No, body sculpting is for reducing stubborn fat pockets, not overall weight loss. Ideal candidates are close to their goal weight.',
      },
      {
        question: 'How many sessions do I need?',
        answer:
          'Most areas need 2-3 sessions spaced 4-6 weeks apart. Your provider will create a customized treatment plan.',
      },
    ],
    image: '/images/treatments/body-sculpting.jpg',
  },

  'spray-tan': {
    slug: 'spray-tan',
    name: 'Spray Tan',
    category: 'body-treatments',
    shortDescription: 'Get a sun-kissed glow without UV damage.',
    longDescription:
      'Spray tanning applies a fine mist of DHA-based solution to the skin, creating a natural-looking tan without sun exposure. It is a safe alternative to tanning beds and sun bathing. Results last 5-10 days depending on skin type and care.',
    whatToExpect:
      'Exfoliate and avoid moisturizer before your appointment. You will stand in a spray booth or have solution applied by a technician. The tan develops over 8-12 hours. Wear loose, dark clothing home and avoid water for at least 8 hours.',
    priceRange: { min: 25, max: 75, currency: 'USD' },
    duration: '15-30 minutes',
    healingTime: 'None',
    resultsLast: '5-10 days',
    relatedTreatments: ['body-wraps', 'massage', 'facials'],
    faqs: [
      {
        question: 'Will a spray tan look orange?',
        answer:
          'Quality solutions and experienced technicians create natural-looking tans. The key is choosing the right shade for your skin tone.',
      },
      {
        question: 'How do I make my tan last longer?',
        answer:
          'Moisturize daily, avoid long baths, pat dry instead of rubbing, and avoid exfoliating. Touch-ups can extend your tan.',
      },
    ],
    image: '/images/treatments/spray-tan.jpg',
  },

  'body-wraps': {
    slug: 'body-wraps',
    name: 'Body Wraps',
    category: 'body-treatments',
    shortDescription: 'Detoxify, hydrate, and smooth your skin with therapeutic wraps.',
    longDescription:
      'Body wraps apply nutrient-rich products to the skin, then wrap the body to enhance absorption. They can detoxify, hydrate, firm, and smooth the skin. Ingredients range from seaweed and mud to herbal blends. Results include temporary inch loss and improved skin texture.',
    whatToExpect:
      'You will undress and be covered with a treatment product (mud, seaweed, cream). Your body is wrapped in plastic or cloth, and you relax for 30-45 minutes. The product is rinsed off, and moisturizer is applied. Stay hydrated before and after.',
    priceRange: { min: 75, max: 200, currency: 'USD' },
    duration: '60-90 minutes',
    healingTime: 'None',
    resultsLast: 'Variable',
    relatedTreatments: ['massage', 'body-sculpting', 'spray-tan'],
    faqs: [
      {
        question: 'Do body wraps help with weight loss?',
        answer:
          'Body wraps can cause temporary inch loss due to fluid reduction, but this is not permanent weight loss. They are best for skin benefits.',
      },
    ],
    image: '/images/treatments/body-wraps.jpg',
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get treatment content by slug
 */
export function getTreatmentContent(slug: string): TreatmentContent | undefined {
  return TREATMENT_CONTENT[slug];
}

/**
 * Get all treatments in a category with full content
 */
export function getTreatmentsByCategory(category: TreatmentCategory): TreatmentContent[] {
  return Object.values(TREATMENT_CONTENT).filter((t) => t.category === category);
}

/**
 * Get related treatments with full content
 */
export function getRelatedTreatmentContent(slugs: string[]): TreatmentContent[] {
  return slugs
    .map((slug) => TREATMENT_CONTENT[slug])
    .filter((t): t is TreatmentContent => t !== undefined);
}
