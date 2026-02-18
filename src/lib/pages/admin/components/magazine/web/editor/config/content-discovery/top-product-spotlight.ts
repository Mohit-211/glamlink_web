import { ContentComponentInfo } from './types';

export const topProductSpotlightComponents: ContentComponentInfo[] = [
  {
    name: "ProductDetails",
    category: "top-product-spotlight",
    displayName: "Product Details",
    description: "Detailed product information with badges and stats",
    propFields: [
      // Product Info
      { name: "productName", label: "Product Name", type: "text", placeholder: "Product name", required: true },
      { name: "productNameTypography", label: "Product Name Typography", type: "typography-group" },
      { name: "brandName", label: "Brand Name", type: "text", placeholder: "Brand name" },
      { name: "brandNameTypography", label: "Brand Name Typography", type: "typography-group" },
      
      // Pricing
      { name: "price", label: "Price", type: "text", placeholder: "$99.99", required: true },
      { name: "originalPrice", label: "Original Price", type: "text", placeholder: "$149.99", helperText: "Shows with strikethrough" },
      { name: "discount", label: "Discount Percentage", type: "number", placeholder: "25", helperText: "Shows as badge (e.g., 25% OFF)" },
      
      // Badges
      { name: "isBestseller", label: "Is Bestseller", type: "checkbox", helperText: "Shows bestseller badge on image" },
      { name: "bestsellerLabel", label: "Bestseller Label", type: "text", placeholder: "BESTSELLER" },
      
      // Main Content
      { name: "description", label: "Description", type: "html", placeholder: "Product description with rich formatting" },
      { name: "image", label: "Product Image", type: "image", placeholder: "Upload product image", required: true },
      { name: "imageAutoHeight", label: "Auto Height (Natural Aspect Ratio)", type: "checkbox", helperText: "Check to display image at its natural aspect ratio instead of fixed height" },
      
      // Features & Benefits
      { name: "keyFeatures", label: "Key Features", type: "array", itemType: "text", placeholder: "Add key features", maxItems: 5 },
      { name: "keyFeaturesTitle", label: "Features Title", type: "text", placeholder: "Why We Love It:" },
      { name: "keyFeaturesTitleTypography", label: "Features Title Typography", type: "typography-group" },

      // Ingredients
      { name: "ingredients", label: "Ingredients", type: "array", itemType: "text", placeholder: "Add ingredients", maxItems: 10 },
      { name: "ingredientsTitle", label: "Ingredients Title", type: "text", placeholder: "Key Ingredients:" },
      { name: "ingredientsTitleTypography", label: "Ingredients Title Typography", type: "typography-group" },
      
      // Professional Recommendation
      {
        name: "proRecommendation",
        label: "Professional Recommendation",
        type: "object",
        fields: [
          { name: "proName", label: "Professional Name", type: "text", placeholder: "Dr. Jane Smith" },
          { name: "quote", label: "Recommendation Quote", type: "textarea", placeholder: "This product is amazing because...", required: true },
          { name: "proImage", label: "Professional Image", type: "image", placeholder: "Upload professional photo" },
        ]
      },
      
      // Customer Reviews
      { name: "reviewHighlights", label: "Review Highlights", type: "array", itemType: "text", placeholder: "Add customer reviews", maxItems: 3 },
      { name: "reviewHighlightsTitle", label: "Reviews Title", type: "text", placeholder: "What Customers Say:" },
      { name: "reviewHighlightsTitleTypography", label: "Reviews Title Typography", type: "typography-group" },
      
      // Stats
      { name: "rating", label: "Rating", type: "number", placeholder: "4.5", helperText: "Out of 5 stars" },
      { name: "reviewCount", label: "Review Count", type: "number", placeholder: "234" },
      { name: "unitsSold", label: "Units Sold", type: "text", placeholder: "1000", helperText: "Shows as '1000+'" },
      
      // Actions
      { name: "shopLink", label: "Shop Link", type: "url", placeholder: "https://example.com/product" },
      { name: "qrCode", label: "QR Code", type: "image", placeholder: "Upload QR code image" },
      
      // Legacy Fields
      { name: "benefits", label: "Benefits (Legacy)", type: "array", itemType: "text", placeholder: "Use Key Features instead", helperText: "Deprecated - use Key Features" },
      { name: "usage", label: "How to Use", type: "textarea", placeholder: "Usage instructions" },
      
      // Styling
      { name: "backgroundColor", label: "Background Color", type: "background-color", placeholder: "bg-white or #ffffff" },
    ],
  },
  {
    name: "SimilarProducts",
    category: "top-product-spotlight",
    displayName: "Similar Products",
    description: "Grid of related products",
    propFields: [
      {
        name: "products",
        label: "Similar Products",
        type: "array",
        itemType: "object",
        maxItems: 6,
        fields: [
          { name: "name", label: "Product Name", type: "text", required: true },
          { name: "price", label: "Price", type: "text", required: true },
          { name: "image", label: "Product Image", type: "image", required: true },
          { name: "link", label: "Product Link", type: "url" },
        ]
      },
      { name: "title", label: "Section Title", type: "text" },
      { name: "titleTypography", label: "Title Typography", type: "typography-group" },
      { name: "backgroundColor", label: "Background Color", type: "background-color" },
    ],
  },
];