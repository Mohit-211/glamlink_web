export const topProductSpotlightDefaults = {
  ProductDetails: {
    productName: "Advanced Acne Med",
    productNameTypography: {
      fontSize: "text-2xl md:text-3xl",
      fontFamily: "font-sans",
      fontWeight: "font-bold",
      color: "text-gray-900"
    },
    brandName: "Face Reality",
    brandNameTypography: {
      fontSize: "text-lg",
      fontFamily: "font-sans",
      fontWeight: "font-medium",
      color: "text-gray-600"
    },
    price: "34",
    isBestseller: true,
    bestsellerLabel: "GREAT PRODUCT",
    description: "Face Reality Advanced Acne Med is a water-based benzoyl peroxide gel available in three strengths - mild (2.5%), moderate (5%), and maximum (10%), allowing for a tailored approach to clearing acne. Powered by Micro-Smooth Technology™, this formula combines micronized benzoyl peroxide to target acne-causing bacteria, unclog pores, and calm irritation. For best results, Acne Med pairs beautifully with a complete Face Reality regimen designed by a trained professional.",
    image: {
      url: "https://firebasestorage.googleapis.com/v0/b/glamlink-test.firebasestorage.app/o/magazine%2Ftemp%2Fcontent%2Fcontent_1755764734126_content_1755098868921_76972%20(1).jpg?alt=media&token=74afd4ab-81d4-45d7-989b-4eede969a9cd",
      objectFit: "cover"
    },
    imageAutoHeight: true,
    keyFeaturesTitle: "Why We Love It",
    keyFeatures: [
      "Targets acne-causing bacteria deep within the pores",
      "Helps prevent new breakouts and reduces inflammation"
    ],
    ingredientsTitle: "Key Ingredients",
    ingredients: [
      "Benzoyl Peroxide (2.5%, 5%, and 10%)",
      "Sodium Hyaluronate",
      "Bisabolol",
      "Glycerin",
      "Propanediol"
    ],
    proRecommendation: {
      proName: "Melanie Marks",
      quote: "As a licensed esthetician, I often recommend the Face Reality® regimen to my acne-prone clients for its targeted, proven results. On a personal note, I struggled with stubborn perioral dermatitis for over a year, despite trying multiple prescription ointments from dermatologists. Once I incorporated Face Reality's Acne Med into my routine, the difference was remarkable. It cleared and calmed my skin when nothing else worked. For best results, I recommend pairing it with the complete Face Reality system to support and protect the skin barrier while treating breakouts.",
      proImage: {
        url: "https://firebasestorage.googleapis.com/v0/b/glamlink-test.firebasestorage.app/o/magazine%2Ftemp%2Fcontent%2Fcontent_1755765584462_content_1755105306305_IMG_8435.JPG?alt=media&token=44d57af9-fcad-477a-8518-a2b2fdb36463",
        objectFit: "cover",
        objectPositionX: 0,
        objectPositionY: 42
      }
    },
    reviewHighlightsTitle: "What Customers Say:",
    reviewHighlights: [
      "I love Face Reality! It's the only thing I trust for my sensitive skin",
      "My teen's skin finally cleared when nothing else worked, this was the only product that made a real difference.",
      "My breakouts started clearing within weeks. My skin feels calmer, smoother, and so much healthier."
    ],
    backgroundColor: "transparent"
  },
  
  PhotoGalleryProducts: {
    title: "You Might Also Like",
    titleTypography: {
      fontSize: "text-2xl",
      fontFamily: "font-sans",
      fontWeight: "font-bold",
      color: "text-gray-900",
      alignment: "center"
    },
    columns: "responsive",
    imageStyling: "auto-height",
    cardBackgroundColor: "#ffffff",
    products: [
      {
        title: "Ultra Gentle Cleanser",
        description: "$20",
        titleTypography: {
          fontSize: "text-lg",
          fontWeight: "font-semibold",
          color: "text-gray-900"
        },
        descriptionTypography: {
          fontWeight: "font-bold",
          color: "text-gray-900",
          fontSize: "text-lg"
        },
        image: {
          url: "https://firebasestorage.googleapis.com/v0/b/glamlink-test.firebasestorage.app/o/magazine%2Ftemp%2Fcontent%2Fcontent_1755765857327_content_1755108499816_UGC_Face%20Reality-2.png?alt=media&token=6e976890-b031-424b-afdf-bc5312db16bc",
          objectFit: "cover"
        }
      },
      {
        title: "Sulfur Spot Treatment",
        description: "$40",
        titleTypography: {
          fontSize: "text-lg",
          fontWeight: "font-semibold",
          color: "text-gray-900"
        },
        descriptionTypography: {
          fontSize: "text-lg",
          fontWeight: "font-bold",
          color: "text-gray-900"
        },
        image: {
          url: "https://firebasestorage.googleapis.com/v0/b/glamlink-test.firebasestorage.app/o/magazine%2Ftemp%2Fcontent%2Fcontent_1755766759669_content_1755107958439_IMG_8437.jpg?alt=media&token=a8ee0a1c-eb08-4a86-971b-6a568495fee8",
          objectFit: "cover"
        }
      }
    ]
  },
  
  SimilarProducts: {
    title: "You May Also Like",
    titleTypography: {
      fontSize: "text-2xl",
      fontFamily: "font-sans",
      fontWeight: "font-bold",
      color: "text-gray-900",
      alignment: "center"
    },
    backgroundColor: "#f9fafb",
    products: [
      {
        name: "Mandelic Face and Body Wash",
        price: "$28",
        image: "/images/placeholder.png",
        link: "https://facerealityskincare.com"
      },
      {
        name: "Barrier Balance Creamy Cleanser",
        price: "$24",
        image: "/images/placeholder.png",
        link: "https://facerealityskincare.com"
      },
      {
        name: "Hydrabalance Hydrating Gel",
        price: "$36",
        image: "/images/placeholder.png",
        link: "https://facerealityskincare.com"
      }
    ]
  }
};