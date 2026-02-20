/**
 * Theme Manager
 * Handles theme application and system theme detection
 */

import type { ThemeMode } from '../types';

export class ThemeManager {
  private static STORAGE_KEY = 'glamlink-theme';

  /**
   * Apply theme to DOM immediately
   */
  static applyTheme(theme: ThemeMode): void {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const isDark = this.resolveTheme(theme);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  /**
   * Resolve system theme to actual dark/light
   */
  private static resolveTheme(theme: ThemeMode): boolean {
    if (theme === 'system') {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme === 'dark';
  }

  /**
   * Get theme from localStorage
   */
  static getStoredTheme(): ThemeMode | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.STORAGE_KEY) as ThemeMode | null;
  }

  /**
   * Listen for system theme changes
   */
  static watchSystemTheme(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', callback);
    return () => mediaQuery.removeEventListener('change', callback);
  }
}
