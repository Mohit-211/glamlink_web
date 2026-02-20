import { ContentComponentInfo } from './types';

export const risingStarComponents: ContentComponentInfo[] = [
  {
    name: "AchievementsGrid",
    category: "rising-star",
    displayName: "Achievements Grid",
    description: "Grid of achievements and milestones",
    propFields: [
      { name: "title", label: "Achievements Title", type: "text", placeholder: "Achievements & Recognition" },
      {
        name: "titleTypography",
        label: "Title Typography",
        type: "typography-group"
      },
      { 
        name: "accolades", 
        label: "Achievements", 
        type: "array", 
        placeholder: "Add achievements",
        itemType: "object",
        fields: [
          { 
            name: "title", 
            label: "Achievement Title", 
            type: "text", 
            placeholder: "Over 50 5-Star Google Reviews", 
            required: true 
          },
          { 
            name: "description", 
            label: "Description (Optional)", 
            type: "text", 
            placeholder: "Brief description of the achievement" 
          },
          { 
            name: "icon", 
            label: "Icon", 
            type: "select", 
            options: [
              { value: "star", label: "⭐ Star" },
              { value: "trophy", label: "🏆 Trophy" },
              { value: "medal", label: "🥇 Medal" },
              { value: "award", label: "🎖️ Award" },
              { value: "sparkle", label: "✨ Sparkle" },
              { value: "crown", label: "👑 Crown" },
              { value: "shine", label: "🌟 Shine" },
              { value: "badge", label: "🏅 Badge" },
              { value: "heart", label: "❤️ Heart" },
              { value: "fire", label: "🔥 Fire" },
              { value: "rocket", label: "🚀 Rocket" },
              { value: "gem", label: "💎 Gem" },
              { value: "check", label: "✅ Check" },
              { value: "celebration", label: "🎉 Celebration" },
              { value: "thumbsup", label: "👍 Thumbs Up" },
              { value: "clap", label: "👏 Clap" },
              { value: "target", label: "🎯 Target" },
              { value: "lightbulb", label: "💡 Lightbulb" },
              { value: "key", label: "🔑 Key" },
              { value: "gift", label: "🎁 Gift" }
            ],
            defaultValue: "star",
            placeholder: "Choose an icon to represent this achievement"
          },
          {
            name: "titleTypography",
            label: "Title Typography",
            type: "typography-group"
          },
          {
            name: "descriptionTypography",
            label: "Description Typography",
            type: "typography-group"
          }
        ]
      },
      { name: "bgClassName", label: "Background", type: "background-color", placeholder: "Background color or gradient class" }
    ],
  },
  {
    name: "StarProfile",
    category: "rising-star",
    displayName: "Star Profile",
    description: "Featured star profile card",
    propFields: [
      { name: "starName", label: "Star Name", type: "text", placeholder: "Rising star name", required: true },
      {
        name: "starNameTypography",
        label: "Star Name Typography",
        type: "typography-group"
      },
      { name: "starTitle", label: "Title/Role", type: "text", placeholder: "e.g., Beauty Entrepreneur, Makeup Artist" },
      {
        name: "starTitleTypography",
        label: "Title Typography",
        type: "typography-group"
      },
      { name: "starTitle2", label: "Title/Role 2", type: "text", placeholder: "e.g., Location or additional role" },
      {
        name: "starTitle2Typography",
        label: "Title 2 Typography",
        type: "typography-group"
      },
      { name: "starImage", label: "Profile Image", type: "image", placeholder: "Upload photo" },
      { name: "quote", label: "Featured Quote", type: "textarea", placeholder: "Inspirational or memorable quote" },
      {
        name: "quoteTypography",
        label: "Quote Typography",
        type: "typography-group"
      },
      { name: "quoteAuthor", label: "Quote Attribution", type: "text", placeholder: "Who said the quote (if different from star)" },
      {
        name: "quoteAuthorTypography",
        label: "Quote Attribution Typography",
        type: "typography-group"
      },
      { name: "quoteOverImage", label: "Quote Over Image", type: "checkbox", defaultValue: false, helperText: "Display quote overlaid on the star image" },
      { name: "quoteBgClassName", label: "Quote Background", type: "background-color", placeholder: "Background color for quote box" },
      { name: "bioTitle", label: "Bio Title", type: "text", placeholder: "Title for bio section" },
      {
        name: "bioTitleTypography",
        label: "Bio Title Typography",
        type: "typography-group",
        showTag: true,
        defaultTag: "h3"
      },
      { name: "bio", label: "Bio", type: "html", placeholder: "Biography with rich text formatting", required: true },
      { name: "bioBgClassName", label: "Bio Background", type: "background-color", placeholder: "Background color for bio section" },
    ],
  },
];