import { EmailTheme } from '../types';

// Default theme fallback
const DEFAULT_THEME: EmailTheme = {
  name: "Glamlink Standard",
  description: "Standard Glamlink brand theme with official colors",
  colors: {
    primary: {
      main: "#22b8c8",
      light: "#bcecf1",
      dark: "#1a8c98",
      text: "#ffffff"
    },
    secondary: {
      main: "#faf7f2",
      light: "#ffffff",
      dark: "#f5ede0",
      text: "#333333"
    },
    background: {
      body: "#faf7f2",
      email: "#ffffff",
      section: "#ffffff",
      alternateSection: "#faf7f2",
      footer: "#333333",
      card: "#ffffff",
      highlight: "#bcecf1"
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
      tertiary: "#999999",
      inverse: "#ffffff",
      link: "#22b8c8",
      linkHover: "#1a8c98",
      muted: "#a5a5a5",
      error: "#d32f2f",
      success: "#2e7d32"
    },
    border: {
      light: "#e0e0e0",
      medium: "#cccccc",
      dark: "#999999",
      primary: "#22b8c8",
      secondary: "#bcecf1"
    },
    button: {
      primary: {
        background: "#22b8c8",
        text: "#ffffff",
        border: "#22b8c8",
        hoverBackground: "#1a8c98",
        hoverText: "#ffffff",
        hoverBorder: "#1a8c98"
      },
      secondary: {
        background: "#ffffff",
        text: "#22b8c8",
        border: "#22b8c8",
        hoverBackground: "#bcecf1",
        hoverText: "#1a8c98",
        hoverBorder: "#1a8c98"
      },
      tertiary: {
        background: "#faf7f2",
        text: "#333333",
        border: "#e0e0e0",
        hoverBackground: "#f5ede0",
        hoverText: "#22b8c8",
        hoverBorder: "#22b8c8"
      }
    },
    gradient: {
      primary: "linear-gradient(135deg, #ffffff 0%, #22b8c8 100%)",
      secondary: "linear-gradient(135deg, #faf7f2 0%, #bcecf1 100%)",
      highlight: "linear-gradient(90deg, #22b8c8 0%, #bcecf1 100%)"
    },
    social: {
      facebook: "#1877f2",
      instagram: "#e4405f",
      twitter: "#1da1f2",
      linkedin: "#0077b5",
      youtube: "#ff0000",
      tiktok: "#000000"
    },
    commerce: {
      price: "#22b8c8",
      originalPrice: "#999999",
      discount: "#d32f2f",
      stock: "#2e7d32",
      outOfStock: "#d32f2f",
      rating: "#ffc107"
    },
    badge: {
      new: "#22b8c8",
      sale: "#d32f2f",
      featured: "#ffc107",
      trending: "#ff6b6b",
      exclusive: "#9c27b0"
    },
    overlay: {
      dark: "rgba(0, 0, 0, 0.5)",
      light: "rgba(255, 255, 255, 0.8)",
      primary: "rgba(34, 184, 200, 0.1)"
    }
  },
  spacing: {
    xs: "8px",
    sm: "12px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
    section: "40px",
    container: "600px"
  },
  typography: {
    fontFamily: {
      primary: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      secondary: "Georgia, 'Times New Roman', serif",
      mono: "'Courier New', Courier, monospace"
    },
    fontSize: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      xxl: "24px",
      xxxl: "32px",
      display: "48px"
    },
    fontWeight: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700"
    },
    lineHeight: {
      tight: "1.2",
      normal: "1.5",
      relaxed: "1.8"
    }
  },
  borderRadius: {
    none: "0",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "50%"
  },
  shadow: {
    none: "none",
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.1)"
  }
};

// Available themes map (can be expanded with more themes)
const THEMES_MAP: { [key: string]: EmailTheme } = {
  standard: DEFAULT_THEME,
  default: DEFAULT_THEME
};

/**
 * ThemeManager class to handle email theme loading and management
 */
export class ThemeManager {
  private static instance: ThemeManager;
  private themesCache: Map<string, EmailTheme> = new Map();

  private constructor() {
    // Initialize cache with default themes
    this.themesCache.set('standard', DEFAULT_THEME);
    this.themesCache.set('default', DEFAULT_THEME);
  }

  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  /**
   * Load a theme by name
   * @param themeName - Name of the theme
   * @returns EmailTheme object
   */
  public async loadTheme(themeName?: string): Promise<EmailTheme> {
    // If no theme specified, return default
    if (!themeName) {
      return DEFAULT_THEME;
    }

    // Check cache first
    if (this.themesCache.has(themeName)) {
      return this.themesCache.get(themeName)!;
    }

    // Check if theme exists in the themes map
    if (THEMES_MAP[themeName]) {
      const theme = THEMES_MAP[themeName];
      this.themesCache.set(themeName, theme);
      return theme;
    }

    // For client-side usage, try to fetch the theme from an API
    if (typeof window !== 'undefined') {
      try {
        const response = await fetch(`/api/email/theme?name=${encodeURIComponent(themeName)}`);
        if (response.ok) {
          const theme = await response.json();
          if (this.validateTheme(theme)) {
            this.themesCache.set(themeName, theme);
            return theme;
          }
        }
      } catch (error) {
        console.warn(`Failed to load theme "${themeName}", using default theme`);
      }
    }

    // For server-side, we would need to load from a different source
    // For now, return default theme
    console.warn(`Theme "${themeName}" not found, using default theme`);
    return DEFAULT_THEME;
  }

  /**
   * Load a theme synchronously
   * This is primarily for server-side rendering where we need immediate results
   */
  public loadThemeSync(themeName?: string): EmailTheme {
    if (!themeName) {
      return DEFAULT_THEME;
    }

    // Check cache first
    if (this.themesCache.has(themeName)) {
      return this.themesCache.get(themeName)!;
    }

    // Check themes map
    if (THEMES_MAP[themeName]) {
      const theme = THEMES_MAP[themeName];
      this.themesCache.set(themeName, theme);
      return theme;
    }

    // If running on server-side and theme file exists, we could load it
    // For now, just return the default theme
    console.warn(`Theme "${themeName}" not found, using default theme`);
    return DEFAULT_THEME;
  }

  /**
   * Validate theme structure
   */
  private validateTheme(theme: any): theme is EmailTheme {
    return !!(
      theme &&
      typeof theme === 'object' &&
      theme.name &&
      theme.colors &&
      theme.colors.primary &&
      theme.colors.secondary &&
      theme.colors.background &&
      theme.colors.text &&
      theme.colors.border &&
      theme.colors.button &&
      theme.spacing &&
      theme.typography
    );
  }

  /**
   * List all available themes
   */
  public async listThemes(): Promise<string[]> {
    // Return the list of available theme names
    return Object.keys(THEMES_MAP);
  }

  /**
   * Clear theme cache
   */
  public clearCache(): void {
    this.themesCache.clear();
    // Re-add default themes
    this.themesCache.set('standard', DEFAULT_THEME);
    this.themesCache.set('default', DEFAULT_THEME);
  }

  /**
   * Get default theme
   */
  public getDefaultTheme(): EmailTheme {
    return DEFAULT_THEME;
  }

  /**
   * Add a custom theme
   */
  public addTheme(name: string, theme: EmailTheme): void {
    if (this.validateTheme(theme)) {
      THEMES_MAP[name] = theme;
      this.themesCache.set(name, theme);
    } else {
      console.error(`Invalid theme structure for "${name}"`);
    }
  }

  /**
   * Merge theme with custom overrides
   */
  public mergeTheme(baseTheme: EmailTheme, overrides: Partial<EmailTheme>): EmailTheme {
    return {
      ...baseTheme,
      ...overrides,
      colors: {
        ...baseTheme.colors,
        ...(overrides.colors || {}),
        primary: {
          ...baseTheme.colors.primary,
          ...(overrides.colors?.primary || {})
        },
        secondary: {
          ...baseTheme.colors.secondary,
          ...(overrides.colors?.secondary || {})
        },
        background: {
          ...baseTheme.colors.background,
          ...(overrides.colors?.background || {})
        },
        text: {
          ...baseTheme.colors.text,
          ...(overrides.colors?.text || {})
        },
        border: {
          ...baseTheme.colors.border,
          ...(overrides.colors?.border || {})
        },
        button: {
          ...baseTheme.colors.button,
          ...(overrides.colors?.button || {}),
          primary: {
            ...baseTheme.colors.button.primary,
            ...(overrides.colors?.button?.primary || {})
          },
          secondary: {
            ...baseTheme.colors.button.secondary,
            ...(overrides.colors?.button?.secondary || {})
          },
          tertiary: {
            ...baseTheme.colors.button.tertiary,
            ...(overrides.colors?.button?.tertiary || {})
          }
        },
        gradient: {
          ...baseTheme.colors.gradient,
          ...(overrides.colors?.gradient || {})
        },
        social: {
          ...baseTheme.colors.social,
          ...(overrides.colors?.social || {})
        },
        commerce: {
          ...baseTheme.colors.commerce,
          ...(overrides.colors?.commerce || {})
        },
        badge: {
          ...baseTheme.colors.badge,
          ...(overrides.colors?.badge || {})
        },
        overlay: {
          ...baseTheme.colors.overlay,
          ...(overrides.colors?.overlay || {})
        }
      },
      spacing: {
        ...baseTheme.spacing,
        ...(overrides.spacing || {})
      },
      typography: {
        ...baseTheme.typography,
        ...(overrides.typography || {}),
        fontFamily: {
          ...baseTheme.typography.fontFamily,
          ...(overrides.typography?.fontFamily || {})
        },
        fontSize: {
          ...baseTheme.typography.fontSize,
          ...(overrides.typography?.fontSize || {})
        },
        fontWeight: {
          ...baseTheme.typography.fontWeight,
          ...(overrides.typography?.fontWeight || {})
        },
        lineHeight: {
          ...baseTheme.typography.lineHeight,
          ...(overrides.typography?.lineHeight || {})
        }
      },
      borderRadius: {
        ...baseTheme.borderRadius,
        ...(overrides.borderRadius || {})
      },
      shadow: {
        ...baseTheme.shadow,
        ...(overrides.shadow || {})
      }
    };
  }
}

// Export singleton instance and helper functions
export const themeManager = ThemeManager.getInstance();

export const loadTheme = (themeName?: string) => themeManager.loadTheme(themeName);
export const loadThemeSync = (themeName?: string) => themeManager.loadThemeSync(themeName);
export const listThemes = () => themeManager.listThemes();
export const getDefaultTheme = () => themeManager.getDefaultTheme();
export const addTheme = (name: string, theme: EmailTheme) => themeManager.addTheme(name, theme);
export const mergeTheme = (baseTheme: EmailTheme, overrides: Partial<EmailTheme>) => 
  themeManager.mergeTheme(baseTheme, overrides);