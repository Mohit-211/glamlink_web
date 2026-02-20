import { ContentComponentInfo } from './types';

export const whatsNewGlamlinkComponents: ContentComponentInfo[] = [
  {
    name: "FeatureList",
    category: "whats-new-glamlink",
    displayName: "Feature List",
    description: "List of new features or updates",
    propFields: [
      { name: "title", label: "Section Title", type: "text", defaultValue: "New Features" },
      { 
        name: "globalBackgroundColor", 
        label: "Global Card Background (All Cards)", 
        type: "background-color",
        helperText: "Sets background for ALL cards. Individual card backgrounds will override this."
      },
      { 
        name: "features", 
        label: "Features", 
        type: "array", 
        placeholder: "Add new features",
        maxItems: 10,
        itemType: "object",
        fields: [
          { name: "icon", label: "Icon", type: "icon-select", required: true },
          { name: "title", label: "Feature Title", type: "text", placeholder: "Enter feature name", required: true },
          { name: "description", label: "Description", type: "textarea", rows: 3, placeholder: "Describe the feature", required: true },
          { name: "availability", label: "Availability", type: "text", placeholder: "e.g., Now Live, Coming Soon", defaultValue: "Now Live" },
          { 
            name: "backgroundColor", 
            label: "Card Background", 
            type: "background-color"
          }
        ]
      },
    ],
  },
  {
    name: "SneakPeeks",
    category: "whats-new-glamlink",
    displayName: "Sneak Peeks",
    description: "Preview of upcoming features",
    propFields: [
      { name: "title", label: "Section Title", type: "text", defaultValue: "Coming Soon" },
      { name: "titleIcon", label: "Title Icon", type: "icon-select", defaultValue: "👀" },
      { 
        name: "sneakPeeksGlobalBackgroundColor", 
        label: "Global Card Background (All Cards)", 
        type: "background-color",
        helperText: "Sets background for ALL sneak peek cards"
      },
      {
        name: "titleTypography",
        label: "Title Typography",
        type: "typography-group",
        showTag: true,
        defaultTag: "h3",
        defaultValue: {
          fontSize: "text-lg md:text-xl",
          fontFamily: "font-[Roboto,sans-serif]",
          fontWeight: "font-bold",
          fontStyle: "",
          textDecoration: "",
          color: "text-glamlink-teal",
          tag: "h3"
        }
      },
      {
        name: "peeks",
        label: "Sneak Peeks", 
        type: "array", 
        placeholder: "Add sneak peeks",
        maxItems: 8,
        itemType: "object",
        fields: [
          { name: "title", label: "Feature Title", type: "text", placeholder: "What's coming", required: true },
          { name: "releaseDate", label: "Release Date", type: "text", placeholder: "e.g., Q1 2025, Coming Soon, 2025-09-30", required: true },
          { name: "teaser", label: "Teaser Description", type: "textarea", rows: 3, placeholder: "Brief description of the upcoming feature", required: true },
          { name: "backgroundColor", label: "Card Background (Optional)", type: "background-color", helperText: "Overrides global background for this card" }
        ]
      },
    ],
  },
  {
    name: "TipsList",
    category: "whats-new-glamlink",
    displayName: "Tips List",
    description: "List of helpful tips",
    propFields: [
      { name: "title", label: "Section Title", type: "text", defaultValue: "Pro Tips" },
      { name: "titleIcon", label: "Title Icon", type: "icon-select", defaultValue: "💡" },
      {
        name: "tipsGlobalBackgroundColor",
        label: "Global Card Background (All Cards)",
        type: "background-color",
        helperText: "Sets background for ALL tip cards"
      },
      {
        name: "titleTypography",
        label: "Title Typography",
        type: "typography-group",
        showTag: true,
        defaultTag: "h3",
        defaultValue: {
          fontSize: "text-lg md:text-xl",
          fontFamily: "font-[Roboto,sans-serif]",
          fontWeight: "font-bold",
          fontStyle: "",
          textDecoration: "",
          color: "text-glamlink-teal",
          tag: "h3"
        }
      },
      { 
        name: "tips", 
        label: "Tips", 
        type: "array", 
        placeholder: "Add tips",
        maxItems: 10,
        itemType: "object",
        fields: [
          { name: "icon", label: "Icon", type: "icon-select", defaultValue: "💫" },
          { name: "title", label: "Tip Title", type: "text", placeholder: "Enter tip headline", required: true },
          { name: "description", label: "Description", type: "textarea", rows: 2, placeholder: "Explain the tip", required: true },
          { name: "link", label: "Link (Optional)", type: "url", placeholder: "https://example.com" },
          { name: "backgroundColor", label: "Card Background (Optional)", type: "background-color", helperText: "Overrides global background for this card" }
        ]
      },
    ],
  },
];