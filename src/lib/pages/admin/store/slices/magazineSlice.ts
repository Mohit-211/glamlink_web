import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { MagazineIssue } from "@/lib/pages/magazine/types/magazine/core";
import { MagazineSectionDocument } from "@/lib/pages/magazine/types/collaboration";

// State interface
interface MagazineState {
  // Issues state
  data: MagazineIssue[];
  lastUpdated: number | null;  // Unix timestamp in milliseconds
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  isDeleting: boolean;
  // Sections state (cached by issueId)
  sectionsByIssueId: { [issueId: string]: MagazineSectionDocument[] };
  sectionsLoadingByIssueId: { [issueId: string]: boolean };
  sectionsLastUpdated: { [issueId: string]: number };
  sectionsError: string | null;
}

// Initial state
const initialState: MagazineState = {
  data: [],
  lastUpdated: null,
  isLoading: false,
  error: null,
  isSaving: false,
  isDeleting: false,
  sectionsByIssueId: {},
  sectionsLoadingByIssueId: {},
  sectionsLastUpdated: {},
  sectionsError: null,
};

// Async thunk for fetching magazine issues
export const fetchMagazine = createAsyncThunk(
  "adminMagazine/fetchMagazine",
  async () => {
    const response = await fetch('/api/magazine/issues?includeHidden=true', {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch magazine issues: ${response.status}`);
    }

    const data = await response.json();

    // Magazine API returns data directly (not wrapped in { success, data })
    if (Array.isArray(data)) {
      return data as MagazineIssue[];
    }

    throw new Error("Failed to fetch magazine issues");
  }
);

// Async thunk for creating magazine issue
export const createIssue = createAsyncThunk(
  "adminMagazine/createIssue",
  async (issue: Partial<MagazineIssue>) => {
    const response = await fetch('/api/magazine/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(issue),
    });

    if (!response.ok) {
      throw new Error("Failed to create magazine issue");
    }

    const result = await response.json();

    // Magazine API returns data directly
    if (result) {
      return result as MagazineIssue;
    }

    throw new Error("Failed to create magazine issue");
  }
);

// Async thunk for updating magazine issue
export const updateIssue = createAsyncThunk(
  "adminMagazine/updateIssue",
  async (issue: Partial<MagazineIssue>) => {
    const response = await fetch(`/api/magazine/issues/${issue.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(issue),
    });

    if (!response.ok) {
      throw new Error("Failed to update magazine issue");
    }

    const result = await response.json();

    // Magazine API returns data directly
    if (result) {
      return result as MagazineIssue;
    }

    throw new Error("Failed to update magazine issue");
  }
);

// Async thunk for deleting magazine issue
export const deleteIssue = createAsyncThunk(
  "adminMagazine/deleteIssue",
  async (id: string) => {
    const response = await fetch(`/api/magazine/issues/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error("Failed to delete magazine issue");
    }

    return id;
  }
);

// Async thunk for batch upload
export const batchUploadIssues = createAsyncThunk(
  "adminMagazine/batchUpload",
  async (issues: Partial<MagazineIssue>[]) => {
    const response = await fetch('/api/magazine/issues/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ issues }),
    });

    if (!response.ok) {
      throw new Error("Failed to upload magazine issues");
    }

    const result = await response.json();

    // Magazine API returns data directly (array)
    if (Array.isArray(result)) {
      return result as MagazineIssue[];
    }

    throw new Error("Failed to upload magazine issues");
  }
);

// Async thunk for fetching sections by issue ID
export const fetchSections = createAsyncThunk(
  "adminMagazine/fetchSections",
  async (issueId: string) => {
    const response = await fetch(`/api/magazine/sections?issueId=${issueId}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sections: ${response.status}`);
    }

    const data = await response.json();

    // API returns { sections: [...] }
    return { issueId, sections: (data.sections || []) as MagazineSectionDocument[] };
  }
);

// Create the slice
const magazineSlice = createSlice({
  name: "adminMagazine",
  initialState,
  reducers: {
    // Optimistic toggle for featured status
    toggleFeatured: (state, action: PayloadAction<string>) => {
      const issue = state.data.find(i => i.id === action.payload);
      if (issue) {
        issue.featured = !issue.featured;
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear sections cache for an issue
    clearSectionsCache: (state, action: PayloadAction<string>) => {
      const issueId = action.payload;
      delete state.sectionsByIssueId[issueId];
      delete state.sectionsLoadingByIssueId[issueId];
      delete state.sectionsLastUpdated[issueId];
    },

    // Clear sections error
    clearSectionsError: (state) => {
      state.sectionsError = null;
    },

    // Reset state
    resetMagazineState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchMagazine
      .addCase(fetchMagazine.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMagazine.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();  // SET TIMESTAMP
        state.error = null;
      })
      .addCase(fetchMagazine.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch magazine issues";
      })

      // Handle createIssue
      .addCase(createIssue.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(createIssue.fulfilled, (state, action) => {
        state.isSaving = false;
        state.data.push(action.payload);
        // Don't update lastUpdated on create
      })
      .addCase(createIssue.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || "Failed to create magazine issue";
      })

      // Handle updateIssue
      .addCase(updateIssue.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateIssue.fulfilled, (state, action) => {
        state.isSaving = false;
        const index = state.data.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        // Don't update lastUpdated on update
      })
      .addCase(updateIssue.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || "Failed to update magazine issue";
      })

      // Handle deleteIssue
      .addCase(deleteIssue.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.data = state.data.filter(i => i.id !== action.payload);
        // Don't update lastUpdated on delete
      })
      .addCase(deleteIssue.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.error.message || "Failed to delete magazine issue";
      })

      // Handle batchUploadIssues
      .addCase(batchUploadIssues.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(batchUploadIssues.fulfilled, (state, action) => {
        state.isSaving = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();  // Reset timestamp on batch upload
      })
      .addCase(batchUploadIssues.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || "Failed to upload magazine issues";
      })

      // Handle fetchSections
      .addCase(fetchSections.pending, (state, action) => {
        const issueId = action.meta.arg;
        state.sectionsLoadingByIssueId[issueId] = true;
        state.sectionsError = null;
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        const { issueId, sections } = action.payload;
        state.sectionsLoadingByIssueId[issueId] = false;
        state.sectionsByIssueId[issueId] = sections;
        state.sectionsLastUpdated[issueId] = Date.now();
        state.sectionsError = null;
      })
      .addCase(fetchSections.rejected, (state, action) => {
        const issueId = action.meta.arg;
        state.sectionsLoadingByIssueId[issueId] = false;
        state.sectionsError = action.error.message || "Failed to fetch sections";
      });
  },
});

// Export actions
export const {
  toggleFeatured,
  clearError,
  clearSectionsCache,
  clearSectionsError,
  resetMagazineState,
} = magazineSlice.actions;

// Export reducer
export default magazineSlice.reducer;
