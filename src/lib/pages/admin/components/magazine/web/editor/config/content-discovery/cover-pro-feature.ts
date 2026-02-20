import { ContentComponentInfo } from './types';

export const coverProFeatureComponents: ContentComponentInfo[] = [
  {
    name: "AccoladesList",
    category: "cover-pro-feature",
    displayName: "Accolades List",
    description: "List of achievements and awards",
    propFields: [
      { name: "title", label: "Section Title", type: "text" },
      {
        name: "titleTag",
        label: "Heading Tag",
        type: "select",
        options: [
          { value: "h1", label: "H1" },
          { value: "h2", label: "H2" },
          { value: "h3", label: "H3" },
          { value: "h4", label: "H4" },
          { value: "h5", label: "H5" },
          { value: "h6", label: "H6" }
        ],
        defaultValue: "h3"
      },
      {
        name: "titleTypography",
        label: "Title Typography",
        type: "typography-group"
      },
      {
        name: "accolades",
        label: "Accolades",
        type: "array",
        placeholder: "Add achievements",
        itemType: "text"
      },
      {
        name: "accoladesTypography",
        label: "Accolades Typography (All Items)",
        type: "typography-group",
        helperText: "Typography settings that apply to ALL accolade items"
      },
    ],
  },
  {
    name: "ProfessionalProfile",
    category: "cover-pro-feature",
    displayName: "Professional Profile",
    description: "Featured professional hero section",
    propFields: [
      { name: "name", label: "Name", type: "text", placeholder: "Professional name", required: true },
      {
        name: "nameTypography",
        label: "Name Typography",
        type: "typography-group"
      },
      { name: "title", label: "Title", type: "text", placeholder: "Job title" },
      {
        name: "titleTypography",
        label: "Title Typography",
        type: "typography-group"
      },
      { name: "company", label: "Company", type: "text", placeholder: "Company name" },
      {
        name: "companyTypography",
        label: "Company Typography",
        type: "typography-group"
      },
      { name: "quote", label: "Quote", type: "textarea", placeholder: "Inspirational quote or motto" },
      {
        name: "quoteTypography",
        label: "Quote Typography",
        type: "typography-group"
      },
      { name: "image", label: "Profile Image", type: "image", placeholder: "Upload hero image", required: true },
      { name: "useOverlay", label: "Use Gradient Overlay", type: "checkbox", defaultValue: true, helperText: "Adds a gradient overlay for better text readability" },
      { name: "bio", label: "Biography", type: "textarea", placeholder: "Professional bio (optional)" },
      {
        name: "bioTypography",
        label: "Biography Typography",
        type: "typography-group"
      },
      { name: "location", label: "Location", type: "text", placeholder: "City, State" },
      {
        name: "locationTypography",
        label: "Location Typography",
        type: "typography-group"
      },
      { name: "experience", label: "Experience", type: "text", placeholder: "Years of experience" },
      {
        name: "experienceTypography",
        label: "Experience Typography",
        type: "typography-group"
      },
      { name: "specialties", label: "Specialties", type: "array", placeholder: "Add specialties" },
      {
        name: "specialtiesTypography",
        label: "Specialties Typography",
        type: "typography-group"
      },
    ],
  },
];