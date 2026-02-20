// Feature flags for controlling API usage and costs
export const FEATURE_FLAGS = {
  // OpenAI API - Set to false to use mock data and avoid API costs
  ENABLE_OPENAI_API: false,

  // Use mock data when OpenAI is disabled
  USE_MOCK_DATA: true,

  // Enable verbose logging for debugging
  DEBUG_MODE: true,

  // Magazine authentication - Set to false to allow public access to magazine pages
  REQUIRE_MAGAZINE_AUTH: false,

  // Promos authentication - Set to false to allow public access to promos pages
  REQUIRE_PROMOS_AUTH: false,

  // Professionals authentication - Set to true to restrict access to professionals pages
  REQUIRE_PROFESSIONALS_AUTH: true,

  // Server-side process control flags
  // Disable automatic seeding of mock data when database is empty
  DISABLE_AUTO_SEEDING: true,

  // Disable file system fallback when Firebase is unavailable
  DISABLE_FILE_FALLBACK: process.env.DISABLE_FILE_FALLBACK === 'false',

  // Disable migration of file-based promos to Firebase
  DISABLE_MIGRATION: process.env.DISABLE_MIGRATION === 'false',
};

// Helper function to check if OpenAI should be used
export const shouldUseOpenAI = () => {
  return FEATURE_FLAGS.ENABLE_OPENAI_API && !!process.env.OPENAI_API_KEY;
};

