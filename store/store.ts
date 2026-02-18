import { configureStore } from "@reduxjs/toolkit";
import homeReducer from "@/lib/pages/home/store/homeSlice";
import authReducer from "@/lib/features/auth/authSlice";
import adminReducer from "@/lib/pages/admin/store/adminReducer";
import { digitalCardConfigReducer } from "@/lib/features/digital-cards/store";
import featuresReducer from "@/lib/features/store/featuresReducer";

export const store = configureStore({
  reducer: {
    home: homeReducer,
    auth: authReducer,
    admin: adminReducer,
    digitalCardConfig: digitalCardConfigReducer,
    features: featuresReducer,
  },
});

// Define the RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
