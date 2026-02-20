import { ContentComponentInfo } from './types';

export const coinDropComponents: ContentComponentInfo[] = [
  {
    name: "MonthlyChallenge",
    category: "coin-drop",
    displayName: "Monthly Challenge",
    description: "Display monthly challenge with rewards, steps, and participants",
    propFields: [
      { 
        name: "title", 
        label: "Challenge Title", 
        type: "text", 
        placeholder: "Beauty Transformation Challenge",
        required: true
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
        name: "description", 
        label: "Challenge Description", 
        type: "textarea", 
        placeholder: "Share your best before/after transformation this month and win amazing prizes!" 
      },
      { 
        name: "descriptionTypography", 
        label: "Description Typography", 
        type: "typography-group",
        defaultValue: {
          fontSize: "text-base md:text-lg",
          fontWeight: "font-normal",
          fontFamily: "font-sans",
          color: "text-gray-700",
          alignment: "left",
          fontStyle: "",
          textDecoration: ""
        }
      },
      { 
        name: "coinReward", 
        label: "Coin Reward Amount", 
        type: "number", 
        placeholder: "500",
        helperText: "Number of coins for completing the challenge"
      },
      { 
        name: "steps", 
        label: "Challenge Steps", 
        type: "array", 
        itemType: "text", 
        placeholder: "Add challenge steps",
        maxItems: 10
      },
      { 
        name: "deadline", 
        label: "Challenge Deadline", 
        type: "date",
        helperText: "When does the challenge end?"
      },
      { 
        name: "participants", 
        label: "Number of Participants", 
        type: "number", 
        placeholder: "250" 
      },
    ],
  },
  {
    name: "Leaderboard",
    category: "coin-drop",
    displayName: "Coin Leaderboard",
    description: "Display top earners with medals and badges",
    propFields: [
      { 
        name: "title", 
        label: "Leaderboard Title", 
        type: "text", 
        placeholder: "🏆 This Month's Top Earners" 
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
        name: "users",
        label: "Leaderboard Users",
        type: "array",
        itemType: "object",
        maxItems: 10,
        objectFields: [
          { name: "name", label: "User Name", type: "text", required: true },
          { name: "nameTypography", label: "Name Typography", type: "typography-group" },
          { name: "coins", label: "Coins Earned", type: "number", required: true },
          { name: "coinsText", label: "Coins Display Text", type: "text", placeholder: "2500 🥯" },
          { name: "coinsTextTypography", label: "Coins Text Typography", type: "typography-group" },
          { name: "image", label: "User Image", type: "image" },
          { name: "badge", label: "Badge Text", type: "text", placeholder: "Top Earner" },
          { name: "badgeTypography", label: "Badge Typography", type: "typography-group" }
        ]
      },
      { 
        name: "showTopOnly", 
        label: "Show Top Users Only", 
        type: "checkbox", 
        defaultValue: false,
        helperText: "Only show top 3 users in featured view"
      },
      { 
        name: "topCount", 
        label: "Number of Top Users", 
        type: "number", 
        defaultValue: 3,
        helperText: "How many users to show in top view"
      },
    ],
  },
  {
    name: "SpecialOffers",
    category: "coin-drop",
    displayName: "Special Offers",
    description: "Display limited time coin offers and promotions",
    propFields: [
      { 
        name: "title", 
        label: "Section Title", 
        type: "text", 
        placeholder: "⚡ Limited Time Offers" 
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
        name: "offers",
        label: "Special Offers",
        type: "array",
        itemType: "object",
        maxItems: 6,
        objectFields: [
          { name: "title", label: "Offer Title", type: "text", required: true },
          { name: "titleTypography", label: "Title Typography", type: "typography-group" },
          { name: "description", label: "Offer Description", type: "textarea" },
          { name: "descriptionTypography", label: "Description Typography", type: "typography-group" },
          { name: "discount", label: "Discount Text", type: "text", placeholder: "2X REWARDS" },
          { name: "discountTypography", label: "Discount Typography", type: "typography-group" },
          { name: "minCoins", label: "Minimum Coins Required", type: "number" },
          { name: "minCoinsText", label: "Min Coins Display", type: "text", placeholder: "Min: 500 🥯" },
          { name: "minCoinsTextTypography", label: "Min Coins Typography", type: "typography-group" },
          { name: "endsIn", label: "Offer Ends In", type: "text", placeholder: "5 days" },
          { name: "endsInTypography", label: "Ends In Typography", type: "typography-group" }
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
  // Note: Stats and CTAStat are shared components and already defined in shared.ts
  // They are used with the coin-drop data but don't need to be redefined here
];