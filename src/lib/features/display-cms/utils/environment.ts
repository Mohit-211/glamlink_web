/**
 * Environment Detection Utilities
 *
 * Provides utilities to detect the current environment and determine
 * the appropriate rendering strategy (SSG, ISR, or dynamic).
 */

/**
 * Environment types
 */
export type Environment = 'production' | 'preview' | 'development';

/**
 * Rendering strategy types
 */
export type RenderingStrategy = 'ssg' | 'isr' | 'dynamic';

/**
 * Detect current environment based on hostname
 *
 * @returns Environment type: 'production', 'preview', or 'development'
 */
export function getEnvironment(): Environment {
  // Client-side detection
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;

    // Production environment
    if (host === 'glamlink.net' || host === 'www.glamlink.net') {
      return 'production';
    }

    // Preview environment
    if (host === 'preview.glamlink.net') {
      return 'preview';
    }

    // Development environment (localhost, 127.0.0.1, etc.)
    return 'development';
  }

  // Server-side detection
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || '';

  // Check for production domain
  if (baseUrl.includes('glamlink.net') && !baseUrl.includes('preview')) {
    return 'production';
  }

  // Check for preview domain
  if (baseUrl.includes('preview.glamlink.net')) {
    return 'preview';
  }

  // Default to development
  return 'development';
}

/**
 * Determine rendering strategy based on environment and SSG setting
 *
 * Rules:
 * - Preview: Always dynamic (ignores SSG setting)
 * - Production: Respects SSG setting (SSG if enabled, dynamic if disabled)
 * - Development: Uses ISR when SSG enabled (for testing), dynamic otherwise
 *
 * @param ssgEnabled - Whether SSG is enabled for the page
 * @param environment - Current environment (defaults to auto-detected)
 * @returns Rendering strategy: 'ssg', 'isr', or 'dynamic'
 */
export function getRenderingStrategy(
  ssgEnabled: boolean,
  environment?: Environment
): RenderingStrategy {
  const env = environment || getEnvironment();

  // Preview always uses dynamic rendering
  if (env === 'preview') {
    return 'dynamic';
  }

  // Production respects SSG setting
  if (env === 'production') {
    return ssgEnabled ? 'ssg' : 'dynamic';
  }

  // Development uses ISR when SSG is enabled (for testing without rebuilds)
  return ssgEnabled ? 'isr' : 'dynamic';
}

/**
 * Get ISR revalidation time based on environment
 *
 * @param environment - Current environment (defaults to auto-detected)
 * @returns Revalidation time in seconds, or false for no revalidation (true SSG)
 */
export function getRevalidationTime(environment?: Environment): number | false {
  const env = environment || getEnvironment();

  // Production with SSG: No revalidation (true static)
  if (env === 'production') {
    return false;
  }

  // Preview and development: 5-minute revalidation for testing
  return 300; // 5 minutes = 300 seconds
}

/**
 * Check if the current environment should use server-side rendering
 *
 * @param ssgEnabled - Whether SSG is enabled for the page
 * @returns True if should pre-render on server, false for client-side only
 */
export function shouldPreRender(ssgEnabled: boolean): boolean {
  const strategy = getRenderingStrategy(ssgEnabled);
  return strategy === 'ssg' || strategy === 'isr';
}

/**
 * Get environment display name for UI
 *
 * @param environment - Current environment (defaults to auto-detected)
 * @returns User-friendly environment name
 */
export function getEnvironmentDisplayName(environment?: Environment): string {
  const env = environment || getEnvironment();

  switch (env) {
    case 'production':
      return 'Production (glamlink.net)';
    case 'preview':
      return 'Preview (preview.glamlink.net)';
    case 'development':
      return 'Development (localhost)';
    default:
      return 'Unknown Environment';
  }
}

/**
 * Get rendering strategy description for UI
 *
 * @param strategy - Rendering strategy
 * @returns User-friendly description
 */
export function getRenderingStrategyDescription(strategy: RenderingStrategy): string {
  switch (strategy) {
    case 'ssg':
      return 'Static Site Generation - Requires rebuild to see changes';
    case 'isr':
      return 'Incremental Static Regeneration - Updates every 5 minutes';
    case 'dynamic':
      return 'Dynamic Rendering - Real-time updates';
    default:
      return 'Unknown Strategy';
  }
}
