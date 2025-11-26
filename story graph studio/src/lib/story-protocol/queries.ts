// Query functions for Story Protocol data
import { fetchFromStoryAPI } from './client';
import { IPAsset, IPStats } from './types';
import { useMockData, getMockIPAssets } from './mock-data';

export async function fetchIPAssets(params?: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}): Promise<{ data: IPAsset[]; total: number }> {
  // Use mock data for development
  if (useMockData) {
    const mockData = getMockIPAssets();
    const start = params?.offset || 0;
    const end = start + (params?.limit || 100);
    return {
      data: mockData.slice(start, end),
      total: mockData.length,
    };
  }
  
  try {
    const queryParams = new URLSearchParams({
      pagination: JSON.stringify({
        limit: params?.limit || 100,
        offset: params?.offset || 0,
      }),
      ...(params?.orderBy && {
        orderBy: params.orderBy,
        orderDirection: params.orderDirection || 'desc',
      }),
    });

    const result = await fetchFromStoryAPI(`/assets?${queryParams}`);
    return {
      data: result.data || [],
      total: result.total || 0,
    };
  } catch (error) {
    console.error('Error fetching IP assets:', error);
    return { data: [], total: 0 };
  }
}

export async function fetchIPAssetById(ipId: string): Promise<IPAsset | null> {
  try {
    const result = await fetchFromStoryAPI(`/assets/${ipId}`);
    return result.data || null;
  } catch (error) {
    console.error(`Error fetching IP asset ${ipId}:`, error);
    return null;
  }
}

export async function fetchIPRelationships(ipId: string): Promise<{
  parents: string[];
  children: string[];
}> {
  try {
    const result = await fetchFromStoryAPI(`/assets/${ipId}/relationships`);
    return {
      parents: result.data?.parents || [],
      children: result.data?.children || [],
    };
  } catch (error) {
    console.error(`Error fetching relationships for ${ipId}:`, error);
    return { parents: [], children: [] };
  }
}

export async function fetchIPLicenses(ipId: string) {
  try {
    const result = await fetchFromStoryAPI(`/assets/${ipId}/licenses`);
    return result.data || [];
  } catch (error) {
    console.error(`Error fetching licenses for ${ipId}:`, error);
    return [];
  }
}

export async function searchIPAssets(query: string, limit = 20): Promise<IPAsset[]> {
  try {
    const result = await fetchFromStoryAPI('/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        pagination: { limit, offset: 0 },
      }),
    });
    return result.data || [];
  } catch (error) {
    console.error('Error searching IP assets:', error);
    return [];
  }
}

export async function fetchIPStats(): Promise<IPStats> {
  try {
    // This would be a custom aggregation endpoint
    // For now, we'll compute from fetched data
    const { data: assets } = await fetchIPAssets({ limit: 1000 });

    const stats: IPStats = {
      totalIPs: assets.length,
      totalDerivatives: assets.filter(a => a.parents && a.parents.length > 0).length,
      totalRevenue: '0',
      mostRemixedIPs: [],
      licenseDistribution: {},
      mediaTypeDistribution: {},
      ipsOverTime: [],
    };

    // Calculate most remixed
    const derivativeCounts = new Map<string, number>();
    assets.forEach(asset => {
      if (asset.children) {
        derivativeCounts.set(asset.ipId, asset.children.length);
      }
    });

    stats.mostRemixedIPs = Array.from(derivativeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ipId, count]) => ({
        ipId,
        count,
        name: assets.find(a => a.ipId === ipId)?.metadata?.name,
      }));

    // License distribution
    assets.forEach(asset => {
      if (asset.licenseTerms) {
        asset.licenseTerms.forEach(term => {
          const type = term.commercialUse ? 'Commercial' : 'Non-Commercial';
          stats.licenseDistribution[type] = (stats.licenseDistribution[type] || 0) + 1;
        });
      }
    });

    // Media type distribution
    assets.forEach(asset => {
      const type = asset.metadata?.mediaType || 'other';
      stats.mediaTypeDistribution[type] = (stats.mediaTypeDistribution[type] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error fetching IP stats:', error);
    return {
      totalIPs: 0,
      totalDerivatives: 0,
      totalRevenue: '0',
      mostRemixedIPs: [],
      licenseDistribution: {},
      mediaTypeDistribution: {},
      ipsOverTime: [],
    };
  }
}
