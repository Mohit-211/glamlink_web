import { ContentComponentInfo } from './types';

export const sharedComponents: ContentComponentInfo[] = [
  {
    name: "CallToAction",
    category: "shared",
    displayName: "Call to Action / Join Movement",
    description: "Hero CTA with optional background, bullets, and QR code",
    propFields: [
      // Hero Section
      { name: "heroHeadline", label: "Hero Headline", type: "text", placeholder: "Be Seen. Be Booked. Be Glam." },
      { name: "heroHeadlineTypography", label: "Hero Headline Typography", type: "typography-group" },
      { name: "heroSubheadline", label: "Hero Subheadline", type: "text", placeholder: "Your journey starts here" },
      { name: "heroSubheadlineTypography", label: "Hero Subheadline Typography", type: "typography-group" },
      { name: "backgroundImage", label: "Background Image", type: "image", placeholder: "Upload background image" },
      { name: "useOverlayStyle", label: "Use Dark Overlay", type: "checkbox", helperText: "Adds dark overlay for better text readability" },
      
      // How to Get Featured Section
      { name: "howToGetFeaturedTitle", label: "How to Get Featured Title", type: "text", placeholder: "How to Get Featured" },
      { name: "howToGetFeaturedTitleTypography", label: "Featured Title Typography", type: "typography-group" },
      { name: "bullets", label: "How to Get Featured List", type: "array", itemType: "text", placeholder: "Add bullet points", maxItems: 6 },
      
      // CTA Section
      { name: "ctaHeadline", label: "CTA Headline", type: "text", placeholder: "Join the Movement" },
      { name: "ctaHeadlineTypography", label: "CTA Headline Typography", type: "typography-group" },
      { name: "ctaBackgroundColor", label: "CTA Section Background", type: "background-color", placeholder: "bg-gray-50 or #f9fafb", helperText: "Background color for CTA section only" },
      { name: "description", label: "CTA Description", type: "textarea", placeholder: "Optional description" },
      { name: "ctaButtonText", label: "CTA Button Text", type: "text", placeholder: "Join Glamlink" },
      { name: "ctaButtonLink", label: "CTA Button Link", type: "link-action", placeholder: "Button action or link" },
      { name: "ctaQrCode", label: "QR Code Link", type: "text", placeholder: "URL to generate QR code or image path" },
      { name: "ctaTagline", label: "CTA Tagline", type: "text", placeholder: "Additional tagline" },
      { name: "ctaTaglineTypography", label: "CTA Tagline Typography", type: "typography-group" },

      // Legacy fields (hidden but kept for compatibility)
      { name: "darkMode", label: "Dark Mode", type: "checkbox" },
    ],
  },
  {
    name: "PhotoGallery",
    category: "shared",
    displayName: "Photo Gallery",
    description: "Grid of images with captions",
    propFields: [
      { name: "title", label: "Gallery Title", type: "text", placeholder: "Photo Gallery" },
      {
        name: "titleTypography",
        label: "Title Typography",
        type: "typography-group",
        showTag: true,
        defaultTag: "h3",
        defaultValue: {
          fontSize: "text-lg",
          fontFamily: "font-sans",
          fontWeight: "font-bold",
          fontStyle: "",
          textDecoration: "",
          color: "text-gray-900",
          alignment: "left",
          tag: "h3"
        }
      },
      { name: "columns", label: "Number of Columns", type: "select", options: [
        { value: "responsive", label: "Scale by screen size" },
        { value: "1", label: "1 Column" },
        { value: "2", label: "2 Columns" },
        { value: "3", label: "3 Columns" },
      ], defaultValue: "2" },
      { name: "imageStyling", label: "Image Styling", type: "select", options: [
        { value: "same-height", label: "Same Height (Square)" },
        { value: "auto-height", label: "Auto Height (Natural Aspect Ratio)" },
      ], defaultValue: "same-height" },
      { 
        name: "photos", 
        label: "Photos", 
        type: "array", 
        placeholder: "Add photos to gallery",
        maxItems: 12,
        itemType: "object",
        fields: [
          { name: "image", label: "Image", type: "image", required: true },
          { name: "caption", label: "Caption", type: "text", placeholder: "Optional caption" },
          { name: "alt", label: "Alt Text", type: "text", placeholder: "Description for accessibility" },
        ]
      },
    ],
  },
  {
    name: "PhotoGalleryProducts",
    category: "shared",
    displayName: "Product Gallery Cards",
    description: "Grid of product cards with images and text",
    propFields: [
      { name: "title", label: "Gallery Title", type: "text", placeholder: "Product Gallery" },
      { name: "titleTypography", label: "Title Typography", type: "typography-group" },
      { 
        name: "columns", 
        label: "Number of Columns", 
        type: "select", 
        options: [
          { value: "1", label: "1 Column" },
          { value: "2", label: "2 Columns" },
          { value: "3", label: "3 Columns" },
          { value: "responsive", label: "Responsive (1-3)" },
        ],
        defaultValue: "responsive" 
      },
      {
        name: "imageStyling",
        label: "Image Styling",
        type: "select",
        options: [
          { value: "same-height", label: "Same Height (Square)" },
          { value: "auto-height", label: "Auto Height (Natural Aspect Ratio)" },
        ],
        defaultValue: "same-height",
        helperText: "Auto Height displays images at natural aspect ratio on mobile/tablet (md and below)"
      },
      { name: "cardBackgroundColor", label: "Card Background Color", type: "background-color", placeholder: "bg-white or #ffffff", defaultValue: "bg-white" },
      {
        name: "products",
        label: "Product Items",
        type: "array",
        itemType: "object",
        maxItems: 12,
        fields: [
          { name: "image", label: "Product Image", type: "image", required: true },
          { name: "title", label: "Product Title", type: "text", placeholder: "Product name" },
          { name: "titleTypography", label: "Title Typography", type: "typography-group" },
          { name: "description", label: "Product Description", type: "text", placeholder: "Brief description" },
          { name: "descriptionTypography", label: "Description Typography", type: "typography-group" },
        ]
      },
    ],
  },
  {
    name: "RichContent",
    category: "shared",
    displayName: "Rich Text Content",
    description: "HTML content with optional title",
    propFields: [
      { name: "title", label: "Title", type: "text", placeholder: "Enter title (optional)" },
      {
        name: "titleStyles",
        label: "Title Typography",
        type: "typography-group",
        showTag: true,
        defaultTag: "h2",
        defaultValue: {
          fontSize: "text-2xl",
          fontFamily: "font-sans",
          fontWeight: "font-bold",
          fontStyle: "",
          textDecoration: "",
          color: "text-gray-900",
          alignment: "left",
          tag: "h2"
        }
      },
      { name: "content", label: "Content", type: "richtext", placeholder: "Enter formatted content" },
      { name: "enableDropCap", label: "Enable Drop Cap", type: "checkbox", defaultValue: false },
      { name: "dropCapStyle", label: "Drop Cap Style", type: "select", options: [
        { value: "classic", label: "Classic" },
        { value: "modern", label: "Modern" },
        { value: "elegant", label: "Elegant" }
      ], defaultValue: "classic" },
      { name: "dropCapColor", label: "Drop Cap Color", type: "select", options: [
        { value: "", label: "Default" },
        { value: "text-glamlink-purple", label: "Purple" },
        { value: "text-glamlink-teal", label: "Teal" },
        { value: "text-gray-900", label: "Black" },
        { value: "text-gray-600", label: "Gray" }
      ], defaultValue: "" },
      { name: "className", label: "CSS Classes", type: "text", placeholder: "Additional CSS classes" },
    ],
  },
  {
    name: "SectionHeader",
    category: "shared",
    displayName: "Section Header",
    description: "Title and subtitle header",
    propFields: [
      { name: "title", label: "Title", type: "text", placeholder: "Section title" },
      { name: "titleStyles", label: "Title Typography", type: "typography-group", defaultValue: {
        fontSize: "text-2xl",
        fontFamily: "font-sans",
        fontWeight: "font-bold",
        fontStyle: "",
        textDecoration: "",
        color: "text-gray-900",
        alignment: "left"
      }},
      { name: "subtitle", label: "Subtitle", type: "text", placeholder: "Section subtitle" },
      { name: "subtitleStyles", label: "Subtitle Typography", type: "typography-group", defaultValue: {
        fontSize: "text-xl",
        fontFamily: "font-sans",
        fontWeight: "font-semibold",
        fontStyle: "",
        textDecoration: "",
        color: "text-gray-700",
        alignment: "left"
      }},
      { name: "subtitle2", label: "Additional Subtitle", type: "text", placeholder: "Optional third line" },
      { name: "subtitle2Styles", label: "Subtitle2 Typography", type: "typography-group", defaultValue: {
        fontSize: "text-base",
        fontFamily: "font-sans",
        fontWeight: "font-normal",
        fontStyle: "",
        textDecoration: "",
        color: "text-gray-500",
        alignment: "left"
      }},
    ],
  },
  {
    name: "SocialLinks",
    category: "shared",
    displayName: "Social Media Links",
    description: "Social media icon links",
    propFields: [
      { name: "title", label: "Title", type: "text", placeholder: "e.g., Follow Us" },
      { name: "titleTypography", label: "Title Typography", type: "typography-group", defaultValue: {
        fontSize: "text-xl",
        fontFamily: "font-sans",
        fontWeight: "font-semibold",
        fontStyle: "",
        textDecoration: "",
        color: "text-gray-900",
        alignment: "center"
      }},
      { 
        name: "profileImage", 
        label: "Profile Image", 
        type: "image",
        helperText: "Circular avatar image displayed between title and buttons"
      },
      { 
        name: "profileImageWidth", 
        label: "Image Width (px)", 
        type: "number", 
        defaultValue: 150,
        placeholder: "150",
        helperText: "Width of the circular image in pixels"
      },
      { 
        name: "profileImageHeight", 
        label: "Image Height (px)", 
        type: "number", 
        defaultValue: 150,
        placeholder: "150",
        helperText: "Height of the circular image in pixels"
      },
      { 
        name: "profileImageBorderColor", 
        label: "Image Border Color", 
        type: "background-color",
        defaultValue: "#f5e6d3",
        helperText: "Color of the border around the circular image"
      },
      { 
        name: "socialHandle", 
        label: "Social Handle", 
        type: "text",
        placeholder: "@username",
        helperText: "Social media handle or username to display"
      },
      { 
        name: "socialHandleTypography", 
        label: "Social Handle Typography", 
        type: "typography-group",
        defaultValue: {
          fontSize: "text-lg",
          fontFamily: "font-sans",
          fontWeight: "font-medium",
          fontStyle: "",
          textDecoration: "",
          color: "text-gray-700",
          alignment: "center"
        }
      },
      { 
        name: "links", 
        label: "Social Links", 
        type: "array", 
        placeholder: "Add social media links",
        maxItems: 10,
        itemType: "object",
        fields: [
          { 
            name: "platform", 
            label: "Platform", 
            type: "select", 
            options: [
              { value: "instagram", label: "Instagram" },
              { value: "facebook", label: "Facebook" },
              { value: "twitter", label: "Twitter/X" },
              { value: "linkedin", label: "LinkedIn" },
              { value: "youtube", label: "YouTube" },
              { value: "tiktok", label: "TikTok" },
              { value: "pinterest", label: "Pinterest" },
              { value: "website", label: "Website" },
              { value: "glamlink", label: "Glamlink Profile" },
              { value: "custom", label: "Custom Link" }
            ],
            required: true 
          },
          { name: "url", label: "URL", type: "link-action", placeholder: "Enter link", required: true },
          { name: "label", label: "Custom Label", type: "text", placeholder: "Optional custom label" }
        ]
      },
    ],
  },
  {
    name: "VideoEmbed",
    category: "shared",
    displayName: "Video Embed",
    description: "Embedded video player",
    propFields: [
      { name: "videoUrl", label: "Video URL", type: "url", placeholder: "YouTube or Vimeo URL" },
      { name: "title", label: "Video Title", type: "text", placeholder: "Video title" },
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", options: [
        { value: "16:9", label: "16:9" },
        { value: "4:3", label: "4:3" },
        { value: "1:1", label: "Square" },
      ], defaultValue: "16:9" },
    ],
  },
  {
    name: "VideoBlock",
    category: "shared",
    displayName: "Video Block",
    description: "Video with thumbnail selection and width controls",
    propFields: [
      { name: "videoUrl", label: "Video URL", type: "url", placeholder: "YouTube or direct video URL" },
      { name: "videoFile", label: "Or Upload Video", type: "video", helperText: "Upload a video file directly" },
      {
        name: "thumbnail",
        label: "Video Thumbnail",
        type: "video-thumbnail",
        helperText: "Extract thumbnail from video or upload custom image"
      },
      {
        name: "containerWidth",
        label: "Container Width",
        type: "select",
        options: [
          { value: "100%", label: "Full Width (100%)" },
          { value: "75%", label: "Large (75%)" },
          { value: "50%", label: "Medium (50%)" },
          { value: "33%", label: "Small (33%)" },
          { value: "25%", label: "Extra Small (25%)" }
        ],
        defaultValue: "100%",
        helperText: "Width as percentage - height scales automatically"
      },
      { name: "showPlayButton", label: "Show Play Button", type: "checkbox", defaultValue: true, helperText: "Display play button overlay on thumbnail" },
      { name: "borderRadius", label: "Border Radius (px)", type: "number", defaultValue: 8 },
      { name: "title", label: "Title", type: "text", placeholder: "Optional title above video" },
      { name: "titleTypography", label: "Title Typography", type: "typography-group", showAlignment: true, showColor: true },
      { name: "caption", label: "Caption", type: "text", placeholder: "Optional caption below video" },
      { name: "captionTypography", label: "Caption Typography", type: "typography-group", showAlignment: true, showColor: true }
    ],
  },
  {
    name: "Stats",
    category: "shared",
    displayName: "Statistics List",
    description: "Display statistics with icons, titles, and values",
    propFields: [
      { 
        name: "title", 
        label: "Title", 
        type: "text", 
        placeholder: "e.g., 💰 Ways to Earn This Month" 
      },
      { 
        name: "titleTypography", 
        label: "Title Typography", 
        type: "typography-group" 
      },
      {
        name: "items",
        label: "Statistics Items",
        type: "array",
        itemType: "object",
        maxItems: 10,
        objectFields: [
          { name: "icon", label: "Icon", type: "icon-select", placeholder: "Choose an icon" },
          { name: "image", label: "Image (alternative to icon)", type: "image", helperText: "Use image instead of icon" },
          { name: "title", label: "Title", type: "text", required: true, placeholder: "Stat title" },
          { name: "subtitle", label: "Subtitle", type: "text", placeholder: "Optional subtitle" },
          { name: "value", label: "Value", type: "text", required: true, placeholder: "123" }
        ]
      },
      { 
        name: "layout", 
        label: "Layout Style", 
        type: "select", 
        options: [
          { value: "list", label: "List Layout" },
          { value: "grid", label: "Grid Layout" }
        ],
        defaultValue: "list" 
      },
      { 
        name: "columns", 
        label: "Grid Columns", 
        type: "select", 
        options: [
          { value: "1", label: "1 Column" },
          { value: "2", label: "2 Columns" },
          { value: "3", label: "3 Columns" }
        ],
        defaultValue: "2",
        helperText: "Only applies to grid layout"
      },
      { name: "className", label: "Additional CSS Classes", type: "text", placeholder: "Optional CSS classes" },
      { name: "itemClassName", label: "Item CSS Classes", type: "text", placeholder: "Optional item CSS classes" }
    ],
  },
  {
    name: "CTAStat",
    category: "shared", 
    displayName: "CTA Statistic",
    description: "Display a single statistic with call-to-action buttons",
    propFields: [
      { name: "title", label: "Title", type: "text", placeholder: "Your Current Balance" },
      { name: "titleTypography", label: "Title Typography", type: "typography-group" },
      { name: "stat", label: "Statistic Value", type: "text", required: true, placeholder: "1,234 🥯" },
      { name: "statTypography", label: "Statistic Typography", type: "typography-group" },
      { name: "ctaText", label: "Primary Button Text", type: "text", placeholder: "Earn More Coins" },
      { name: "ctaLink", label: "Primary Button Link", type: "link-action" },
      { name: "secondaryCTAText", label: "Secondary Button Text", type: "text", placeholder: "View Details" },
      { name: "secondaryCTALink", label: "Secondary Button Link", type: "link-action" }
    ],
  },
  {
    name: "EventsList",
    category: "shared",
    displayName: "Events List", 
    description: "Display a list of events with dates, times, and details",
    propFields: [
      {
        name: "events",
        label: "Events",
        type: "array",
        itemType: "object",
        maxItems: 20,
        objectFields: [
          { name: "title", label: "Event Title", type: "text", required: true, placeholder: "Event name" },
          { name: "date", label: "Date", type: "date", required: true },
          { name: "time", label: "Time", type: "time", placeholder: "Event time" },
          { name: "location", label: "Location", type: "text", placeholder: "Event location" },
          { name: "description", label: "Description", type: "textarea", placeholder: "Event description" },
          { name: "price", label: "Price", type: "text", placeholder: "$50" },
          { name: "link", label: "Event Link", type: "link-action", placeholder: "Link to event details or registration" },
          { 
            name: "type", 
            label: "Event Type", 
            type: "select",
            options: [
              { value: "workshop", label: "Workshop" },
              { value: "class", label: "Class" },
              { value: "seminar", label: "Seminar" },
              { value: "meetup", label: "Meetup" },
              { value: "conference", label: "Conference" },
              { value: "other", label: "Other" }
            ],
            placeholder: "Select event type"
          }
        ]
      },
      { name: "showType", label: "Show Event Type", type: "checkbox", defaultValue: false },
      { name: "className", label: "Container CSS Classes", type: "text", placeholder: "Optional container classes" },
      { name: "itemClassName", label: "Item CSS Classes", type: "text", placeholder: "Optional item classes" },
      { name: "borderColor", label: "Border Color", type: "text", defaultValue: "border-glamlink-teal", placeholder: "Tailwind border color class" }
    ],
  },
  {
    name: "BusinessProfile",
    category: "shared",
    displayName: "Business Profile",
    description: "Professional business profile with image, bio, and quote - displays business name above image",
    propFields: [
      // Business Information
      { name: "businessName", label: "Business Name", type: "text", required: true, placeholder: "e.g., Glamlink Beauty Studio" },
      { name: "businessNameTypography", label: "Business Name Typography", type: "typography-group", defaultValue: {
        fontSize: "text-4xl lg:text-5xl",
        fontFamily: "font-sans",
        fontWeight: "font-bold",
        color: "text-glamlink-purple"
      }},
      { name: "businessTitle", label: "Business Title/Tagline", type: "text", placeholder: "e.g., Your Premier Beauty Destination" },
      { name: "businessTitleTypography", label: "Business Title Typography", type: "typography-group", defaultValue: {
        fontSize: "text-xl",
        fontFamily: "font-sans",
        fontWeight: "font-normal",
        color: "text-gray-600"
      }},
      { name: "businessTitle2", label: "Secondary Title", type: "text", placeholder: "e.g., Est. 2020 | Award-Winning Service" },
      { name: "businessTitle2Typography", label: "Secondary Title Typography", type: "typography-group", defaultValue: {
        fontSize: "text-2xl",
        fontFamily: "font-sans",
        fontWeight: "font-medium",
        color: "text-gray-900"
      }},
      
      // Business Media Settings
      {
        name: "businessMediaSettings",
        label: "Business Media",
        type: "object",
        fields: [
          {
            name: "image",
            label: "Business Image",
            type: "image",
            helperText: "Upload or select a business photo or storefront"
          },
          {
            name: "videoSettings",
            label: "Video Settings",
            type: "object",
            fields: [
              {
                name: "video",
                label: "Video File",
                type: "video",
                helperText: "Upload a video file (mp4, webm, mov)",
              },
              {
                name: "videoUrl",
                label: "YouTube Video Link",
                type: "url",
                placeholder: "https://www.youtube.com/watch?v=...",
                helperText: "Enter a valid YouTube video URL"
              }
            ]
          }
        ],
        defaultValue: {
          image: null,
          videoSettings: {
            video: null,
            videoUrl: ""
          }
        }
      },

      // Legacy Image (for backward compatibility)
      { name: "businessImage", label: "Business Image (Legacy)", type: "image", placeholder: "Upload business photo or storefront" },
      
      // Bio Section
      { name: "bioTitle", label: "Bio Section Title", type: "text", defaultValue: "About", placeholder: "e.g., Our Story, About Us" },
      {
        name: "bioTitleTypography",
        label: "Bio Title Typography",
        type: "typography-group",
        showTag: true,
        defaultTag: "h3",
        defaultValue: {
          fontSize: "text-2xl",
          fontFamily: "font-sans",
          fontWeight: "font-semibold",
          color: "text-gray-900",
          tag: "h3"
        }
      },
      { name: "bio", label: "Biography Content", type: "richtext", placeholder: "Enter business story and details" },
      { name: "bioBgClassName", label: "Bio Background", type: "background-color", defaultValue: "bg-white", helperText: "Tailwind class or hex color" },
      
      // Quote Section
      { name: "quote", label: "Quote/Testimonial", type: "textarea", placeholder: "Enter a key quote or testimonial" },
      { name: "quoteTypography", label: "Quote Typography", type: "typography-group", defaultValue: {
        fontSize: "text-lg",
        fontFamily: "font-serif",
        fontWeight: "font-normal",
        fontStyle: "italic",
        color: "text-gray-800"
      }},
      { name: "quoteAuthor", label: "Quote Author", type: "text", placeholder: "e.g., Jane Doe, Founder" },
      { name: "quoteAuthorTypography", label: "Quote Author Typography", type: "typography-group", defaultValue: {
        fontSize: "text-base",
        fontFamily: "font-sans",
        fontWeight: "font-normal",
        color: "text-gray-600"
      }},
      { name: "quoteOverImage", label: "Overlay Quote on Image", type: "checkbox", defaultValue: false, helperText: "Display quote as an overlay on the image" },
      { name: "quoteBgClassName", label: "Quote Background", type: "background-color", defaultValue: "bg-gray-100/95", helperText: "Tailwind class or hex color" }
    ],
  },
  {
    name: "SectionDivider",
    category: "shared",
    displayName: "Section Divider",
    description: "A simple horizontal line to separate content sections",
    propFields: [
      { 
        name: "lineStyle", 
        label: "Line Style", 
        type: "select",
        options: [
          { value: "solid", label: "Solid" },
          { value: "dashed", label: "Dashed" },
          { value: "dotted", label: "Dotted" },
          { value: "double", label: "Double" }
        ],
        defaultValue: "solid"
      },
      { 
        name: "lineColor", 
        label: "Line Color", 
        type: "background-color",
        defaultValue: "border-gray-300",
        helperText: "Tailwind border class or hex color"
      },
      { 
        name: "lineWidth", 
        label: "Line Width (px)", 
        type: "number",
        defaultValue: 1,
        placeholder: "1",
        helperText: "Thickness of the divider line in pixels"
      },
      { 
        name: "spacing", 
        label: "Vertical Spacing", 
        type: "select",
        options: [
          { value: "none", label: "None" },
          { value: "small", label: "Small (16px)" },
          { value: "medium", label: "Medium (32px)" },
          { value: "large", label: "Large (48px)" }
        ],
        defaultValue: "medium",
        helperText: "Space above and below the divider"
      }
    ],
  },
  {
    name: "MediaItem",
    category: "shared",
    displayName: "Media Item",
    description: "Single image or video display with title, description, and caption",
    propFields: [
      // Title Section
      { name: "title", label: "Title", type: "text", placeholder: "Enter media title" },
      {
        name: "titleTypography",
        label: "Title Typography",
        type: "typography-group",
        defaultValue: {
          fontSize: "text-2xl",
          fontFamily: "font-sans",
          fontWeight: "font-bold",
          fontStyle: "",
          textDecoration: "",
          color: "text-gray-900",
          alignment: "left"
        }
      },

      // Description Section
      { name: "description", label: "Description", type: "textarea", placeholder: "Enter media description" },
      {
        name: "descriptionTypography",
        label: "Description Typography",
        type: "typography-group",
        defaultValue: {
          fontSize: "text-base",
          fontFamily: "font-sans",
          fontWeight: "font-normal",
          fontStyle: "",
          textDecoration: "",
          color: "text-gray-700",
          alignment: "left"
        }
      },

      // Media Settings (Object-based approach)
      {
        name: "mediaSettings",
        label: "Media Settings",
        type: "object",
        fields: [
          {
            name: "image",
            label: "Image",
            type: "image",
            helperText: "Upload or select an image"
          },
          {
            name: "videoSettings",
            label: "Video Settings",
            type: "object",
            fields: [
              {
                name: "videoType",
                label: "Video Type",
                type: "select",
                options: [
                  { value: "none", label: "No video" },
                  { value: "file", label: "Video file" },
                  { value: "youtube", label: "YouTube Video" }
                ],
                defaultValue: "none",
                helperText: "Choose video source for this media item"
              },
              {
                name: "video",
                label: "Video File",
                type: "video",
                helperText: "Upload a video file (mp4, webm, mov)",
              },
              {
                name: "videoUrl",
                label: "YouTube Video Link",
                type: "url",
                placeholder: "https://www.youtube.com/watch?v=...",
                helperText: "Enter a valid YouTube video URL"
              }
            ]
          },
          ],
        defaultValue: {
          image: null,
          videoSettings: {
            video: null,
            videoUrl: ""
          }
        }
      },

      // Caption Section
      { name: "caption", label: "Caption", type: "text", placeholder: "Enter media caption" },
      {
        name: "captionTypography",
        label: "Caption Typography",
        type: "typography-group",
        defaultValue: {
          fontSize: "text-sm",
          fontFamily: "font-sans",
          fontWeight: "font-normal",
          fontStyle: "italic",
          textDecoration: "",
          color: "text-gray-600",
          alignment: "center"
        }
      },

      // Styling Options
      {
        name: "className",
        label: "Additional CSS Classes",
        type: "text",
        placeholder: "Optional CSS classes for styling",
        helperText: "Custom CSS classes to apply to the container"
      }
    ],
  },
  {
    name: "HTMLContent",
    category: "shared",
    displayName: "HTML Content",
    description: "Custom HTML content with typography controls",
    propFields: [
      { name: "content", label: "HTML Content", type: "textarea", required: true, placeholder: "<div>Enter your custom HTML here</div>" },
      {
        name: "contentTypography",
        label: "Content Typography",
        type: "typography-group",
        defaultValue: {
          fontSize: "text-base",
          fontFamily: "font-sans",
          fontWeight: "font-normal",
          fontStyle: "",
          textDecoration: "",
          color: "text-gray-900",
          alignment: "left"
        }
      },
      { name: "className", label: "Additional CSS Classes", type: "text", placeholder: "Optional CSS classes for styling" }
    ],
  },
  {
    name: "EmbeddableBusinessCard",
    category: "shared",
    displayName: "Digital Business Card",
    description: "Displays a professional's digital business card with contact info, services, and promotions",
    propFields: [
      {
        name: "professionalId",
        label: "Select Professional",
        type: "professional-selector",
        required: true,
        helperText: "Choose a professional from the database"
      },
      {
        name: "showVideo",
        label: "Show Video Section",
        type: "checkbox",
        defaultValue: true,
        helperText: "Display the professional's signature work video"
      },
      {
        name: "showPromotions",
        label: "Show Promotions",
        type: "checkbox",
        defaultValue: true,
        helperText: "Display current promotions"
      },
      {
        name: "showServices",
        label: "Show Services",
        type: "checkbox",
        defaultValue: true,
        helperText: "Display offered services"
      },
      {
        name: "compact",
        label: "Compact Mode",
        type: "checkbox",
        defaultValue: false,
        helperText: "Smaller layout showing only basic info"
      },
    ],
  },
];