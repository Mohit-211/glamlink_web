import { ContentComponentInfo } from './types';

export const magazineClosingComponents: ContentComponentInfo[] = [
  {
    name: "NextIssuePreview",
    category: "magazine-closing",
    displayName: "Next Issue Preview",
    description: "Preview of upcoming magazine issue with highlights",
    propFields: [
      { name: "title", label: "Issue Title", type: "text", placeholder: "Next issue title", required: true },
      { name: "date", label: "Issue Date", type: "date", placeholder: "Publication date" },
      { name: "description", label: "Description", type: "html", placeholder: "Issue preview description" },
      { name: "coverImage", label: "Cover Image", type: "image", placeholder: "Upload cover image" },
      { name: "titleTypography", label: "Title Typography", type: "typography-group" },
      { name: "backgroundColor", label: "Background Color", type: "background-color", placeholder: "bg-gray-50 or #f9fafb" },
      
      // Upcoming Highlights Section
      { name: "upcomingHighlightsTitle", label: "Highlights Section Title", type: "text", placeholder: "Coming Soon" },
      { name: "upcomingHighlightsTitleTypography", label: "Highlights Title Typography", type: "typography-group" },
      { name: "upcomingHighlightsBackgroundColor", label: "Highlight Cards Background", type: "background-color", placeholder: "bg-white or #ffffff" },
      {
        name: "upcomingHighlights",
        label: "Upcoming Highlights",
        type: "array",
        itemType: "object",
        maxItems: 6,
        placeholder: "Add upcoming highlights",
        fields: [
          { name: "image", label: "Highlight Image", type: "image", placeholder: "Upload image" },
          { name: "title", label: "Highlight Title", type: "text", placeholder: "Enter title", required: true },
          { name: "titleTypography", label: "Title Typography", type: "typography-group" },
          { name: "description", label: "Highlight Description", type: "text", placeholder: "Brief description" },
          { name: "descriptionTypography", label: "Description Typography", type: "typography-group" }
        ]
      },
    ],
  },
  {
    name: "SpotlightReel",
    category: "magazine-closing",
    displayName: "Spotlight Reel",
    description: "Grid of featured professionals with images and links",
    propFields: [
      // Title and Subtitle
      { name: "title", label: "Reel Title", type: "text", placeholder: "Rising Pros to Watch" },
      { name: "titleTypography", label: "Title Typography", type: "typography-group" },
      { name: "subtitle", label: "Reel Subtitle", type: "text", placeholder: "Discover the next generation" },
      { name: "subtitleTypography", label: "Subtitle Typography", type: "typography-group" },
      
      // Grid Layout
      { name: "gridLayout", label: "Grid Layout", type: "select", options: [
        { value: "3x2", label: "2 Columns (3x2)" },
        { value: "3x3", label: "3 Columns (3x3)" },
      ], defaultValue: "3x3" },
      
      // Spotlight Items
      {
        name: "spotlights",
        label: "Spotlight Items",
        type: "array",
        itemType: "object",
        maxItems: 9,
        placeholder: "Add featured professionals",
        fields: [
          { name: "name", label: "Name", type: "text", placeholder: "Professional name", required: true },
          { name: "caption", label: "Caption", type: "text", placeholder: "Brief description or title" },
          { name: "image", label: "Image", type: "image", placeholder: "Upload professional photo" },
          { name: "link", label: "Profile Link", type: "link-action", placeholder: "Link to profile or modal content" }
        ]
      },
    ],
  },
];