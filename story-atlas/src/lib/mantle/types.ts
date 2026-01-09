// TypeScript types for Mantle RWA Assets

export type RWAAssetType = 
  | 'real-estate'
  | 'bond'
  | 'invoice'
  | 'commodity'
  | 'equity'
  | 'fund-share'
  | 'defi-position'
  | 'synthetic';

export type ComplianceStatus = 
  | 'compliant'
  | 'pending'
  | 'expired'
  | 'failed'
  | 'not-required';

export type CustodyStatus =
  | 'bank-custody'
  | 'qualified-custodian'
  | 'smart-contract'
  | 'multi-sig'
  | 'self-custody';

export interface RWAAsset {
  id: string;
  address: string;
  tokenId?: string;
  chainId: number;
  
  // Asset identification
  name: string;
  symbol: string;
  assetType: RWAAssetType;
  description?: string;
  
  // Ownership & custody
  owner: string;
  custodian?: string;
  custodyStatus: CustodyStatus;
  
  // Financial details
  totalSupply: string;
  circulatingSupply: string;
  valuePerToken: string;
  totalValue: string;
  currency: string;
  
  // Yield & revenue
  yieldRate?: number; // APY percentage
  totalYieldGenerated?: string;
  lastYieldDistribution?: number;
  
  // Compliance & regulatory
  complianceStatus: ComplianceStatus;
  kycRequired: boolean;
  kycProvider?: string;
  regulatoryFramework?: string;
  lastAuditDate?: number;
  
  // Relationships
  parentAssets?: string[]; // Underlying RWA assets
  childAssets?: string[]; // Derivative products
  collateralFor?: string[]; // DeFi positions using this as collateral
  
  // Metadata
  createdAt: number;
  updatedAt: number;
  blockNumber: number;
  
  // Additional properties
  metadata?: RWAMetadata;
  riskScore?: number; // 0-100
  liquidityScore?: number; // 0-100
}

export interface RWAMetadata {
  imageUrl?: string;
  documentUrl?: string;
  legalDocuments?: string[];
  appraisalReports?: string[];
  
  // Real estate specific
  propertyAddress?: string;
  propertyType?: string;
  squareFeet?: number;
  
  // Bond specific
  issuer?: string;
  maturityDate?: number;
  couponRate?: number;
  
  // Invoice specific
  invoiceNumber?: string;
  paymentDueDate?: number;
  debtor?: string;
  
  attributes?: { [key: string]: any };
}

export interface ComplianceEvent {
  id: string;
  assetId: string;
  eventType: 'kyc-verification' | 'audit' | 'regulatory-filing' | 'license-renewal' | 'violation';
  status: ComplianceStatus;
  timestamp: number;
  details?: string;
  documentHash?: string;
}

export interface YieldDistribution {
  id: string;
  assetId: string;
  amount: string;
  currency: string;
  recipients: number;
  timestamp: number;
  txHash: string;
}

export interface RWAGraphNode {
  id: string;
  address: string;
  name: string;
  symbol: string;
  assetType: RWAAssetType;
  owner: string;
  
  // Financial
  totalValue: number;
  yieldRate: number;
  
  // Graph metrics
  childCount: number;
  parentCount: number;
  collateralCount: number;
  
  // Status
  complianceStatus: ComplianceStatus;
  custodyStatus: CustodyStatus;
  custodian?: string;
  riskScore: number;
  healthScore: number; // Aggregate health metric 0-100
  liquidityScore?: number;
  
  // Relationships
  collateralFor?: string[];
  
  // Visual
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface RWAGraphEdge {
  source: string;
  target: string;
  type: 'tokenization' | 'fractionalization' | 'collateral' | 'yield-flow' | 'custody-chain';
  value?: number; // For yield flows or collateral amounts
  label?: string;
}

export interface RWAGraphData {
  nodes: RWAGraphNode[];
  edges: RWAGraphEdge[];
}

export interface RWAProtocol {
  id: string;
  name: string;
  address: string;
  type: 'tokenization' | 'lending' | 'yield' | 'dex' | 'synthetic';
  tvl: string;
  assetCount: number;
  healthScore: number;
}

export interface MonitoringAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'compliance' | 'collateral' | 'yield' | 'custody' | 'transaction';
  assetId: string;
  assetName: string;
  message: string;
  timestamp: number;
  resolved: boolean;
}

export interface RWAMetrics {
  totalAssets: number;
  totalValueLocked: string;
  totalYieldGenerated: string;
  averageYieldRate: number;
  complianceRate: number;
  avgRiskScore: number;
  avgHealthScore: number;
  totalAlerts: number;
  criticalAlerts: number;
}

export interface AssetHealthMetrics {
  assetId: string;
  healthScore: number;
  riskScore: number;
  complianceScore: number;
  liquidityScore: number;
  yieldConsistency: number;
  collateralizationRatio?: number;
  issues: string[];
  recommendations: string[];
}

export interface FilterOptions {
  searchQuery?: string;
  assetTypes?: RWAAssetType[];
  complianceStatuses?: ComplianceStatus[];
  minValue?: number;
  maxValue?: number;
  minYieldRate?: number;
  maxYieldRate?: number;
  custodyStatuses?: CustodyStatus[];
  minHealthScore?: number;
  maxRiskScore?: number;
  hasYield?: boolean;
  hasChildren?: boolean;
  dateRange?: {
    start: number;
    end: number;
  };
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'pdf';
  includeCompliance: boolean;
  includeYieldHistory: boolean;
  includeTransactions: boolean;
  dateRange?: {
    start: number;
    end: number;
  };
}
