import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { PromoItem } from "@/lib/features/promos/config";

// State interface
interface PromosState {
  data: PromoItem[];
  lastUpdated: number | null;  // Unix timestamp in milliseconds
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  isDeleting: boolean;
}

// Initial state
const initialState: PromosState = {
  data: [],
  lastUpdated: null,
  isLoading: false,
  error: null,
  isSaving: false,
  isDeleting: false,
};

// Async thunk for fetching promos
export const fetchPromos = createAsyncThunk(
  "adminPromos/fetchPromos",
  async () => {
    const response = await fetch('/api/admin/promos', {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch promos: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.error || "Failed to fetch promos");
    }

    return data.data as PromoItem[];
  }
);

// Async thunk for creating promo
export const createPromo = createAsyncThunk(
  "adminPromos/createPromo",
  async (promo: Partial<PromoItem>) => {
    const response = await fetch('/api/admin/promos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(promo),
    });

    if (!response.ok) {
      throw new Error("Failed to create promo");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to create promo");
    }

    return result.data as PromoItem;
  }
);

// Async thunk for updating promo
export const updatePromo = createAsyncThunk(
  "adminPromos/updatePromo",
  async (promo: Partial<PromoItem>) => {
    const response = await fetch(`/api/admin/promos/${promo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(promo),
    });

    if (!response.ok) {
      throw new Error("Failed to update promo");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to update promo");
    }

    return result.data as PromoItem;
  }
);

// Async thunk for deleting promo
export const deletePromo = createAsyncThunk(
  "adminPromos/deletePromo",
  async (id: string) => {
    const response = await fetch(`/api/admin/promos/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error("Failed to delete promo");
    }

    return id;
  }
);

// Async thunk for batch upload
export const batchUploadPromos = createAsyncThunk(
  "adminPromos/batchUpload",
  async (promos: Partial<PromoItem>[]) => {
    const response = await fetch('/api/admin/promos/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ promos }),
    });

    if (!response.ok) {
      throw new Error("Failed to upload promos");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to upload promos");
    }

    return result.data as PromoItem[];
  }
);

// Create the slice
const promosSlice = createSlice({
  name: "adminPromos",
  initialState,
  reducers: {
    // Optimistic toggle for featured status
    toggleFeatured: (state, action: PayloadAction<string>) => {
      const promo = state.data.find(p => p.id === action.payload);
      if (promo) {
        promo.featured = !promo.featured;
      }
    },

    // Optimistic toggle for visibility
    toggleVisibility: (state, action: PayloadAction<string>) => {
      const promo = state.data.find(p => p.id === action.payload);
      if (promo) {
        promo.visible = !promo.visible;
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset state
    resetPromosState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchPromos
      .addCase(fetchPromos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPromos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();  // SET TIMESTAMP
        state.error = null;
      })
      .addCase(fetchPromos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch promos";
      })

      // Handle createPromo
      .addCase(createPromo.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(createPromo.fulfilled, (state, action) => {
        state.isSaving = false;
        state.data.push(action.payload);
        // Don't update lastUpdated on create
      })
      .addCase(createPromo.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || "Failed to create promo";
      })

      // Handle updatePromo
      .addCase(updatePromo.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updatePromo.fulfilled, (state, action) => {
        state.isSaving = false;
        const index = state.data.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        // Don't update lastUpdated on update
      })
      .addCase(updatePromo.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || "Failed to update promo";
      })

      // Handle deletePromo
      .addCase(deletePromo.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deletePromo.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.data = state.data.filter(p => p.id !== action.payload);
        // Don't update lastUpdated on delete
      })
      .addCase(deletePromo.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.error.message || "Failed to delete promo";
      })

      // Handle batchUploadPromos
      .addCase(batchUploadPromos.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(batchUploadPromos.fulfilled, (state, action) => {
        state.isSaving = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();  // Reset timestamp on batch upload
      })
      .addCase(batchUploadPromos.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || "Failed to upload promos";
      });
  },
});

// Export actions
export const {
  toggleFeatured,
  toggleVisibility,
  clearError,
  resetPromosState,
} = promosSlice.actions;

// Export reducer
export default promosSlice.reducer;
