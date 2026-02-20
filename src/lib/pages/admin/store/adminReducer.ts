import { combineReducers } from '@reduxjs/toolkit';
import promosReducer from './slices/promosSlice';
import professionalsReducer from './slices/professionalsSlice';
import magazineReducer from './slices/magazineSlice';
import digitalPagesReducer from './slices/digitalPagesSlice';
import formSubmissionsReducer from './slices/form-submissions';
import contentTemplatesReducer from './slices/contentTemplatesSlice';
import analyticsReducer from './slices/analyticsSlice';

// Combine all admin reducers into a single admin slice
const adminReducer = combineReducers({
  promos: promosReducer,
  professionals: professionalsReducer,
  magazine: magazineReducer,
  digitalPages: digitalPagesReducer,
  formSubmissions: formSubmissionsReducer,
  contentTemplates: contentTemplatesReducer,
  analytics: analyticsReducer,
});

export default adminReducer;
