import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { DigitalPage, CreateDigitalPageData, UpdateDigitalPageData } from "@/lib/pages/admin/components/magazine/digital/editor/types";

// State interface - cached by issueId for efficient per-issue fetching
interface DigitalPagesState {
  // Pages cached by issueId
  pagesByIssueId: { [issueId: string]: DigitalPage[] };
  loadingByIssueId: { [issueId: string]: boolean };
  lastUpdatedByIssueId: { [issueId: string]: number };
  error: string | null;
  isSaving: boolean;
  isDeleting: boolean;
}

// Initial state
const initialState: DigitalPagesState = {
  pagesByIssueId: {},
  loadingByIssueId: {},
  lastUpdatedByIssueId: {},
  error: null,
  isSaving: false,
  isDeleting: false,
};

// Async thunk for fetching digital pages by issue ID
export const fetchDigitalPages = createAsyncThunk(
  "adminDigitalPages/fetchDigitalPages",
  async (issueId: string) => {
    const response = await fetch(`/api/digital-pages?issueId=${issueId}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch digital pages: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      return { issueId, pages: data.data as DigitalPage[] };
    }

    throw new Error(data.error || "Failed to fetch digital pages");
  }
);

// Async thunk for creating a digital page
export const createDigitalPage = createAsyncThunk(
  "adminDigitalPages/createDigitalPage",
  async (pageData: CreateDigitalPageData) => {
    const response = await fetch('/api/digital-pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(pageData),
    });

    if (!response.ok) {
      throw new Error("Failed to create digital page");
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data as DigitalPage;
    }

    throw new Error(result.error || "Failed to create digital page");
  }
);

// Async thunk for updating a digital page
export const updateDigitalPage = createAsyncThunk(
  "adminDigitalPages/updateDigitalPage",
  async (pageData: UpdateDigitalPageData) => {
    const response = await fetch(`/api/digital-pages/${pageData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(pageData),
    });

    if (!response.ok) {
      throw new Error("Failed to update digital page");
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data as DigitalPage;
    }

    throw new Error(result.error || "Failed to update digital page");
  }
);

// Async thunk for deleting a digital page
export const deleteDigitalPage = createAsyncThunk(
  "adminDigitalPages/deleteDigitalPage",
  async ({ id, issueId }: { id: string; issueId: string }) => {
    const response = await fetch(`/api/digital-pages/${id}?issueId=${issueId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error("Failed to delete digital page");
    }

    return { id, issueId };
  }
);

// Async thunk for reordering pages
export const reorderDigitalPages = createAsyncThunk(
  "adminDigitalPages/reorderDigitalPages",
  async ({ issueId, pageIds }: { issueId: string; pageIds: string[] }) => {
    const response = await fetch(`/api/digital-pages/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ issueId, pageIds }),
    });

    if (!response.ok) {
      throw new Error("Failed to reorder digital pages");
    }

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return { issueId, pages: result.data as DigitalPage[] };
    }

    throw new Error(result.error || "Failed to reorder digital pages");
  }
);

// Async thunk for batch uploading pages (replaces all pages for an issue)
export const batchUploadDigitalPages = createAsyncThunk(
  "adminDigitalPages/batchUploadDigitalPages",
  async ({ issueId, pages }: { issueId: string; pages: Partial<DigitalPage>[] }) => {
    const response = await fetch(`/api/digital-pages/batch?issueId=${issueId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ pages }),
    });

    if (!response.ok) {
      throw new Error("Failed to batch upload digital pages");
    }

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return { issueId, pages: result.data as DigitalPage[] };
    }

    throw new Error(result.error || "Failed to batch upload digital pages");
  }
);

// Create the slice
const digitalPagesSlice = createSlice({
  name: "adminDigitalPages",
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear cache for a specific issue
    clearIssueCache: (state, action: PayloadAction<string>) => {
      const issueId = action.payload;
      delete state.pagesByIssueId[issueId];
      delete state.loadingByIssueId[issueId];
      delete state.lastUpdatedByIssueId[issueId];
    },

    // Clear all cache
    clearAllCache: (state) => {
      state.pagesByIssueId = {};
      state.loadingByIssueId = {};
      state.lastUpdatedByIssueId = {};
    },

    // Reset state
    resetDigitalPagesState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchDigitalPages
      .addCase(fetchDigitalPages.pending, (state, action) => {
        const issueId = action.meta.arg;
        state.loadingByIssueId[issueId] = true;
        state.error = null;
      })
      .addCase(fetchDigitalPages.fulfilled, (state, action) => {
        const { issueId, pages } = action.payload;
        state.loadingByIssueId[issueId] = false;
        state.pagesByIssueId[issueId] = pages;
        state.lastUpdatedByIssueId[issueId] = Date.now();
        state.error = null;
      })
      .addCase(fetchDigitalPages.rejected, (state, action) => {
        const issueId = action.meta.arg;
        state.loadingByIssueId[issueId] = false;
        state.error = action.error.message || "Failed to fetch digital pages";
      })

      // Handle createDigitalPage
      .addCase(createDigitalPage.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(createDigitalPage.fulfilled, (state, action) => {
        state.isSaving = false;
        const page = action.payload;
        const issueId = page.issueId;

        // Initialize array if needed
        if (!state.pagesByIssueId[issueId]) {
          state.pagesByIssueId[issueId] = [];
        }

        // Add to the pages array
        state.pagesByIssueId[issueId].push(page);

        // Sort by page number
        state.pagesByIssueId[issueId].sort((a, b) => a.pageNumber - b.pageNumber);
      })
      .addCase(createDigitalPage.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || "Failed to create digital page";
      })

      // Handle updateDigitalPage
      .addCase(updateDigitalPage.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateDigitalPage.fulfilled, (state, action) => {
        state.isSaving = false;
        const page = action.payload;
        const issueId = page.issueId;

        if (state.pagesByIssueId[issueId]) {
          const index = state.pagesByIssueId[issueId].findIndex(p => p.id === page.id);
          if (index !== -1) {
            state.pagesByIssueId[issueId][index] = page;
          }
        }
      })
      .addCase(updateDigitalPage.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || "Failed to update digital page";
      })

      // Handle deleteDigitalPage
      .addCase(deleteDigitalPage.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteDigitalPage.fulfilled, (state, action) => {
        state.isDeleting = false;
        const { id, issueId } = action.payload;

        if (state.pagesByIssueId[issueId]) {
          state.pagesByIssueId[issueId] = state.pagesByIssueId[issueId].filter(p => p.id !== id);

          // Re-number remaining pages
          state.pagesByIssueId[issueId].forEach((page, index) => {
            page.pageNumber = index + 1;
          });
        }
      })
      .addCase(deleteDigitalPage.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.error.message || "Failed to delete digital page";
      })

      // Handle reorderDigitalPages
      .addCase(reorderDigitalPages.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(reorderDigitalPages.fulfilled, (state, action) => {
        state.isSaving = false;
        const { issueId, pages } = action.payload;
        state.pagesByIssueId[issueId] = pages;
      })
      .addCase(reorderDigitalPages.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || "Failed to reorder digital pages";
      })

      // Handle batchUploadDigitalPages
      .addCase(batchUploadDigitalPages.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(batchUploadDigitalPages.fulfilled, (state, action) => {
        state.isSaving = false;
        const { issueId, pages } = action.payload;
        state.pagesByIssueId[issueId] = pages;
        state.lastUpdatedByIssueId[issueId] = Date.now();
      })
      .addCase(batchUploadDigitalPages.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || "Failed to batch upload digital pages";
      });
  },
});

// Export actions
export const {
  clearError,
  clearIssueCache,
  clearAllCache,
  resetDigitalPagesState,
} = digitalPagesSlice.actions;

// Export reducer
export default digitalPagesSlice.reducer;
