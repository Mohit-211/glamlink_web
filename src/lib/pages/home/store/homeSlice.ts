import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { 
  HomeStateInterface, 
  HomeApiResponse,
  DEFAULT_HERO_DATA,
  HOME_API_ENDPOINT 
} from "../config";
import { mockHomeData } from "../mockData";

// Initial state
const initialState: HomeStateInterface = {
  heroData: DEFAULT_HERO_DATA,
  featuredProjects: [],
  services: [],
  stats: [],
  testimonials: [],
  isLoading: false,
  error: null,
};

// Async thunk for fetching home page data
export const fetchHomeData = createAsyncThunk(
  "home/fetchHomeData",
  async () => {
    try {
      const response = await fetch(HOME_API_ENDPOINT);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      
      const data: HomeApiResponse = await response.json();
      
      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to fetch home data");
      }
      
      return data.data;
    } catch (error) {
      // Fallback to mock data if API fails
      return mockHomeData;
    }
  }
);

// Create the slice
const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    // Update hero data
    updateHeroData: (state, action: PayloadAction<typeof initialState.heroData>) => {
      state.heroData = action.payload;
    },
    
    // Update featured projects
    updateFeaturedProjects: (state, action: PayloadAction<typeof initialState.featuredProjects>) => {
      state.featuredProjects = action.payload;
    },
    
    // Update services
    updateServices: (state, action: PayloadAction<typeof initialState.services>) => {
      state.services = action.payload;
    },
    
    // Update stats
    updateStats: (state, action: PayloadAction<typeof initialState.stats>) => {
      state.stats = action.payload;
    },
    
    // Update testimonials
    updateTestimonials: (state, action: PayloadAction<typeof initialState.testimonials>) => {
      state.testimonials = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset state
    resetHomeState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchHomeData pending
      .addCase(fetchHomeData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Handle fetchHomeData fulfilled
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.heroData = action.payload.heroData;
        state.featuredProjects = action.payload.featuredProjects;
        state.services = action.payload.services;
        state.stats = action.payload.stats;
        state.testimonials = action.payload.testimonials;
        state.error = null;
      })
      // Handle fetchHomeData rejected
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "An error occurred while fetching data";
      });
  },
});

// Export actions
export const {
  updateHeroData,
  updateFeaturedProjects,
  updateServices,
  updateStats,
  updateTestimonials,
  clearError,
  resetHomeState,
} = homeSlice.actions;

// Export reducer
export default homeSlice.reducer;