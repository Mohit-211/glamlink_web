import { EmailTheme } from '../types';

/**
 * Helper functions for applying theme colors to email sections
 */

export interface ThemedSectionProps {
  theme?: EmailTheme;
  [key: string]: any;
}

/**
 * Generate inline styles from theme
 */
export const getThemedStyles = (theme: EmailTheme) => ({
  // Text styles
  primaryText: `color: ${theme.colors.text.primary}; font-family: ${theme.typography.fontFamily.primary};`,
  secondaryText: `color: ${theme.colors.text.secondary}; font-family: ${theme.typography.fontFamily.primary};`,
  tertiaryText: `color: ${theme.colors.text.tertiary}; font-family: ${theme.typography.fontFamily.primary};`,
  mutedText: `color: ${theme.colors.text.muted}; font-family: ${theme.typography.fontFamily.primary};`,
  inverseText: `color: ${theme.colors.text.inverse}; font-family: ${theme.typography.fontFamily.primary};`,
  link: `color: ${theme.colors.text.link}; text-decoration: none;`,
  linkHover: `color: ${theme.colors.text.linkHover}; text-decoration: underline;`,
  
  // Background styles
  bodyBackground: `background-color: ${theme.colors.background.body};`,
  emailBackground: `background-color: ${theme.colors.background.email};`,
  sectionBackground: `background-color: ${theme.colors.background.section};`,
  alternateSectionBackground: `background-color: ${theme.colors.background.alternateSection};`,
  footerBackground: `background-color: ${theme.colors.background.footer};`,
  cardBackground: `background-color: ${theme.colors.background.card};`,
  highlightBackground: `background-color: ${theme.colors.background.highlight};`,
  
  // Button styles
  primaryButton: `
    background-color: ${theme.colors.button.primary.background};
    color: ${theme.colors.button.primary.text};
    border: 1px solid ${theme.colors.button.primary.border};
    font-family: ${theme.typography.fontFamily.primary};
    font-weight: ${theme.typography.fontWeight.semibold};
  `,
  secondaryButton: `
    background-color: ${theme.colors.button.secondary.background};
    color: ${theme.colors.button.secondary.text};
    border: 1px solid ${theme.colors.button.secondary.border};
    font-family: ${theme.typography.fontFamily.primary};
    font-weight: ${theme.typography.fontWeight.semibold};
  `,
  tertiaryButton: `
    background-color: ${theme.colors.button.tertiary.background};
    color: ${theme.colors.button.tertiary.text};
    border: 1px solid ${theme.colors.button.tertiary.border};
    font-family: ${theme.typography.fontFamily.primary};
    font-weight: ${theme.typography.fontWeight.medium};
  `,
  
  // Border styles
  lightBorder: `border: 1px solid ${theme.colors.border.light};`,
  mediumBorder: `border: 1px solid ${theme.colors.border.medium};`,
  darkBorder: `border: 1px solid ${theme.colors.border.dark};`,
  primaryBorder: `border: 1px solid ${theme.colors.border.primary};`,
  secondaryBorder: `border: 1px solid ${theme.colors.border.secondary};`,
  
  // Typography
  headingLarge: `
    font-size: ${theme.typography.fontSize.xxxl};
    font-weight: ${theme.typography.fontWeight.bold};
    line-height: ${theme.typography.lineHeight.tight};
    color: ${theme.colors.text.primary};
    font-family: ${theme.typography.fontFamily.primary};
  `,
  headingMedium: `
    font-size: ${theme.typography.fontSize.xxl};
    font-weight: ${theme.typography.fontWeight.bold};
    line-height: ${theme.typography.lineHeight.tight};
    color: ${theme.colors.text.primary};
    font-family: ${theme.typography.fontFamily.primary};
  `,
  headingSmall: `
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.semibold};
    line-height: ${theme.typography.lineHeight.tight};
    color: ${theme.colors.text.primary};
    font-family: ${theme.typography.fontFamily.primary};
  `,
  bodyText: `
    font-size: ${theme.typography.fontSize.base};
    font-weight: ${theme.typography.fontWeight.normal};
    line-height: ${theme.typography.lineHeight.normal};
    color: ${theme.colors.text.secondary};
    font-family: ${theme.typography.fontFamily.primary};
  `,
  smallText: `
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.normal};
    line-height: ${theme.typography.lineHeight.normal};
    color: ${theme.colors.text.tertiary};
    font-family: ${theme.typography.fontFamily.primary};
  `,
  
  // Commerce styles
  priceText: `color: ${theme.colors.commerce.price}; font-weight: ${theme.typography.fontWeight.bold};`,
  originalPriceText: `color: ${theme.colors.commerce.originalPrice}; text-decoration: line-through;`,
  discountText: `color: ${theme.colors.commerce.discount}; font-weight: ${theme.typography.fontWeight.semibold};`,
  stockText: `color: ${theme.colors.commerce.stock};`,
  outOfStockText: `color: ${theme.colors.commerce.outOfStock};`,
  
  // Badge styles
  newBadge: `background-color: ${theme.colors.badge.new}; color: ${theme.colors.text.inverse};`,
  saleBadge: `background-color: ${theme.colors.badge.sale}; color: ${theme.colors.text.inverse};`,
  featuredBadge: `background-color: ${theme.colors.badge.featured}; color: ${theme.colors.text.primary};`,
  trendingBadge: `background-color: ${theme.colors.badge.trending}; color: ${theme.colors.text.inverse};`,
  exclusiveBadge: `background-color: ${theme.colors.badge.exclusive}; color: ${theme.colors.text.inverse};`,
  
  // Spacing
  containerPadding: `padding: ${theme.spacing.lg} ${theme.spacing.xl};`,
  sectionPadding: `padding: ${theme.spacing.section} 0;`,
  cardPadding: `padding: ${theme.spacing.md};`,
  buttonPadding: `padding: ${theme.spacing.sm} ${theme.spacing.lg};`,
  
  // Border radius
  cardRadius: `border-radius: ${theme.borderRadius.md};`,
  buttonRadius: `border-radius: ${theme.borderRadius.sm};`,
  badgeRadius: `border-radius: ${theme.borderRadius.sm};`,
  imageRadius: `border-radius: ${theme.borderRadius.md};`,
  
  // Shadows
  cardShadow: `box-shadow: ${theme.shadow.md};`,
  buttonShadow: `box-shadow: ${theme.shadow.sm};`,
  hoverShadow: `box-shadow: ${theme.shadow.lg};`,
});

/**
 * Get specific theme color
 */
export const getThemeColor = (theme: EmailTheme, path: string): string => {
  const keys = path.split('.');
  let value: any = theme.colors;
  
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) break;
  }
  
  return value || '#000000'; // Fallback to black if path not found
};

/**
 * Generate gradient style from theme
 */
export const getThemeGradient = (theme: EmailTheme, type: 'primary' | 'secondary' | 'highlight' = 'primary'): string => {
  return `background: ${theme.colors.gradient[type]};`;
};

/**
 * Get social media color
 */
export const getSocialColor = (theme: EmailTheme, platform: string): string => {
  const platformKey = platform.toLowerCase();
  return theme.colors.social[platformKey as keyof typeof theme.colors.social] || theme.colors.primary.main;
};

/**
 * Generate consistent card styles
 */
export const getCardStyles = (theme: EmailTheme, variant: 'default' | 'hover' | 'selected' = 'default') => {
  const baseStyles = `
    background-color: ${theme.colors.background.card};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.md};
  `;
  
  switch (variant) {
    case 'hover':
      return `${baseStyles} box-shadow: ${theme.shadow.lg}; border: 1px solid ${theme.colors.border.primary};`;
    case 'selected':
      return `${baseStyles} box-shadow: ${theme.shadow.lg}; border: 2px solid ${theme.colors.primary.main};`;
    default:
      return `${baseStyles} box-shadow: ${theme.shadow.md}; border: 1px solid ${theme.colors.border.light};`;
  }
};

/**
 * Get responsive styles for mobile
 */
export const getMobileStyles = (theme: EmailTheme) => `
  @media only screen and (max-width: 600px) {
    .container {
      width: 100% !important;
      padding: ${theme.spacing.md} !important;
    }
    .column {
      width: 100% !important;
      display: block !important;
    }
    .mobile-center {
      text-align: center !important;
    }
    .mobile-padding {
      padding: ${theme.spacing.sm} !important;
    }
    h1, h2, h3 {
      font-size: ${theme.typography.fontSize.xl} !important;
    }
    p {
      font-size: ${theme.typography.fontSize.base} !important;
    }
  }
`;

/**
 * Apply theme overrides from section props
 */
export const applyThemeOverrides = (theme: EmailTheme, overrides?: Partial<EmailTheme>): EmailTheme => {
  if (!overrides) return theme;
  
  return {
    ...theme,
    colors: {
      ...theme.colors,
      ...(overrides.colors || {}),
    },
    spacing: {
      ...theme.spacing,
      ...(overrides.spacing || {}),
    },
    typography: {
      ...theme.typography,
      ...(overrides.typography || {}),
    },
    borderRadius: {
      ...theme.borderRadius,
      ...(overrides.borderRadius || {}),
    },
    shadow: {
      ...theme.shadow,
      ...(overrides.shadow || {}),
    },
  };
};

/**
 * Replace legacy color with theme color
 * Maps old hardcoded colors to new theme variables
 */
export const mapLegacyColor = (color: string, theme: EmailTheme): string => {
  const colorMap: { [key: string]: string } = {
    // Primary colors - IMPORTANT: Map non-standard blue to Glamlink teal
    '#1e3a5f': theme.colors.primary.main, // Old dark blue -> Glamlink teal
    '#007bff': theme.colors.primary.main,
    '#0056b3': theme.colors.primary.dark,
    
    // Text colors
    '#333333': theme.colors.text.primary,
    '#333': theme.colors.text.primary,
    '#555555': theme.colors.text.primary,
    '#555': theme.colors.text.primary,
    '#666666': theme.colors.text.secondary,
    '#666': theme.colors.text.secondary,
    '#999999': theme.colors.text.tertiary,
    '#999': theme.colors.text.tertiary,
    '#a5a5a5': theme.colors.text.muted,
    
    // Background colors
    '#ffffff': theme.colors.background.email,
    '#fff': theme.colors.background.email,
    '#f8f9fa': theme.colors.background.alternateSection,
    '#f5f5f5': theme.colors.background.alternateSection,
    '#f0f0f0': theme.colors.background.alternateSection,
    '#e9ecef': theme.colors.border.light,
    
    // Semantic colors
    '#28a745': theme.colors.text.success,
    '#dc3545': theme.colors.text.error,
    '#e74c3c': theme.colors.text.error,
    '#ffc107': theme.colors.commerce.rating,
    '#17a2b8': theme.colors.primary.light,
    
    // Border colors
    '#dee2e6': theme.colors.border.light,
    '#e0e0e0': theme.colors.border.light,
    '#cccccc': theme.colors.border.medium,
    '#ccc': theme.colors.border.medium,
    
    // Special colors
    '#000000': theme.colors.text.primary,
    '#000': theme.colors.text.primary,
  };
  
  return colorMap[color.toLowerCase()] || color;
};

/**
 * Generate style string with theme colors
 * Automatically replaces legacy colors with theme colors
 */
export const generateThemedStyle = (styleString: string, theme: EmailTheme): string => {
  // Replace hex colors
  let themedStyle = styleString.replace(/#[0-9a-fA-F]{3,6}/g, (match) => {
    return mapLegacyColor(match, theme);
  });
  
  // Replace rgb colors with theme equivalents
  themedStyle = themedStyle.replace(/rgb\(255,\s*255,\s*255\)/gi, theme.colors.background.email);
  themedStyle = themedStyle.replace(/rgba\(0,\s*0,\s*0,\s*0\.5\)/gi, theme.colors.overlay.dark);
  
  return themedStyle;
};