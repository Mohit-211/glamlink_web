import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type {
  MagazineAnalyticsSummary,
  CardAnalyticsStats,
  DateRangeOption
} from "@/lib/features/analytics/types";

// =============================================================================
// TYPES
// =============================================================================

export interface ProfessionalAnalyticsSummary {
  id: string;
  name: string;
  profileImage?: string;
  title?: string;
  stats: CardAnalyticsStats;
}

interface AnalyticsState {
  // Magazine analytics
  magazineData: MagazineAnalyticsSummary[];
  magazineLastUpdated: number | null;
  magazineLoading: boolean;
  magazineError: string | null;

  // Digital cards analytics
  cardData: ProfessionalAnalyticsSummary[];
  cardLastUpdated: number | null;
  cardLoading: boolean;
  cardError: string | null;

  // Shared
  dateRange: DateRangeOption;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: AnalyticsState = {
  // Magazine
  magazineData: [],
  magazineLastUpdated: null,
  magazineLoading: false,
  magazineError: null,

  // Cards
  cardData: [],
  cardLastUpdated: null,
  cardLoading: false,
  cardError: null,

  // Shared
  dateRange: '30d',
};

// =============================================================================
// ASYNC THUNKS
// =============================================================================

/**
 * Fetch magazine analytics with date range
 */
export const fetchMagazineAnalytics = createAsyncThunk(
  "adminAnalytics/fetchMagazineAnalytics",
  async (dateRange: DateRangeOption) => {
    const response = await fetch(`/api/analytics/magazine-dashboard?dateRange=${dateRange}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data as MagazineAnalyticsSummary[];
    }

    throw new Error("Invalid response format");
  }
);

/**
 * Fetch digital card analytics with date range
 */
export const fetchCardAnalytics = createAsyncThunk(
  "adminAnalytics/fetchCardAnalytics",
  async (dateRange: DateRangeOption) => {
    const response = await fetch(`/api/analytics/card-dashboard?dateRange=${dateRange}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data as ProfessionalAnalyticsSummary[];
    }

    throw new Error("Invalid response format");
  }
);

// =============================================================================
// SLICE
// =============================================================================

const analyticsSlice = createSlice({
  name: "adminAnalytics",
  initialState,
  reducers: {
    // Set date range
    setDateRange: (state, action: PayloadAction<DateRangeOption>) => {
      state.dateRange = action.payload;
    },

    // Clear magazine error
    clearMagazineError: (state) => {
      state.magazineError = null;
    },

    // Clear card error
    clearCardError: (state) => {
      state.cardError = null;
    },

    // Reset state
    resetAnalyticsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchMagazineAnalytics
      .addCase(fetchMagazineAnalytics.pending, (state) => {
        state.magazineLoading = true;
        state.magazineError = null;
      })
      .addCase(fetchMagazineAnalytics.fulfilled, (state, action) => {
        state.magazineLoading = false;
        state.magazineData = action.payload;
        state.magazineLastUpdated = Date.now();
        state.magazineError = null;
      })
      .addCase(fetchMagazineAnalytics.rejected, (state, action) => {
        state.magazineLoading = false;
        state.magazineError = action.error.message || "Failed to fetch magazine analytics";
      })

      // Handle fetchCardAnalytics
      .addCase(fetchCardAnalytics.pending, (state) => {
        state.cardLoading = true;
        state.cardError = null;
      })
      .addCase(fetchCardAnalytics.fulfilled, (state, action) => {
        state.cardLoading = false;
        state.cardData = action.payload;
        state.cardLastUpdated = Date.now();
        state.cardError = null;
      })
      .addCase(fetchCardAnalytics.rejected, (state, action) => {
        state.cardLoading = false;
        state.cardError = action.error.message || "Failed to fetch card analytics";
      });
  },
});

// Export actions
export const {
  setDateRange,
  clearMagazineError,
  clearCardError,
  resetAnalyticsState,
} = analyticsSlice.actions;

// Export reducer
export default analyticsSlice.reducer;
