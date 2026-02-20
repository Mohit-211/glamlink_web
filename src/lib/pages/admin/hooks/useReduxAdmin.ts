import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from 'store/store';

// Typed hooks for admin Redux state
export const useAdminDispatch: () => AppDispatch = useDispatch;
export const useAdminSelector: TypedUseSelectorHook<RootState> = useSelector;
