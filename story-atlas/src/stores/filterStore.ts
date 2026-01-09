// Zustand store for filter state management
import { create } from 'zustand';
import { FilterOptions as RWAFilterOptions, RWAAssetType, ComplianceStatus, CustodyStatus } from '../lib/mantle/types';

// Combined filter state for RWA assets
interface FilterState extends RWAFilterOptions {
  // Legacy (Story Protocol) - added to RWA filter options
  licenseTypes?: string[];
  mediaTypes?: string[];
  minRevenue?: number;
  maxRevenue?: number;
  commercialOnly?: boolean;
  hasDerivatives?: boolean;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setAssetTypes: (types: RWAAssetType[]) => void;
  setComplianceStatuses: (statuses: ComplianceStatus[]) => void;
  setCustodyStatuses: (statuses: CustodyStatus[]) => void;
  setValueRange: (min?: number, max?: number) => void;
  setYieldRange: (min?: number, max?: number) => void;
  setHealthScore: (min?: number) => void;
  setRiskScore: (max?: number) => void;
  setHasYield: (value: boolean) => void;
  setHasChildren: (value: boolean) => void;
  
  // Legacy actions
  setLicenseTypes: (types: string[]) => void;
  setMediaTypes: (types: string[]) => void;
  setRevenueRange: (min?: number, max?: number) => void;
  setCommercialOnly: (value: boolean) => void;
  setHasDerivatives: (value: boolean) => void;
  
  setDateRange: (range: { start: number; end: number } | undefined) => void;
  reset: () => void;
}

const initialState: Omit<FilterState, 
  'setSearchQuery' | 'setAssetTypes' | 'setComplianceStatuses' | 'setCustodyStatuses' |
  'setValueRange' | 'setYieldRange' | 'setHealthScore' | 'setRiskScore' | 'setHasYield' |
  'setHasChildren' | 'setLicenseTypes' | 'setMediaTypes' | 'setRevenueRange' | 
  'setCommercialOnly' | 'setHasDerivatives' | 'setDateRange' | 'reset'
> = {
  searchQuery: '',
  assetTypes: [],
  complianceStatuses: [],
  custodyStatuses: [],
  minValue: undefined,
  maxValue: undefined,
  minYieldRate: undefined,
  maxYieldRate: undefined,
  minHealthScore: undefined,
  maxRiskScore: undefined,
  hasYield: false,
  hasChildren: false,
  licenseTypes: [],
  mediaTypes: [],
  minRevenue: undefined,
  maxRevenue: undefined,
  commercialOnly: false,
  hasDerivatives: false,
  dateRange: undefined,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // RWA actions
  setAssetTypes: (types) => set({ assetTypes: types }),
  setComplianceStatuses: (statuses) => set({ complianceStatuses: statuses }),
  setCustodyStatuses: (statuses) => set({ custodyStatuses: statuses }),
  setValueRange: (min, max) => set({ minValue: min, maxValue: max }),
  setYieldRange: (min, max) => set({ minYieldRate: min, maxYieldRate: max }),
  setHealthScore: (min) => set({ minHealthScore: min }),
  setRiskScore: (max) => set({ maxRiskScore: max }),
  setHasYield: (value) => set({ hasYield: value }),
  setHasChildren: (value) => set({ hasChildren: value }),
  
  // Legacy actions
  setLicenseTypes: (types) => set({ licenseTypes: types }),
  setMediaTypes: (types) => set({ mediaTypes: types }),
  setRevenueRange: (min, max) => set({ minRevenue: min, maxRevenue: max }),
  setCommercialOnly: (value) => set({ commercialOnly: value }),
  setHasDerivatives: (value) => set({ hasDerivatives: value }),
  
  setDateRange: (range) => set({ dateRange: range }),
  reset: () => set(initialState),
}));
