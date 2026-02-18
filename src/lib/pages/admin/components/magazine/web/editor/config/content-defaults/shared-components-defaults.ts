// Default configurations for shared components

export const sharedComponentsDefaults = {
  MediaItem: {
    title: "Featured Media",
    titleTypography: {
      fontSize: "text-2xl md:text-3xl",
      fontFamily: "font-sans",
      fontWeight: "font-bold",
      fontStyle: "",
      textDecoration: "",
      color: "text-gray-900",
      alignment: "left"
    },
    description: "This is a featured media item that can display either an image or video with full typographic control.",
    descriptionTypography: {
      fontSize: "text-base",
      fontFamily: "font-sans",
      fontWeight: "font-normal",
      fontStyle: "",
      textDecoration: "",
      color: "text-gray-700",
      alignment: "left"
    },
    caption: "Professional media content showcasing our latest features and offerings.",
    captionTypography: {
      fontSize: "text-sm",
      fontFamily: "font-sans",
      fontWeight: "font-normal",
      fontStyle: "italic",
      textDecoration: "",
      color: "text-gray-600",
      alignment: "center"
    },
    mediaSettings: {
      image: "/images/placeholder.png",
      videoSettings: {
        videoType: "none",
        video: null,
        videoUrl: ""
      }
    },
    className: ""
  },

  Stats: {
    title: "Key Statistics",
    titleTypography: {
      fontSize: "text-xl",
      fontFamily: "font-sans",
      fontWeight: "font-bold",
      fontStyle: "",
      textDecoration: "",
      color: "text-gray-900",
      alignment: "left"
    },
    items: [
      {
        icon: "P",
        title: "Active Users",
        subtitle: "Monthly active users",
        value: "10K+"
      },
      {
        icon: "Q",
        title: "Satisfaction",
        subtitle: "Customer satisfaction rate",
        value: "98%"
      },
      {
        icon: "R",
        title: "Professionals",
        subtitle: "Verified professionals",
        value: "500+"
      },
      {
        icon: "S",
        title: "Services",
        subtitle: "Services offered",
        value: "100+"
      }
    ],
    layout: "grid",
    columns: "2",
    className: "",
    itemClassName: ""
  },

  CTAStat: {
    title: "Your Current Balance",
    titleTypography: {
      fontSize: "text-lg",
      fontFamily: "font-sans",
      fontWeight: "font-semibold",
      fontStyle: "",
      textDecoration: "",
      color: "text-gray-900",
      alignment: "left"
    },
    stat: "1,234 🥯",
    statTypography: {
      fontSize: "text-3xl font-bold",
      fontFamily: "font-sans",
      fontWeight: "font-bold",
      fontStyle: "",
      textDecoration: "",
      color: "text-glamlink-purple",
      alignment: "left"
    },
    ctaText: "Earn More Coins",
    ctaLink: {
      url: "/earn",
      action: "link"
    },
    secondaryCTAText: "View Details",
    secondaryCTALink: {
      url: "/balance",
      action: "link"
    }
  },

  SectionHeader: {
    title: "Section Title",
    titleStyles: {
      fontSize: "text-2xl",
      fontFamily: "font-sans",
      fontWeight: "font-bold",
      fontStyle: "",
      textDecoration: "",
      color: "text-gray-900",
      alignment: "left"
    },
    subtitle: "Section subtitle or description",
    subtitleStyles: {
      fontSize: "text-xl",
      fontFamily: "font-sans",
      fontWeight: "font-semibold",
      fontStyle: "",
      textDecoration: "",
      color: "text-gray-700",
      alignment: "left"
    },
    subtitle2: "Optional third line of text",
    subtitle2Styles: {
      fontSize: "text-base",
      fontFamily: "font-sans",
      fontWeight: "font-normal",
      fontStyle: "",
      textDecoration: "",
      color: "text-gray-500",
      alignment: "left"
    }
  },

  BusinessProfile: {
    businessMediaSettings: {
      image: "/images/placeholder.png",
      videoSettings: {
        video: null,
        videoUrl: ""
      }
    },
    businessName: "Your Business Name",
    businessNameTypography: {
      fontSize: "text-4xl lg:text-5xl",
      fontFamily: "font-sans",
      fontWeight: "font-bold",
      color: "text-glamlink-purple"
    },
    businessTitle: "Your professional tagline or description",
    businessTitleTypography: {
      fontSize: "text-xl",
      fontFamily: "font-sans",
      fontWeight: "font-normal",
      color: "text-gray-600"
    },
    businessTitle2: "Additional business information",
    businessTitle2Typography: {
      fontSize: "text-2xl",
      fontFamily: "font-sans",
      fontWeight: "font-medium",
      color: "text-gray-900"
    },
    bioTitle: "About",
    bioTitleTag: "h3",
    bioTitleTypography: {
      fontSize: "text-2xl",
      fontFamily: "font-sans",
      fontWeight: "font-semibold",
      color: "text-gray-900"
    },
    bio: "<p>Tell your business story here. Share your mission, values, and what makes your business unique.</p>",
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    quoteTypography: {
      fontSize: "text-lg",
      fontFamily: "font-serif",
      fontWeight: "font-normal",
      fontStyle: "italic",
      color: "text-gray-800"
    },
    quoteAuthor: "Winston Churchill",
    quoteAuthorTypography: {
      fontSize: "text-base",
      fontFamily: "font-sans",
      fontWeight: "font-normal",
      color: "text-gray-600",
      alignment: "left"
    },
    quoteOverImage: false,
    quoteBgClassName: "bg-gray-100/95",
    bioBgClassName: "bg-white"
  },

  SectionDivider: {
    lineStyle: "solid",
    lineColor: "border-gray-300",
    lineWidth: 1,
    spacing: "medium"
  },

  HTMLContent: {
    content: "<div>Custom HTML</div>",
    contentTypography: {
      fontSize: "text-base",
      fontFamily: "font-sans",
      fontWeight: "font-normal",
      fontStyle: "",
      textDecoration: "",
      color: "text-gray-900",
      alignment: "left"
    },
    className: ""
  }
};