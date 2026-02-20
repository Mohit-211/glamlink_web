import { ContentComponentInfo } from './types';

export const glamlinkStoriesComponents: ContentComponentInfo[] = [
  {
    name: "StoryContent",
    category: "glamlink-stories",
    displayName: "Story Content Grid",
    description: "Instagram-style story cards with profile info and engagement stats",
    propFields: [
      {
        name: "stories",
        label: "Stories",
        type: "array",
        itemType: "object",
        maxItems: 20,
        objectFields: [
          { name: "profileName", label: "Profile Name", type: "text", required: true },
          { name: "profileNameTypography", label: "Profile Name Typography", type: "typography-group" },
          { name: "profileImage", label: "Profile Image", type: "image" },
          { name: "image", label: "Story Image", type: "image", required: true },
          { name: "caption", label: "Story Caption", type: "textarea" },
          { name: "captionTypography", label: "Caption Typography", type: "typography-group" },
          { 
            name: "storyType", 
            label: "Story Type", 
            type: "select",
            options: [
              { value: "before-after", label: "Before/After" },
              { value: "tutorial", label: "Tutorial" },
              { value: "product", label: "Product" },
              { value: "review", label: "Review" },
              { value: "post", label: "Post" }
            ]
          },
          { name: "timestamp", label: "Date Posted", type: "date" },
          { name: "timestampTypography", label: "Timestamp Typography", type: "typography-group" },
          { name: "likes", label: "Number of Likes", type: "number" },
          { name: "likesText", label: "Likes Display", type: "text", placeholder: "❤️ 324" },
          { name: "likesTextTypography", label: "Likes Typography", type: "typography-group" },
          { name: "comments", label: "Number of Comments", type: "number" },
          { name: "commentsText", label: "Comments Display", type: "text", placeholder: "💬 42" },
          { name: "commentsTextTypography", label: "Comments Typography", type: "typography-group" },
          { name: "views", label: "Number of Views", type: "number" },
          { name: "viewsText", label: "Views Display", type: "text", placeholder: "👁️ 1.2K" },
          { name: "viewsTextTypography", label: "Views Typography", type: "typography-group" },
          { name: "tags", label: "Tags", type: "array", itemType: "text", maxItems: 5 },
          { name: "tagsTypography", label: "Tags Typography", type: "typography-group" },
          { name: "isVideo", label: "Is Video", type: "checkbox", defaultValue: false },
          { name: "link", label: "Story Link", type: "link-action" }
        ]
      },
      { 
        name: "loadMoreText", 
        label: "Load More Button Text", 
        type: "text", 
        placeholder: "Load More Stories" 
      },
      { 
        name: "loadMoreTextTypography", 
        label: "Load More Typography", 
        type: "typography-group",
        defaultValue: {
          fontSize: "text-base",
          fontWeight: "font-medium",
          fontFamily: "font-sans",
          color: "text-gray-900",
          alignment: "center",
          fontStyle: "",
          textDecoration: ""
        }
      },
      { 
        name: "showLoadMore", 
        label: "Show Load More Button", 
        type: "checkbox", 
        defaultValue: true 
      },
    ],
  },
  {
    name: "FeaturedThisWeek",
    category: "glamlink-stories",
    displayName: "Featured This Week",
    description: "Showcase featured stories with badges and enhanced display",
    propFields: [
      { 
        name: "title", 
        label: "Section Title", 
        type: "text", 
        placeholder: "⭐ Featured This Week" 
      },
      { 
        name: "titleTypography", 
        label: "Title Typography", 
        type: "typography-group",
        defaultValue: {
          fontSize: "text-2xl md:text-3xl",
          fontWeight: "font-bold",
          fontFamily: "font-sans",
          color: "text-gray-900",
          alignment: "center",
          fontStyle: "",
          textDecoration: ""
        }
      },
      {
        name: "stories",
        label: "Featured Stories",
        type: "array",
        itemType: "object",
        maxItems: 6,
        objectFields: [
          { name: "title", label: "Story Title", type: "text", required: true },
          { name: "titleTypography", label: "Title Typography", type: "typography-group" },
          { name: "description", label: "Story Description", type: "textarea" },
          { name: "descriptionTypography", label: "Description Typography", type: "typography-group" },
          { name: "image", label: "Story Image", type: "image", required: true },
          { name: "profileName", label: "Profile Name", type: "text" },
          { name: "profileNameTypography", label: "Profile Name Typography", type: "typography-group" },
          { name: "profileImage", label: "Profile Image", type: "image" },
          { 
            name: "badge", 
            label: "Badge Text", 
            type: "text", 
            placeholder: "Featured",
            helperText: "e.g., Featured, Trending, New"
          },
          { name: "badgeTypography", label: "Badge Typography", type: "typography-group" },
          { name: "link", label: "Story Link", type: "link-action" },
          { name: "linkText", label: "Link Text", type: "text", placeholder: "View →" },
          { name: "linkTextTypography", label: "Link Text Typography", type: "typography-group" }
        ]
      },
      { 
        name: "backgroundColor", 
        label: "Section Background", 
        type: "background-color", 
        defaultValue: "bg-white" 
      },
    ],
  },
];