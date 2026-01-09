// API queries for RWA assets on Mantle
import { RWAAsset, ComplianceEvent, YieldDistribution, MonitoringAlert, RWAProtocol } from './types';
import { fetchFromMantleAPI } from './client';
import { 
  getMockRWAAssets, 
  generateMockComplianceEvents, 
  generateMockYieldDistributions,
  generateMockAlerts,
  generateMockProtocols
} from './mock-data';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export async function fetchRWAAssets(params?: {
  limit?: number;
  offset?: number;
  assetType?: string;
}): Promise<RWAAsset[]> {
  // ALWAYS use mock data if enabled - don't try API first
  if (USE_MOCK_DATA) {
    console.log('✅ Using mock RWA data');
    const assets = getMockRWAAssets();
    let filtered = assets;
    
    if (params?.assetType) {
      filtered = filtered.filter(a => a.assetType === params.assetType);
    }
    
    const start = params?.offset || 0;
    const end = start + (params?.limit || filtered.length);
    
    return filtered.slice(start, end);
  }

  try {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.assetType) queryParams.append('assetType', params.assetType);

    const response = await fetchFromMantleAPI(`/assets?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch RWA assets:', error);
    return getMockRWAAssets();
  }
}

export async function fetchAssetById(assetId: string): Promise<RWAAsset | null> {
  if (USE_MOCK_DATA) {
    const assets = getMockRWAAssets();
    return assets.find(a => a.id === assetId) || null;
  }

  try {
    const response = await fetchFromMantleAPI(`/assets/${assetId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch asset ${assetId}:`, error);
    return null;
  }
}

export async function fetchAssetsByAddress(address: string): Promise<RWAAsset[]> {
  if (USE_MOCK_DATA) {
    const assets = getMockRWAAssets();
    return assets.filter(a => a.address.toLowerCase() === address.toLowerCase());
  }

  try {
    const response = await fetchFromMantleAPI(`/assets/by-address/${address}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch assets for address ${address}:`, error);
    return [];
  }
}

export async function fetchAssetsByOwner(owner: string): Promise<RWAAsset[]> {
  if (USE_MOCK_DATA) {
    const assets = getMockRWAAssets();
    return assets.filter(a => a.owner.toLowerCase() === owner.toLowerCase());
  }

  try {
    const response = await fetchFromMantleAPI(`/assets/by-owner/${owner}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch assets for owner ${owner}:`, error);
    return [];
  }
}

export async function fetchComplianceEvents(assetId: string): Promise<ComplianceEvent[]> {
  if (USE_MOCK_DATA) {
    return generateMockComplianceEvents(assetId);
  }

  try {
    const response = await fetchFromMantleAPI(`/assets/${assetId}/compliance`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch compliance events for ${assetId}:`, error);
    return [];
  }
}

export async function fetchYieldDistributions(assetId: string): Promise<YieldDistribution[]> {
  if (USE_MOCK_DATA) {
    return generateMockYieldDistributions(assetId);
  }

  try {
    const response = await fetchFromMantleAPI(`/assets/${assetId}/yield`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch yield distributions for ${assetId}:`, error);
    return [];
  }
}

export async function fetchMonitoringAlerts(params?: {
  severity?: string;
  resolved?: boolean;
  limit?: number;
}): Promise<MonitoringAlert[]> {
  if (USE_MOCK_DATA) {
    let alerts = generateMockAlerts(50);
    
    if (params?.severity) {
      alerts = alerts.filter(a => a.severity === params.severity);
    }
    
    if (params?.resolved !== undefined) {
      alerts = alerts.filter(a => a.resolved === params.resolved);
    }
    
    if (params?.limit) {
      alerts = alerts.slice(0, params.limit);
    }
    
    return alerts;
  }

  if (USE_MOCK_DATA) {
    const alerts = generateMockAlerts(params?.limit || 20);
    
    // Filter by severity if provided
    let filtered = alerts;
    if (params?.severity) {
      filtered = filtered.filter(a => a.severity === params.severity);
    }
    
    // Filter by resolved status if provided
    if (params?.resolved !== undefined) {
      filtered = filtered.filter(a => a.resolved === params.resolved);
    }
    
    return filtered;
  }

  try {
    const queryParams = new URLSearchParams();
    if (params?.severity) queryParams.append('severity', params.severity);
    if (params?.resolved !== undefined) queryParams.append('resolved', params.resolved.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetchFromMantleAPI(`/monitoring/alerts?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch monitoring alerts:', error);
    return generateMockAlerts(20);
  }
}

export async function fetchProtocols(): Promise<RWAProtocol[]> {
  if (USE_MOCK_DATA) {
    return generateMockProtocols();
  }

  try {
    const response = await fetchFromMantleAPI('/protocols');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch protocols:', error);
    return generateMockProtocols();
  }
}

export async function searchAssets(query: string): Promise<RWAAsset[]> {
  if (USE_MOCK_DATA) {
    const assets = getMockRWAAssets();
    const lowerQuery = query.toLowerCase();
    
    return assets.filter(a =>
      a.name.toLowerCase().includes(lowerQuery) ||
      a.symbol.toLowerCase().includes(lowerQuery) ||
      a.address.toLowerCase().includes(lowerQuery) ||
      a.assetType.toLowerCase().includes(lowerQuery)
    );
  }

  try {
    const response = await fetchFromMantleAPI(`/assets/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Failed to search assets:', error);
    return [];
  }
}

export async function fetchAssetRelationships(assetId: string): Promise<{
  parents: RWAAsset[];
  children: RWAAsset[];
  collateral: RWAAsset[];
}> {
  const allAssets = await fetchRWAAssets();
  const asset = allAssets.find(a => a.id === assetId);
  
  if (!asset) {
    return { parents: [], children: [], collateral: [] };
  }

  const parents = asset.parentAssets
    ? allAssets.filter(a => asset.parentAssets!.includes(a.id))
    : [];
  
  const children = asset.childAssets
    ? allAssets.filter(a => asset.childAssets!.includes(a.id))
    : [];
  
  const collateral = asset.collateralFor
    ? allAssets.filter(a => asset.collateralFor!.includes(a.id))
    : [];

  return { parents, children, collateral };
}

// WebSocket connection for real-time updates (mock implementation)
export class RWAAssetSubscription {
  private subscribers: Map<string, Set<(asset: RWAAsset) => void>> = new Map();
  private ws: WebSocket | null = null;

  connect() {
    if (USE_MOCK_DATA) {
      console.log('[Mock] WebSocket connection established');
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_MANTLE_WS_URL || 'wss://ws.mantle-atlas.xyz';
    this.ws = new WebSocket(wsUrl);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'asset_update') {
        this.notifySubscribers(data.assetId, data.asset);
      }
    };
  }

  subscribe(assetId: string, callback: (asset: RWAAsset) => void) {
    if (!this.subscribers.has(assetId)) {
      this.subscribers.set(assetId, new Set());
    }
    this.subscribers.get(assetId)!.add(callback);

    return () => {
      this.subscribers.get(assetId)?.delete(callback);
    };
  }

  private notifySubscribers(assetId: string, asset: RWAAsset) {
    const callbacks = this.subscribers.get(assetId);
    if (callbacks) {
      callbacks.forEach(callback => callback(asset));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const assetSubscription = new RWAAssetSubscription();
