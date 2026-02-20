export const mariesCornerDefaults = {
  AuthorBadge: {
    authorName: "Marie Matteucci",
    authorTitle: "Founder of MAYARI Skincare",
    authorImage: {
      url: "https://firebasestorage.googleapis.com/v0/b/glamlink-demo.firebasestorage.app/o/magazine%2Ftemp%2Fcontent%2Fcontent_1754938124116_IMG_8053.JPEG?alt=media&token=b362215d-9a17-42dc-9a79-10f3144f799f",
      objectFit: "cover",
      objectPositionX: 0,
      objectPositionY: 0
    },
    badgeText: "FOUNDING PRO",
    badgePosition: "bottom-center",
    badgeFontSize: "text-xs",
    imageWidth: 150,
    imageHeight: 150,
    nameTypography: {
      color: "text-glamlink-teal",
      fontStyle: "",
      fontSize: "text-xl",
      fontFamily: "font-sans",
      alignment: "center",
      fontWeight: "font-medium"
    },
    titleTypography: {
      fontFamily: "font-sans",
      fontSize: "text-base",
      alignment: "center",
      color: "text-gray-600",
      fontStyle: "",
      fontWeight: "font-normal"
    }
  },
  
  QuoteBlock: {
    quote: "There's no quicker way to look older than your age than to have dry skin",
    author: "Marie Matteucci",
    authorTitle: "Licensed Aesthetician",
    backgroundImage: "https://firebasestorage.googleapis.com/v0/b/glamlink-test.firebasestorage.app/o/magazine%2Ftemp%2Fcontent%2Fcontent_1755675492082_IMG_8465.jpg?alt=media&token=affa84fc-ebe7-4fad-a35a-90dca7533338",
    quoteStyle: "inline",
    quoteAlignment: "bottom-center"
  },
  
  RichContent: {
    title: "Why I Advise Against Retinol Use",
    titleTag: "h3",
    titleStyles: {
      fontSize: "text-xl md:text-2xl",
      color: "text-gray-900",
      alignment: "left",
      fontFamily: "font-sans",
      fontWeight: "font-bold"
    },
    content: `<p>When I first became a licensed aesthetician, I went straight to work at a medical spa. Retinol was everywhere, prescribed to anyone who asked for it. Many of those patients would end up in my treatment room.</p><p>Fresh out of aesthetics school, I still carried the weight of textbook teachings. I'd been a skincare devotee my entire life, devouring ingredient research and product studies, I thought I knew exactly how skin should be treated. But it didn't take long to realize that much of what I'd been taught conflicted with what I was seeing in real life.</p><p>Client after client arrived with the same issues after weeks of retinol use: dryness, dehydration, redness, irritation, heightened sensitivity and in some cases, an increase in hyperpigmentation (brown spots). My initial advice was to reduce usage to one or two nights a week, allowing skin time to adjust. But even then, the problems persisted. It wasn't until I had clients stop retinol completely that their skin truly improved.</p><p>The mainstream belief is that retinol is the gold standard in anti-aging because it speeds up cellular turnover. In my experience, it often does the opposite, accelerating visible aging by stripping the skin of its moisture. I always tell people, "There's no quicker way to look older than your age than to have dry skin".</p><p>Many people are disappointed to hear this, given retinol's growing reputation. But skincare is not a "one size fits all" science, and popularity doesn't guarantee truth. My advice for a youthful complexion? Keep skin consistently hydrated and moisturized, ideally with monthly professional treatments that include advance exfoliation, such as dermaplaning, to restore that luminous, healthy glow.</p><p>I'll never forget one man who swore retinol had transformed his skin. He'd been using it for three years, until I looked up his product and discovered it didn't contain a drop of retinol. He'd achieved great skin without it, proving my point entirely.</p><p>If you want to age beautifully, focus on a non-comedogenic skincare routine, morning and night, that includes cleansing, a targeted serum, moisturizer, and eye cream if needed. The true secret to timeless skin isn't in a bottle of retinol, it's in keeping the skin healthy.</p>`,
    enableDropCap: true,
    dropCapStyle: "classic",
    dropCapColor: "",
    className: ""
  },
  
  SocialFollow: {
    socialLink: {
      platform: "Glamlink",
      handle: "mmmbeautysecrets",
      followText: "Follow Marie",
      qrCode: "https://apps.apple.com/us/app/glamlink/id6502334118"
    }
  },
  
  NumberedTips: {
    title: "{count} Pro Tips For Youthful, Healthy Skin",
    displayNumbers: true,
    tips: [
      {
        number: "1",
        title: "Hydrate & Moisturize",
        content: "Keep skin supple with products that lock in moisture. Dry skin will age you fast!"
      },
      {
        number: "2",
        title: "Professional Care Counts",
        content: "Schedule monthly treatments with a licensed aesthetician for advanced exfoliation and deep nourishment."
      },
      {
        number: "3",
        title: "Routine Is Everything",
        content: "Commit to a morning and evening regimen with a cleanser, targeted serum, moisturizer and SPF."
      }
    ]
  },
  
  PhotoGallery: {
    title: "PHOTO GALLERY",
    columns: "1",
    imageStyling: "auto-height",
    photos: [
      {
        image: "https://firebasestorage.googleapis.com/v0/b/glamlink-demo.firebasestorage.app/o/magazine%2Ftemp%2Fcontent%2Fcontent_1755056724535_Marie-15641.jpg?alt=media&token=69cf484e-82a0-40e6-b28c-830855725762",
        caption: "Editor In Chief & CEO",
        alt: "Marie Marks - Editor In Chief"
      },
      {
        image: "https://firebasestorage.googleapis.com/v0/b/glamlink-demo.firebasestorage.app/o/magazine%2Ftemp%2Fcontent%2Fcontent_1755056415321_IMG_5034.jpg?alt=media&token=5f0b1a2e-af88-4a73-ae47-eb53ef66ec4c",
        caption: "My Why That Fuels The Journey",
        alt: "Glamlink Journey"
      },
      {
        image: "https://firebasestorage.googleapis.com/v0/b/glamlink-demo.firebasestorage.app/o/magazine%2Ftemp%2Fcontent%2Fcontent_1755278387835_IMG_3683.jpg?alt=media&token=6867a95f-6703-4117-8520-ace865df6a67",
        caption: "IECSC July 2025",
        alt: "IECSC Event"
      }
    ]
  }
};