/**
 * MantleLens SDK
 * 
 * Crystal-clear visibility into RWA assets on Mantle Network.
 * A comprehensive SDK for tracking, monitoring, and analyzing Real World Assets.
 * 
 * @example
 * ```typescript
 * import { MantleLens } from '@mantlelens/sdk';
 * 
 * const lens = new MantleLens({
 *   network: 'mainnet',
 *   apiKey: 'your-api-key'
 * });
 * 
 * // Get asset relationships
 * const relationships = await lens.getAssetRelationships('0x123...');
 * 
 * // Monitor compliance
 * const compliance = await lens.getComplianceStatus('RWA-123');
 * 
 * // Track yield flows
 * const yields = await lens.getYieldFlows('RWA-456');
 * ```
 */

import {
  RWAAsset,
  RWAGraphData,
  RWAMetrics,
  AssetHealthMetrics,
  ComplianceEvent,
  YieldDistribution,
  MonitoringAlert,
  FilterOptions,
  ExportOptions,
} from './types';
import { ACTIVE_CHAIN, fetchFromMantleAPI } from './client';
import {
  fetchRWAAssets,
  fetchAssetById,
  fetchAssetsByAddress,
  fetchAssetsByOwner,
  fetchComplianceEvents,
  fetchYieldDistributions,
  fetchMonitoringAlerts,
  fetchAssetRelationships,
  assetSubscription,
} from './queries';
import {
  buildRWAGraphData,
  filterRWAGraphData,
  calculateRWAMetrics,
  calculateAssetHealth,
  exportGraphAsJSON,
  exportGraphAsCSV,
} from './graph-builder';

export interface SDKConfig {
  network?: 'mainnet' | 'testnet';
  apiKey?: string;
  rpcUrl?: string;
  enableWebSocket?: boolean;
}

export class MantleLens {
  private config: SDKConfig;
  private cache: Map<string, any> = new Map();
  private cacheTimeout: number = 60000; // 1 minute

  constructor(config: SDKConfig = {}) {
    this.config = {
      network: config.network || 'mainnet',
      apiKey: config.apiKey,
      rpcUrl: config.rpcUrl,
      enableWebSocket: config.enableWebSocket !== false,
    };

    if (this.config.enableWebSocket) {
      assetSubscription.connect();
    }
  }

  // ============================================================================
  // Core Asset Queries
  // ============================================================================

  /**
   * Fetch all RWA assets with optional filtering
   */
  async getAssets(params?: {
    limit?: number;
    offset?: number;
    assetType?: string;
  }): Promise<RWAAsset[]> {
    return fetchRWAAssets(params);
  }

  /**
   * Get a specific asset by ID
   */
  async getAsset(assetId: string): Promise<RWAAsset | null> {
    return fetchAssetById(assetId);
  }

  /**
   * Get assets by contract address
   */
  async getAssetsByAddress(address: string): Promise<RWAAsset[]> {
    return fetchAssetsByAddress(address);
  }

  /**
   * Get assets owned by a specific address
   */
  async getAssetsByOwner(owner: string): Promise<RWAAsset[]> {
    return fetchAssetsByOwner(owner);
  }

  // ============================================================================
  // Relationship & Graph Analysis
  // ============================================================================

  /**
   * Get asset relationships (parents, children, collateral)
   */
  async getAssetRelationships(assetId: string): Promise<{
    parents: RWAAsset[];
    children: RWAAsset[];
    collateral: RWAAsset[];
  }> {
    const cacheKey = `relationships:${assetId}`;
    if (this.hasValidCache(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const relationships = await fetchAssetRelationships(assetId);
    this.setCache(cacheKey, relationships);
    return relationships;
  }

  /**
   * Build complete graph data from assets
   */
  async getGraphData(filters?: FilterOptions): Promise<RWAGraphData> {
    const assets = await this.getAssets();
    let graphData = buildRWAGraphData(assets);

    if (filters) {
      graphData = filterRWAGraphData(graphData, filters);
    }

    return graphData;
  }

  /**
   * Get tokenization lineage (trace back to root asset)
   */
  async getTokenizationLineage(assetId: string): Promise<RWAAsset[]> {
    const lineage: RWAAsset[] = [];
    let currentAsset = await this.getAsset(assetId);

    while (currentAsset) {
      lineage.push(currentAsset);
      
      if (!currentAsset.parentAssets || currentAsset.parentAssets.length === 0) {
        break;
      }

      // Get first parent (primary lineage)
      currentAsset = await this.getAsset(currentAsset.parentAssets[0]);
    }

    return lineage.reverse();
  }

  // ============================================================================
  // Compliance & Monitoring
  // ============================================================================

  /**
   * Get compliance status for an asset
   */
  async getComplianceStatus(assetId: string): Promise<{
    status: string;
    events: ComplianceEvent[];
    isCompliant: boolean;
    lastAudit?: number;
  }> {
    const asset = await this.getAsset(assetId);
    if (!asset) {
      throw new Error(`Asset ${assetId} not found`);
    }

    const events = await fetchComplianceEvents(assetId);
    
    return {
      status: asset.complianceStatus,
      events,
      isCompliant: asset.complianceStatus === 'compliant',
      lastAudit: asset.lastAuditDate,
    };
  }

  /**
   * Get monitoring alerts with filtering
   */
  async getAlerts(params?: {
    severity?: string;
    resolved?: boolean;
    limit?: number;
  }): Promise<MonitoringAlert[]> {
    return fetchMonitoringAlerts(params);
  }

  /**
   * Get critical alerts (unresolved high/critical severity)
   */
  async getCriticalAlerts(): Promise<MonitoringAlert[]> {
    const allAlerts = await fetchMonitoringAlerts({ resolved: false });
    return allAlerts.filter(
      alert => alert.severity === 'critical' || alert.severity === 'high'
    );
  }

  // ============================================================================
  // Yield & Financial Analysis
  // ============================================================================

  /**
   * Get yield distribution history for an asset
   */
  async getYieldFlows(assetId: string): Promise<YieldDistribution[]> {
    return fetchYieldDistributions(assetId);
  }

  /**
   * Calculate total yield generated across all assets
   */
  async getTotalYield(params?: { assetType?: string }): Promise<{
    total: string;
    byAssetType: { [key: string]: string };
  }> {
    const assets = await this.getAssets(params);
    
    const total = assets.reduce(
      (sum, asset) => sum + parseFloat(asset.totalYieldGenerated || '0'),
      0
    );

    const byAssetType: { [key: string]: string } = {};
    assets.forEach(asset => {
      const type = asset.assetType;
      byAssetType[type] = (
        (parseFloat(byAssetType[type] || '0') + parseFloat(asset.totalYieldGenerated || '0'))
      ).toFixed(2);
    });

    return {
      total: total.toFixed(2),
      byAssetType,
    };
  }

  /**
   * Get yield rate statistics
   */
  async getYieldStatistics(): Promise<{
    averageYieldRate: number;
    maxYieldRate: number;
    minYieldRate: number;
    assetsWithYield: number;
  }> {
    const assets = await this.getAssets();
    const assetsWithYield = assets.filter(a => a.yieldRate && a.yieldRate > 0);

    if (assetsWithYield.length === 0) {
      return {
        averageYieldRate: 0,
        maxYieldRate: 0,
        minYieldRate: 0,
        assetsWithYield: 0,
      };
    }

    const yieldRates = assetsWithYield.map(a => a.yieldRate!);
    
    return {
      averageYieldRate: yieldRates.reduce((sum, rate) => sum + rate, 0) / yieldRates.length,
      maxYieldRate: Math.max(...yieldRates),
      minYieldRate: Math.min(...yieldRates),
      assetsWithYield: assetsWithYield.length,
    };
  }

  // ============================================================================
  // Health & Risk Assessment
  // ============================================================================

  /**
   * Get health metrics for a specific asset
   */
  async getAssetHealth(assetId: string): Promise<AssetHealthMetrics> {
    const asset = await this.getAsset(assetId);
    if (!asset) {
      throw new Error(`Asset ${assetId} not found`);
    }

    return calculateAssetHealth(asset);
  }

  /**
   * Get health scores for all assets
   */
  async getHealthScores(threshold?: number): Promise<Array<{
    assetId: string;
    name: string;
    healthScore: number;
    riskScore: number;
  }>> {
    const assets = await this.getAssets();
    
    let results = assets.map(asset => ({
      assetId: asset.id,
      name: asset.name,
      healthScore: calculateAssetHealth(asset).healthScore,
      riskScore: asset.riskScore || 50,
    }));

    if (threshold !== undefined) {
      results = results.filter(r => r.healthScore < threshold);
    }

    return results.sort((a, b) => a.healthScore - b.healthScore);
  }

  // ============================================================================
  // Metrics & Analytics
  // ============================================================================

  /**
   * Get comprehensive RWA metrics
   */
  async getMetrics(): Promise<RWAMetrics> {
    const cacheKey = 'metrics:all';
    if (this.hasValidCache(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const assets = await this.getAssets();
    const metrics = calculateRWAMetrics(assets);
    
    this.setCache(cacheKey, metrics);
    return metrics;
  }

  /**
   * Get TVL (Total Value Locked) across all assets or by type
   */
  async getTVL(assetType?: string): Promise<{
    total: string;
    byAssetType: { [key: string]: string };
  }> {
    const assets = await this.getAssets(assetType ? { assetType } : undefined);
    
    const byAssetType: { [key: string]: string } = {};
    assets.forEach(asset => {
      const type = asset.assetType;
      byAssetType[type] = (
        (parseFloat(byAssetType[type] || '0') + parseFloat(asset.totalValue))
      ).toFixed(2);
    });

    const total = Object.values(byAssetType)
      .reduce((sum, val) => sum + parseFloat(val), 0)
      .toFixed(2);

    return { total, byAssetType };
  }

  // ============================================================================
  // Export & Integration
  // ============================================================================

  /**
   * Export graph data in specified format
   */
  async exportGraph(format: 'json' | 'csv', filters?: FilterOptions): Promise<string> {
    const graphData = await this.getGraphData(filters);

    if (format === 'json') {
      return exportGraphAsJSON(graphData);
    } else {
      return exportGraphAsCSV(graphData);
    }
  }

  /**
   * Export asset data with compliance and yield history
   */
  async exportAssetData(assetId: string, options: ExportOptions): Promise<any> {
    const asset = await this.getAsset(assetId);
    if (!asset) {
      throw new Error(`Asset ${assetId} not found`);
    }

    const data: any = {
      asset,
    };

    if (options.includeCompliance) {
      data.complianceEvents = await fetchComplianceEvents(assetId);
    }

    if (options.includeYieldHistory) {
      data.yieldDistributions = await fetchYieldDistributions(assetId);
    }

    if (options.format === 'json') {
      return JSON.stringify(data, null, 2);
    } else if (options.format === 'csv') {
      // Convert to CSV format
      return this.convertToCSV(data);
    }

    return data;
  }

  // ============================================================================
  // Real-time Updates
  // ============================================================================

  /**
   * Subscribe to asset updates
   */
  subscribeToAsset(assetId: string, callback: (asset: RWAAsset) => void): () => void {
    if (!this.config.enableWebSocket) {
      console.warn('WebSocket is disabled. Enable it in config to use subscriptions.');
      return () => {};
    }

    return assetSubscription.subscribe(assetId, callback);
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Search assets by query
   */
  async search(query: string): Promise<RWAAsset[]> {
    const assets = await this.getAssets();
    const lowerQuery = query.toLowerCase();

    return assets.filter(
      asset =>
        asset.name.toLowerCase().includes(lowerQuery) ||
        asset.symbol.toLowerCase().includes(lowerQuery) ||
        asset.address.toLowerCase().includes(lowerQuery) ||
        asset.assetType.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get network information
   */
  getNetworkInfo() {
    return {
      chainId: ACTIVE_CHAIN.id,
      name: ACTIVE_CHAIN.name,
      rpcUrl: ACTIVE_CHAIN.rpcUrls.default.http[0],
      explorer: ACTIVE_CHAIN.blockExplorers.default.url,
    };
  }

  /**
   * Clear SDK cache
   */
  clearCache() {
    this.cache.clear();
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  private hasValidCache(key: string): boolean {
    if (!this.cache.has(key)) return false;
    
    const cached = this.cache.get(key);
    if (!cached || !cached.timestamp) return false;

    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  private setCache(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  private convertToCSV(data: any): string {
    // Simple CSV conversion
    return JSON.stringify(data);
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.config.enableWebSocket) {
      assetSubscription.disconnect();
    }
  }
}

// Export singleton instance for easy usage
export const mantleLens = new MantleLens();

// Also export as default for convenience
export default MantleLens;

// Export all types
export * from './types';
export * from './client';
