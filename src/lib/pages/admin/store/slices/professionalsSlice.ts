import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Professional } from "@/lib/pages/for-professionals/types/professional";

// State interface
interface ProfessionalsState {
  data: Professional[];
  lastUpdated: number | null;  // Unix timestamp in milliseconds
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  isDeleting: boolean;
}

// Initial state
const initialState: ProfessionalsState = {
  data: [],
  lastUpdated: null,
  isLoading: false,
  error: null,
  isSaving: false,
  isDeleting: false,
};

// Async thunk for fetching professionals
export const fetchProfessionals = createAsyncThunk(
  "adminProfessionals/fetchProfessionals",
  async () => {
    const response = await fetch('/api/admin/professionals?includeHidden=true', {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch professionals: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.error || "Failed to fetch professionals");
    }

    return data.data as Professional[];
  }
);

// Async thunk for creating professional
export const createProfessional = createAsyncThunk(
  "adminProfessionals/createProfessional",
  async (professional: Partial<Professional>) => {
    const response = await fetch('/api/admin/professionals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(professional),
    });

    if (!response.ok) {
      throw new Error("Failed to create professional");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to create professional");
    }

    return result.data as Professional;
  }
);

// Async thunk for updating professional
export const updateProfessional = createAsyncThunk(
  "adminProfessionals/updateProfessional",
  async (professional: Partial<Professional>) => {
    // NOTE: Professionals API uses ROOT endpoint, not /:id
    const response = await fetch('/api/admin/professionals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(professional),
    });

    if (!response.ok) {
      throw new Error("Failed to update professional");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to update professional");
    }

    return result.data as Professional;
  }
);

// Async thunk for deleting professional
export const deleteProfessional = createAsyncThunk(
  "adminProfessionals/deleteProfessional",
  async (id: string) => {
    const response = await fetch(`/api/admin/professionals/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error("Failed to delete professional");
    }

    return id;
  }
);

// Async thunk for batch upload
export const batchUploadProfessionals = createAsyncThunk(
  "adminProfessionals/batchUpload",
  async (professionals: Partial<Professional>[]) => {
    const response = await fetch('/api/admin/professionals/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ professionals }),
    });

    if (!response.ok) {
      throw new Error("Failed to upload professionals");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to upload professionals");
    }

    return result.data as Professional[];
  }
);

// Async thunk for reordering a single professional
export const reorderProfessional = createAsyncThunk(
  "adminProfessionals/reorder",
  async ({ id, newOrder }: { id: string; newOrder: number }) => {
    const response = await fetch('/api/admin/professionals/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id, newOrder }),
    });

    if (!response.ok) {
      throw new Error("Failed to reorder professional");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to reorder professional");
    }

    return { id, newOrder, professional: result.data as Professional };
  }
);

// Async thunk for initializing order values
export const initializeOrders = createAsyncThunk(
  "adminProfessionals/initializeOrders",
  async () => {
    const response = await fetch('/api/admin/professionals/initialize-orders', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error("Failed to initialize orders");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to initialize orders");
    }

    return result.data as Professional[];
  }
);

// Create the slice
const professionalsSlice = createSlice({
  name: "adminProfessionals",
  initialState,
  reducers: {
    // Optimistic toggle for featured status
    toggleFeatured: (state, action: PayloadAction<string>) => {
      const professional = state.data.find(p => p.id === action.payload);
      if (professional) {
        professional.featured = !professional.featured;
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset state
    resetProfessionalsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchProfessionals
      .addCase(fetchProfessionals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfessionals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();  // SET TIMESTAMP
        state.error = null;
      })
      .addCase(fetchProfessionals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch professionals";
      })

      // Handle createProfessional
      .addCase(createProfessional.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(createProfessional.fulfilled, (state, action) => {
        state.isSaving = false;
        state.data.push(action.payload);
        // Don't update lastUpdated on create
      })
      .addCase(createProfessional.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || "Failed to create professional";
      })

      // Handle updateProfessional
      .addCase(updateProfessional.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateProfessional.fulfilled, (state, action) => {
        state.isSaving = false;
        const index = state.data.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        // Don't update lastUpdated on update
      })
      .addCase(updateProfessional.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || "Failed to update professional";
      })

      // Handle deleteProfessional
      .addCase(deleteProfessional.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteProfessional.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.data = state.data.filter(p => p.id !== action.payload);
        // Don't update lastUpdated on delete
      })
      .addCase(deleteProfessional.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.error.message || "Failed to delete professional";
      })

      // Handle batchUploadProfessionals
      .addCase(batchUploadProfessionals.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(batchUploadProfessionals.fulfilled, (state, action) => {
        state.isSaving = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();  // Reset timestamp on batch upload
      })
      .addCase(batchUploadProfessionals.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || "Failed to upload professionals";
      })

      // Handle reorderProfessional
      .addCase(reorderProfessional.fulfilled, (state, action) => {
        const { id, newOrder } = action.payload;
        // Update the professional's order and re-sort
        const index = state.data.findIndex(p => p.id === id);
        if (index !== -1) {
          state.data[index].order = newOrder;
        }
        // Re-sort by order
        state.data.sort((a, b) => {
          const aOrder = a.order ?? Number.MAX_SAFE_INTEGER;
          const bOrder = b.order ?? Number.MAX_SAFE_INTEGER;
          if (aOrder !== bOrder) return aOrder - bOrder;
          return a.name.localeCompare(b.name);
        });
      })
      .addCase(reorderProfessional.rejected, (state, action) => {
        state.error = action.error.message || "Failed to reorder professional";
      })

      // Handle initializeOrders
      .addCase(initializeOrders.fulfilled, (state, action) => {
        state.data = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(initializeOrders.rejected, (state, action) => {
        state.error = action.error.message || "Failed to initialize orders";
      });
  },
});

// Export actions
export const {
  toggleFeatured,
  clearError,
  resetProfessionalsState,
} = professionalsSlice.actions;

// Export reducer
export default professionalsSlice.reducer;
