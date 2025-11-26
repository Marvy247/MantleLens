// Zustand store for filter state management
import { create } from 'zustand';
import { FilterOptions } from '../lib/story-protocol/types';

interface FilterState extends FilterOptions {
  setSearchQuery: (query: string) => void;
  setLicenseTypes: (types: string[]) => void;
  setMediaTypes: (types: string[]) => void;
  setDateRange: (range: { start: number; end: number } | undefined) => void;
  setRevenueRange: (min?: number, max?: number) => void;
  setCommercialOnly: (value: boolean) => void;
  setHasDerivatives: (value: boolean) => void;
  reset: () => void;
}

const initialState: FilterOptions = {
  searchQuery: '',
  licenseTypes: [],
  mediaTypes: [],
  dateRange: undefined,
  minRevenue: undefined,
  maxRevenue: undefined,
  commercialOnly: false,
  hasDerivatives: false,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setLicenseTypes: (types) => set({ licenseTypes: types }),
  setMediaTypes: (types) => set({ mediaTypes: types }),
  setDateRange: (range) => set({ dateRange: range }),
  setRevenueRange: (min, max) => set({ minRevenue: min, maxRevenue: max }),
  setCommercialOnly: (value) => set({ commercialOnly: value }),
  setHasDerivatives: (value) => set({ hasDerivatives: value }),
  reset: () => set(initialState),
}));
