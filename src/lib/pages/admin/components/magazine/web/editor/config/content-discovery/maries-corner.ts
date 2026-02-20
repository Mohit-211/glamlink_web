import { ContentComponentInfo, FieldDefinition } from './types';
import { createTypographyField, TYPOGRAPHY_PRESETS } from './typography-presets';

// Helper to create flat typography fields (individual props instead of nested object)
function createFlatTypographyFields(prefix: string, label: string, defaults?: any): FieldDefinition {
  return {
    name: `${prefix}Typography`,
    label,
    type: "typography-group",
    fields: [
      { name: `${prefix}FontSize`, label: "Font Size", type: "select", defaultValue: defaults?.fontSize || "text-base", options: [
        { value: "text-xs", label: "Extra Small" },
        { value: "text-sm", label: "Small" },
        { value: "text-base", label: "Medium" },
        { value: "text-lg", label: "Large" },
        { value: "text-xl", label: "Extra Large" },
        { value: "text-2xl", label: "2X Large" },
        { value: "text-3xl", label: "3X Large" }
      ]},
      { name: `${prefix}FontFamily`, label: "Font Family", type: "select", defaultValue: defaults?.fontFamily || "font-sans", options: [
        { value: "font-sans", label: "Sans Serif" },
        { value: "font-serif", label: "Serif" },
        { value: "font-mono", label: "Monospace" }
      ]},
      { name: `${prefix}FontWeight`, label: "Font Weight", type: "select", defaultValue: defaults?.fontWeight || "font-normal", options: [
        { value: "font-normal", label: "Normal" },
        { value: "font-medium", label: "Medium" },
        { value: "font-semibold", label: "Semi Bold" },
        { value: "font-bold", label: "Bold" }
      ]},
      { name: `${prefix}Color`, label: "Color", type: "select", defaultValue: defaults?.color || "text-gray-900", options: [
        { value: "text-gray-900", label: "Dark Gray" },
        { value: "text-gray-700", label: "Gray" },
        { value: "text-black", label: "Black" },
        { value: "text-white", label: "White" },
        { value: "text-glamlink-purple", label: "Glamlink Purple" },
        { value: "text-glamlink-teal", label: "Glamlink Teal" }
      ]},
      { name: `${prefix}Alignment`, label: "Alignment", type: "select", defaultValue: defaults?.alignment || "left", options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" }
      ]}
    ]
  };
}

export const mariesCornerComponents: ContentComponentInfo[] = [
  {
    name: "AuthorBadge",
    category: "maries-corner",
    displayName: "Author Badge",
    description: "Author profile badge with customizable typography and layout",
    propFields: [
      // Basic Info
      { name: "authorName", label: "Author Name", type: "text", placeholder: "Author name", required: true },
      createTypographyField("nameTypography", "Author Name Typography"),
      { name: "authorTitle", label: "Author Title", type: "text", placeholder: "Job title or role" },
      createTypographyField("titleTypography", "Author Title Typography", TYPOGRAPHY_PRESETS.small),
      
      // Image Settings
      { name: "authorImage", label: "Author Image", type: "image", placeholder: "Upload photo" },
      { 
        name: "imageWidth", 
        label: "Width", 
        type: "number", 
        placeholder: "80",
        fieldGroup: "image_dimensions"
      },
      { 
        name: "imageHeight", 
        label: "Height", 
        type: "number", 
        placeholder: "80",
        fieldGroup: "image_dimensions"
      },
      
      // Image Border Settings
      { 
        name: "showImageBorder", 
        label: "Show Image Border", 
        type: "checkbox", 
        defaultValue: true,
        helperText: "Display a colored border around the image"
      },
      { 
        name: "imageBorderColor", 
        label: "Image Border Color", 
        type: "background-color",
        defaultValue: "bg-[#f5e6d3]",
        helperText: "Color of the border around the image. Use Tailwind classes or custom colors."
      },
      { 
        name: "imageBorderWidth", 
        label: "Image Border Width", 
        type: "select",
        options: [
          { value: "p-0", label: "None" },
          { value: "p-0.5", label: "Thin (2px)" },
          { value: "p-1", label: "Normal (4px)" },
          { value: "p-1.5", label: "Medium (6px)" },
          { value: "p-2", label: "Thick (8px)" },
          { value: "p-3", label: "Extra Thick (12px)" }
        ],
        defaultValue: "p-1",
        helperText: "Thickness of the border around the image"
      },
      
      // Badge Settings
      { name: "badgeText", label: "Badge Text", type: "text", placeholder: "FOUNDING PRO", defaultValue: "FOUNDING PRO" },
      { 
        name: "badgePosition", 
        label: "Badge Position", 
        type: "select",
        options: [
          { value: "bottom-center", label: "Bottom Center" },
          { value: "bottom-left", label: "Bottom Left" },
          { value: "bottom-right", label: "Bottom Right" },
          { value: "none", label: "No Badge" }
        ],
        defaultValue: "bottom-center"
      },
      { 
        name: "badgeFontSize", 
        label: "Badge Font Size", 
        type: "select",
        options: [
          { value: "text-xs", label: "Extra Small" },
          { value: "text-sm", label: "Small" },
          { value: "text-base", label: "Medium" },
          { value: "text-lg", label: "Large" }
        ],
        defaultValue: "text-xs"
      },      
    ],
  },
  {
    name: "MariesPicks",
    category: "maries-corner",
    displayName: "Marie's Picks",
    description: "Curated product recommendations",
    propFields: [
      { name: "title", label: "Section Title", type: "text", defaultValue: "MARIE'S PICKS" },
      { 
        name: "products", 
        label: "Products", 
        type: "array", 
        placeholder: "Add recommended products",
        maxItems: 6,
        itemType: "object",
        fields: [
          { name: "name", label: "Product Name", type: "text", placeholder: "Product name", required: true },
          { name: "category", label: "Category", type: "text", placeholder: "Product category", required: true },
          { name: "image", label: "Product Image", type: "image", required: true },
          { name: "link", label: "Product Link", type: "link-action", placeholder: "Optional product link" }
        ]
      },
    ],
  },
  {
    name: "NumberedTips",
    category: "maries-corner",
    displayName: "Numbered Tips",
    description: "List of numbered tips or advice",
    propFields: [
      // Section Title
      { name: "title", label: "Section Title", type: "text", defaultValue: "{count} THINGS YOU SHOULD KNOW", placeholder: "Use {count} for dynamic count" },
      createFlatTypographyFields("title", "Section Title Typography", { fontSize: "text-xl", fontWeight: "font-bold", color: "text-gray-900", alignment: "left" }),

      // Tips Array
      {
        name: "tips",
        label: "Tips",
        type: "array",
        placeholder: "Add tips",
        maxItems: 5,
        itemType: "object",
        fields: [
          { name: "number", label: "Number", type: "text", defaultValue: "1", placeholder: "Tip number" },
          { name: "title", label: "Tip Title", type: "text", placeholder: "Enter tip title", required: true },
          createFlatTypographyFields("title", "Tip Title Typography", { fontSize: "text-base", fontWeight: "font-semibold", color: "text-gray-900" }),
          { name: "content", label: "Tip Description", type: "textarea", rows: 2, placeholder: "Enter tip description", required: true }
        ]
      },

      // Display Options
      { name: "displayNumbers", label: "Display Numbers", type: "checkbox", defaultValue: true },
    ],
  },
  {
    name: "QuoteBlock",
    category: "maries-corner",
    displayName: "Quote Block",
    description: "Featured quote or testimonial",
    propFields: [
      { name: "quote", label: "Quote", type: "textarea", placeholder: "Enter quote", required: true },
      { name: "author", label: "Author", type: "text", placeholder: "Quote author" },
      { name: "authorTitle", label: "Author Title", type: "text", placeholder: "Author's title or role" },
      { name: "backgroundImage", label: "Background Image", type: "image", placeholder: "Optional background image" },
      { 
        name: "quoteStyle", 
        label: "Quote Style", 
        type: "select",
        options: [
          { value: "decorative", label: "Decorative (with large quotes)" },
          { value: "inline", label: "Inline (simple quotes)" }
        ],
        defaultValue: "decorative"
      },
      { 
        name: "quoteAlignment", 
        label: "Quote Alignment", 
        type: "select",
        options: [
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "bottom-center", label: "Bottom Center (for images)" }
        ],
        defaultValue: "left"
      },
      { 
        name: "quoteTextColor", 
        label: "Text Color", 
        type: "text", 
        placeholder: "e.g., text-white or text-gray-800",
        helperText: "Leave empty for automatic color based on background"
      },
      {
        name: "marginTop",
        label: "Margin Top",
        type: "number",
        placeholder: "0",
        defaultValue: 0,
        helperText: "Adjust vertical position in pixels (negative to move up, positive to move down)"
      },
    ],
  },
  {
    name: "SocialFollow",
    category: "maries-corner",
    displayName: "Social Follow",
    description: "Social media follow widget",
    propFields: [
      { 
        name: "socialLink", 
        label: "Social Link Settings", 
        type: "object",
        fields: [
          { 
            name: "platform", 
            label: "Platform", 
            type: "select",
            options: [
              { value: "Glamlink", label: "Glamlink" },
              { value: "Instagram", label: "Instagram" },
              { value: "TikTok", label: "TikTok" },
              { value: "Facebook", label: "Facebook" },
              { value: "Twitter", label: "Twitter/X" },
              { value: "YouTube", label: "YouTube" },
              { value: "Custom", label: "Custom" },
            ],
            defaultValue: "Glamlink"
          },
          { name: "handle", label: "Handle/Username", type: "text", placeholder: "@username" },
          { name: "followText", label: "Follow Text", type: "text", placeholder: "Follow", defaultValue: "Follow" },
          { name: "qrCode", label: "QR Code URL", type: "url", placeholder: "Profile URL for QR code generation" },
        ]
      },
      { 
        name: "backgroundColor", 
        label: "Background Color", 
        type: "background-color",
        helperText: "Sets the background color for the social follow widget. Use Tailwind classes (bg-gray-50) or custom colors (hex, RGB, gradients)."
      },
    ],
  },
];