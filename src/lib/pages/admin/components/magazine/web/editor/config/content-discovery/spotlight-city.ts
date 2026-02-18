import { ContentComponentInfo } from './types';

export const spotlightCityComponents: ContentComponentInfo[] = [
  {
    name: "CityHero",
    category: "spotlight-city",
    displayName: "City Hero",
    description: "Hero section with city image and overlay text",
    propFields: [
      { 
        name: "cityName", 
        label: "City Name", 
        type: "text", 
        placeholder: "Los Angeles",
        required: true
      },
      { 
        name: "cityNameTypography", 
        label: "City Name Typography", 
        type: "typography-group",
        defaultValue: {
          fontSize: "text-3xl md:text-4xl",
          fontWeight: "font-bold",
          fontFamily: "font-sans",
          color: "text-glamlink-teal",
          alignment: "center",
          fontStyle: "",
          textDecoration: ""
        }
      },
      { 
        name: "description", 
        label: "City Description", 
        type: "textarea", 
        placeholder: "The beauty capital of the West Coast" 
      },
      { 
        name: "descriptionTypography", 
        label: "Description Typography", 
        type: "typography-group",
        defaultValue: {
          fontSize: "text-lg md:text-xl",
          fontWeight: "font-normal",
          fontFamily: "font-sans",
          color: "text-gray-600",
          alignment: "center",
          fontStyle: "",
          textDecoration: ""
        }
      },
      { 
        name: "cityImage", 
        label: "City Hero Image", 
        type: "image",
        helperText: "Background image for the city hero section"
      },
      { 
        name: "overlayText", 
        label: "Image Overlay Text", 
        type: "text", 
        placeholder: "Los Angeles",
        helperText: "Text displayed over the image"
      },
      { 
        name: "overlayTextTypography", 
        label: "Overlay Text Typography", 
        type: "typography-group",
        defaultValue: {
          fontSize: "text-2xl md:text-3xl",
          fontWeight: "font-bold",
          fontFamily: "font-sans",
          color: "text-white",
          alignment: "left",
          fontStyle: "",
          textDecoration: ""
        }
      },
    ],
  },
  {
    name: "LocalPros",
    category: "spotlight-city",
    displayName: "Local Professionals",
    description: "Grid display of top beauty professionals in the city",
    propFields: [
      { 
        name: "title", 
        label: "Section Title", 
        type: "text", 
        placeholder: "Top Local Pros" 
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
          alignment: "left",
          fontStyle: "",
          textDecoration: ""
        }
      },
      {
        name: "pros",
        label: "Professionals",
        type: "array",
        itemType: "object",
        maxItems: 12,
        objectFields: [
          { name: "name", label: "Professional Name", type: "text", required: true },
          { name: "nameTypography", label: "Name Typography", type: "typography-group" },
          { name: "specialty", label: "Specialty", type: "text", placeholder: "Celebrity Makeup" },
          { name: "specialtyTypography", label: "Specialty Typography", type: "typography-group" },
          { name: "image", label: "Professional Image", type: "image" },
          { name: "achievement", label: "Key Achievement", type: "textarea", placeholder: "Award-winning makeup artist" },
          { name: "achievementTypography", label: "Achievement Typography", type: "typography-group" },
          { name: "link", label: "Profile Link", type: "link-action" }
        ]
      },
      { 
        name: "gridCols", 
        label: "Grid Columns", 
        type: "select",
        options: [
          { value: "2", label: "2 Columns" },
          { value: "3", label: "3 Columns" },
          { value: "4", label: "4 Columns" }
        ],
        defaultValue: "3"
      },
      { 
        name: "backgroundColor", 
        label: "Section Background", 
        type: "background-color", 
        defaultValue: "bg-white" 
      },
    ],
  },
  {
    name: "LocalTrends",
    category: "spotlight-city",
    displayName: "Local Beauty Trends",
    description: "Display trending beauty treatments and styles in the city",
    propFields: [
      { 
        name: "title", 
        label: "Section Title", 
        type: "text", 
        placeholder: "What's Trending in Los Angeles" 
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
          alignment: "left",
          fontStyle: "",
          textDecoration: ""
        }
      },
      { 
        name: "cityName", 
        label: "City Name", 
        type: "text", 
        placeholder: "Los Angeles",
        helperText: "Used in the section title if needed"
      },
      {
        name: "trends",
        label: "Beauty Trends",
        type: "array",
        itemType: "object",
        maxItems: 12,
        objectFields: [
          { name: "name", label: "Trend Name", type: "text", required: true },
          { name: "nameTypography", label: "Name Typography", type: "typography-group" },
          { name: "description", label: "Trend Description", type: "textarea" },
          { name: "descriptionTypography", label: "Description Typography", type: "typography-group" },
          { 
            name: "popularity", 
            label: "Popularity Level", 
            type: "select",
            options: [
              { value: "hot", label: "🔥 Hot" },
              { value: "trending", label: "📈 Trending" },
              { value: "emerging", label: "✨ Emerging" }
            ]
          },
          { name: "popularityBadge", label: "Popularity Badge Text", type: "text", placeholder: "🔥 Hot" },
          { name: "popularityBadgeTypography", label: "Badge Typography", type: "typography-group" }
        ]
      },
      { 
        name: "gridCols", 
        label: "Grid Columns", 
        type: "select",
        options: [
          { value: "2", label: "2 Columns" },
          { value: "3", label: "3 Columns" },
          { value: "4", label: "4 Columns" }
        ],
        defaultValue: "3"
      },
      { 
        name: "backgroundColor", 
        label: "Section Background", 
        type: "background-color", 
        defaultValue: "bg-white" 
      },
    ],
  },
  // Note: EventsList is a shared component and already defined in shared.ts
  // It's used with spotlight-city for LocalEvents but doesn't need to be redefined here
];