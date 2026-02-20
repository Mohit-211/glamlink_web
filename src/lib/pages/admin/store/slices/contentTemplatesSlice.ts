import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { SectionTemplate } from "@/lib/pages/admin/components/content-settings/content/sections/for-clients/types";

// State interface
interface ContentTemplatesState {
  data: SectionTemplate[];
  lastUpdated: number | null;  // Unix timestamp in milliseconds
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  isDeleting: boolean;
}

// Initial state
const initialState: ContentTemplatesState = {
  data: [],
  lastUpdated: null,
  isLoading: false,
  error: null,
  isSaving: false,
  isDeleting: false,
};

// Async thunk for fetching ALL templates (no filtering - we filter client-side)
export const fetchTemplates = createAsyncThunk(
  "adminContentTemplates/fetchTemplates",
  async () => {
    const response = await fetch('/api/content-settings/for-clients/templates/all', {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch templates: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.error || "Failed to fetch templates");
    }

    return data.data as SectionTemplate[];
  }
);

// Async thunk for creating template
export const createTemplate = createAsyncThunk(
  "adminContentTemplates/createTemplate",
  async (template: Partial<SectionTemplate>) => {
    const response = await fetch('/api/content-settings/for-clients/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(template),
    });

    if (!response.ok) {
      throw new Error("Failed to create template");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to create template");
    }

    return result.data as SectionTemplate;
  }
);

// Async thunk for updating template
export const updateTemplate = createAsyncThunk(
  "adminContentTemplates/updateTemplate",
  async (template: Partial<SectionTemplate>) => {
    const response = await fetch('/api/content-settings/for-clients/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(template),
    });

    if (!response.ok) {
      throw new Error("Failed to update template");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to update template");
    }

    return result.data as SectionTemplate;
  }
);

// Async thunk for deleting template
export const deleteTemplate = createAsyncThunk(
  "adminContentTemplates/deleteTemplate",
  async (id: string) => {
    const response = await fetch(`/api/content-settings/for-clients/templates?id=${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error("Failed to delete template");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to delete template");
    }

    return id;
  }
);

const contentTemplatesSlice = createSlice({
  name: "adminContentTemplates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch templates
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch templates";
      });

    // Create template
    builder
      .addCase(createTemplate.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.isSaving = false;
        state.data.push(action.payload);
        state.error = null;
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || "Failed to create template";
      });

    // Update template
    builder
      .addCase(updateTemplate.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.isSaving = false;
        const index = state.data.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || "Failed to update template";
      });

    // Delete template
    builder
      .addCase(deleteTemplate.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.data = state.data.filter((t) => t.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.error.message || "Failed to delete template";
      });
  },
});

export default contentTemplatesSlice.reducer;
