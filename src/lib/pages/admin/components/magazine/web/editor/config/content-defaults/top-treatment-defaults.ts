export const topTreatmentDefaults = {
  BeforeAfterImages: {
    heroImage: "https://firebasestorage.googleapis.com/v0/b/glamlink-test.firebasestorage.app/o/magazine%2Ftemp%2Fcontent%2Fcontent_1755759674797_content_1755070512419_video-thumbnail-1755070512414.jpg?alt=media&token=43fb0418-fe47-489a-81db-c25cfa391c9f",
    heroVideoSettings: {
      videoType: "file",
      video: "https://firebasestorage.googleapis.com/v0/b/glamlink-test.firebasestorage.app/o/magazine%2Ftemp%2Ffield_video%2Fvideo_1755759711087_video_1755057547988_Untitled%20design-2.mp4?alt=media&token=bcf363dd-4387-4497-8d06-ce16df900810"
    },
    beforeImage: {
      url: "https://firebasestorage.googleapis.com/v0/b/glamlink-test.firebasestorage.app/o/magazine%2Ftemp%2Fcontent%2Fcontent_1755759782147_content_1755054070207_IMG_8413.jpg?alt=media&token=659e9ffe-9095-4d58-a720-c91714491f06",
      objectFit: "cover"
    },
    afterImage: {
      url: "https://firebasestorage.googleapis.com/v0/b/glamlink-test.firebasestorage.app/o/magazine%2Ftemp%2Fcontent%2Fcontent_1755759751961_content_1755054055936_IMG_8412.jpg?alt=media&token=51485ec5-c0d8-4dc5-9ab6-b20b522e88a8",
      objectFit: "cover"
    },
    caption: ""
  },
  
  TreatmentDetails: {
    treatmentName: "Jet Plasma",
    benefitsTitle: "Key Benefits:",
    benefitsTitleTypography: {
      fontWeight: "font-bold",
      fontSize: "text-xl md:text-2xl",
      color: "text-gray-900"
    },
    benefits: [
      "Evens Skin Tone & Texture",
      "No Numbing, No Pain, No Downtime",
      "Helps With Acne, Acne Scars, Hyperpigmentation & Melasma",
      "Treats Fine Lines & Wrinkles, Stretch Marks And So Much More",
      "Seamlessly Integrates With Advanced Treatments"
    ],
    treatmentStats: [
      {
        icon: "⏱️",
        label: "Duration",
        value: "30-60 mins",
        backgroundColor: "#BCECF1"
      },
      {
        icon: "📅",
        label: "Frequency",
        value: "Weekly-Monthly",
        backgroundColor: "#BCECF1"
      },
      {
        icon: "💰",
        label: "Price Range",
        value: "$200+",
        backgroundColor: "#BCECF1"
      }
    ],
    backgroundColor: "#f3f4f6"
  },
  
  ProInsights: {
    title: "Pro Insights",
    backgroundColor: "#ffffff",
    insights: [
      {
        author: "Melanie Marks",
        quote: "Jet Plasma is my most requested treatment. Clients love they can see immediate results with no downtime.",
        proImage: {
          url: "https://firebasestorage.googleapis.com/v0/b/glamlink-test.firebasestorage.app/o/magazine%2Ftemp%2Fcontent%2Fcontent_1755763409409_content_1755050306701_IMG_4927.jpg?alt=media&token=6b9ef7a9-3fcf-4531-8927-ffa525c2f6bc",
          objectFit: "cover",
          objectPositionX: 0,
          objectPositionY: 10
        }
      }
    ]
  },
  
  RichContent: {
    introduction: {
      title: "A Closer Look",
      titleTag: "h3",
      titleStyles: {
        color: "text-glamlink-teal",
        alignment: "left",
        fontSize: "text-2xl md:text-3xl",
        fontWeight: "font-bold",
        fontFamily: "font-sans"
      },
      content: "<p>In the fast-paced world of beauty, few treatments have sparked as much intrigue and devotion as Jet Plasma. Heralded as the <em>pain-free evolution of skin rejuvenation</em>, this cutting-edge technology delivers results once reserved for the most invasive procedures. With the ability to refine, smooth, and transform without needles or downtime, Jet Plasma isn't just a trend - it's redefining the future of advanced skincare and earning its place as the industry's new obsession.</p><p>Jet Plasma is a non-invasive, skin rejuvenation technology that delivers a powerful stream of 13,000 volts of plasma energy deep into the dermis. Unlike traditional treatments that focus on the surface, Jet Plasma works from the inside out, stimulating collagen production, remodeling skin tissue, and jumpstarting the body's natural healing response without breaking the skin. The sensation? Surprisingly gentle. Clients describe it as a warm, slightly tingly feeling with no numbing cream, no downtime, and no recovery period. This makes it a dream option for those who want visible, transformative results without the inconvenience of days spent hiding redness or swelling.</p>",
      enableDropCap: false,
      dropCapStyle: "classic"
    },
    
    expectedResults: {
      title: "Expected Results:",
      titleTag: "h3",
      titleStyles: {
        fontSize: "text-xl md:text-2xl",
        fontWeight: "font-bold",
        alignment: "left",
        color: "text-gray-900",
        fontFamily: "font-sans"
      },
      content: "<p><span style=\"color: rgb(55, 65, 81); font-size: medium;\">Most clients notice an immediate improvement in tone and texture, with continued results developing over the next several weeks. Depending on your skin's natural cellular turnover (typically 28–45 days) and the number of treatments completed, benefits can last anywhere from 1–3 months. For longer-lasting results, a consistent treatment plan is recommended.</span></p>",
      enableDropCap: false
    },
    
    goodToKnow: {
      title: "Good to Know:",
      titleTag: "h3",
      titleStyles: {
        fontWeight: "font-bold",
        color: "text-gray-900",
        fontFamily: "font-sans",
        alignment: "left",
        fontSize: "text-xl md:text-2xl"
      },
      content: "<p><span style=\"color: rgb(55, 65, 81); font-size: medium;\">Pro Tip: Combine with LED therapy for enhanced results and offer as a premium package.</span></p>",
      enableDropCap: false,
      backgroundColor: "#BCECF1"
    }
  }
};