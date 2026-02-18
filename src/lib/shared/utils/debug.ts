/**
 * Debug logging utility.
 *
 * Provides centralized, toggleable logging for development and debugging.
 * Logs are disabled in production and can be toggled via localStorage or URL parameters.
 */

type LogLevel = 'log' | 'warn' | 'error' | 'info';

export interface DebugLogger {
  enabled: boolean;
  log: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  group: (label: string) => void;
  groupEnd: () => void;
  time: (label: string) => void;
  timeEnd: (label: string) => void;
  enable: () => void;
  disable: () => void;
  toggle: () => boolean;
}

export interface DebugConfig {
  /** Prefix for log messages */
  prefix: string;
  /** Key used for localStorage */
  storageKey: string;
  /** URL parameter to enable debug mode */
  urlParam: string;
}

/**
 * Check if debug mode is enabled for a given config.
 */
function isDebugEnabled(config: DebugConfig): boolean {
  if (typeof window === 'undefined') return false;

  // Check URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get(config.urlParam) === 'true') {
    return true;
  }

  // Check localStorage
  try {
    return localStorage.getItem(config.storageKey) === 'true';
  } catch {
    return false;
  }
}

/**
 * Create a logging function for the given level.
 */
function createLogger(config: DebugConfig, level: LogLevel, getEnabled: () => boolean) {
  return (...args: unknown[]) => {
    if (!getEnabled()) return;
    // eslint-disable-next-line no-console
    console[level](config.prefix, ...args);
  };
}

/**
 * Create a debug logger with custom configuration.
 *
 * @param config - Debug logger configuration
 * @returns Debug logger instance
 *
 * @example
 * ```ts
 * const debug = createDebugLogger({
 *   prefix: '[MyFeature]',
 *   storageKey: 'my-feature-debug',
 *   urlParam: 'myfeature-debug',
 * });
 *
 * debug.log('Processing data', { count: 10 });
 * debug.warn('Rate limit approaching');
 * debug.error('Failed to process', error);
 * ```
 */
export function createDebugLogger(config: DebugConfig): DebugLogger {
  const getEnabled = () => isDebugEnabled(config);

  const logger: DebugLogger = {
    get enabled() {
      return getEnabled();
    },

    log: createLogger(config, 'log', getEnabled),
    warn: createLogger(config, 'warn', getEnabled),
    error: createLogger(config, 'error', getEnabled),
    info: createLogger(config, 'info', getEnabled),

    group(label: string) {
      if (!getEnabled()) return;
      // eslint-disable-next-line no-console
      console.group(`${config.prefix} ${label}`);
    },

    groupEnd() {
      if (!getEnabled()) return;
      // eslint-disable-next-line no-console
      console.groupEnd();
    },

    time(label: string) {
      if (!getEnabled()) return;
      // eslint-disable-next-line no-console
      console.time(`${config.prefix} ${label}`);
    },

    timeEnd(label: string) {
      if (!getEnabled()) return;
      // eslint-disable-next-line no-console
      console.timeEnd(`${config.prefix} ${label}`);
    },

    enable() {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(config.storageKey, 'true');
        // eslint-disable-next-line no-console
        console.log(`${config.prefix} Debug logging enabled. Refresh to see logs.`);
      } catch {
        // localStorage not available
      }
    },

    disable() {
      if (typeof window === 'undefined') return;
      try {
        localStorage.removeItem(config.storageKey);
        // eslint-disable-next-line no-console
        console.log(`${config.prefix} Debug logging disabled.`);
      } catch {
        // localStorage not available
      }
    },

    toggle() {
      if (getEnabled()) {
        logger.disable();
        return false;
      } else {
        logger.enable();
        return true;
      }
    },
  };

  return logger;
}

/**
 * Create a debug logger for a feature with sensible defaults.
 * Uses `[FeatureName]` prefix, `feature-name-debug` storage key, and `feature-name-debug` URL param.
 *
 * @param featureName - Name of the feature (used in logs and storage)
 * @returns Debug logger instance
 *
 * @example
 * ```ts
 * const debug = createFeatureDebug('Support Messaging');
 * // Prefix: [Support Messaging]
 * // Storage key: support-messaging-debug
 * // URL param: support-messaging-debug
 *
 * debug.log('Message sent');
 * ```
 */
export function createFeatureDebug(featureName: string): DebugLogger {
  const slug = featureName.toLowerCase().replace(/\s+/g, '-');
  return createDebugLogger({
    prefix: `[${featureName}]`,
    storageKey: `${slug}-debug`,
    urlParam: `${slug}-debug`,
  });
}
