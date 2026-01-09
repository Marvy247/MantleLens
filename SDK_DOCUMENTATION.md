# MantleLens SDK Documentation

**Crystal-clear visibility into RWA on Mantle Network**

## Installation

```bash
npm install @mantlelens/sdk
# or
yarn add @mantlelens/sdk
```

## Quick Start

```typescript
import { MantleLens } from '@mantlelens/sdk';

// Initialize MantleLens
const lens = new MantleLens({
  network: 'mainnet', // or 'testnet'
  apiKey: 'your-api-key',
  enableWebSocket: true, // optional, default: true
});

// Fetch all RWA assets
const assets = await lens.getAssets();
console.log(`Found ${assets.length} RWA assets`);
```

## Configuration

### SDKConfig Options

```typescript
interface SDKConfig {
  network?: 'mainnet' | 'testnet';  // Default: 'mainnet'
  apiKey?: string;                   // Optional API key for rate limits
  rpcUrl?: string;                   // Custom RPC URL
  enableWebSocket?: boolean;         // Enable real-time updates, default: true
}
```

## Core Methods

### Asset Queries

#### `getAssets(params?)`
Fetch all RWA assets with optional filtering.

```typescript
const assets = await tracker.getAssets({
  limit: 100,
  offset: 0,
  assetType: 'real-estate' // optional filter
});
```

**Returns:** `Promise<RWAAsset[]>`

#### `getAsset(assetId)`
Get a specific asset by ID.

```typescript
const asset = await tracker.getAsset('RWA-12345');
```

**Returns:** `Promise<RWAAsset | null>`

#### `getAssetsByAddress(address)`
Get all assets associated with a contract address.

```typescript
const assets = await tracker.getAssetsByAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
```

**Returns:** `Promise<RWAAsset[]>`

#### `getAssetsByOwner(owner)`
Get all assets owned by a specific address.

```typescript
const myAssets = await tracker.getAssetsByOwner('0xYourWalletAddress');
```

**Returns:** `Promise<RWAAsset[]>`

### Relationship Analysis

#### `getAssetRelationships(assetId)`
Get parent, child, and collateral relationships for an asset.

```typescript
const { parents, children, collateral } = await tracker.getAssetRelationships('RWA-12345');

console.log(`Parents: ${parents.length}`);
console.log(`Children: ${children.length}`);
console.log(`Used as collateral: ${collateral.length}`);
```

**Returns:** 
```typescript
Promise<{
  parents: RWAAsset[];
  children: RWAAsset[];
  collateral: RWAAsset[];
}>
```

#### `getTokenizationLineage(assetId)`
Trace the complete tokenization chain from root asset to current.

```typescript
const lineage = await tracker.getTokenizationLineage('RWA-12345');
// Returns: [rootAsset, intermediateAsset1, intermediateAsset2, currentAsset]
```

**Returns:** `Promise<RWAAsset[]>`

#### `getGraphData(filters?)`
Build complete graph data structure.

```typescript
const graphData = await tracker.getGraphData({
  assetTypes: ['real-estate', 'bond'],
  minYieldRate: 5.0,
  complianceStatuses: ['compliant'],
});

console.log(`Nodes: ${graphData.nodes.length}`);
console.log(`Edges: ${graphData.edges.length}`);
```

**Returns:** `Promise<RWAGraphData>`

### Compliance & Monitoring

#### `getComplianceStatus(assetId)`
Get compliance status and event history.

```typescript
const compliance = await tracker.getComplianceStatus('RWA-12345');

if (compliance.isCompliant) {
  console.log('Asset is compliant ✅');
} else {
  console.log(`Status: ${compliance.status}`);
  console.log(`Last audit: ${new Date(compliance.lastAudit! * 1000).toLocaleDateString()}`);
}
```

**Returns:** 
```typescript
Promise<{
  status: string;
  events: ComplianceEvent[];
  isCompliant: boolean;
  lastAudit?: number;
}>
```

#### `getAlerts(params?)`
Get monitoring alerts with filtering.

```typescript
// Get all unresolved critical alerts
const criticalAlerts = await tracker.getAlerts({
  severity: 'critical',
  resolved: false,
  limit: 50,
});

criticalAlerts.forEach(alert => {
  console.log(`[${alert.severity.toUpperCase()}] ${alert.message}`);
});
```

**Returns:** `Promise<MonitoringAlert[]>`

#### `getCriticalAlerts()`
Shorthand for getting unresolved high/critical alerts.

```typescript
const urgentAlerts = await tracker.getCriticalAlerts();
console.log(`${urgentAlerts.length} urgent issues require attention`);
```

**Returns:** `Promise<MonitoringAlert[]>`

### Yield & Financial Analysis

#### `getYieldFlows(assetId)`
Get yield distribution history.

```typescript
const distributions = await tracker.getYieldFlows('RWA-12345');

const totalDistributed = distributions.reduce((sum, d) => 
  sum + parseFloat(d.amount), 0
);

console.log(`Total distributed: $${totalDistributed.toLocaleString()}`);
```

**Returns:** `Promise<YieldDistribution[]>`

#### `getTotalYield(params?)`
Calculate total yield across all or filtered assets.

```typescript
const { total, byAssetType } = await tracker.getTotalYield({
  assetType: 'real-estate' // optional
});

console.log(`Total yield: ${total}`);
console.log('By type:', byAssetType);
```

**Returns:** 
```typescript
Promise<{
  total: string;
  byAssetType: { [key: string]: string };
}>
```

#### `getYieldStatistics()`
Get comprehensive yield statistics.

```typescript
const stats = await tracker.getYieldStatistics();

console.log(`Average yield rate: ${stats.averageYieldRate.toFixed(2)}%`);
console.log(`Highest yield: ${stats.maxYieldRate.toFixed(2)}%`);
console.log(`${stats.assetsWithYield} assets generating yield`);
```

**Returns:** 
```typescript
Promise<{
  averageYieldRate: number;
  maxYieldRate: number;
  minYieldRate: number;
  assetsWithYield: number;
}>
```

### Health & Risk Assessment

#### `getAssetHealth(assetId)`
Get comprehensive health metrics for an asset.

```typescript
const health = await tracker.getAssetHealth('RWA-12345');

console.log(`Health score: ${health.healthScore}/100`);
console.log(`Risk score: ${health.riskScore}/100`);
console.log(`Compliance score: ${health.complianceScore}/100`);

if (health.issues.length > 0) {
  console.log('Issues:', health.issues);
  console.log('Recommendations:', health.recommendations);
}
```

**Returns:** `Promise<AssetHealthMetrics>`

#### `getHealthScores(threshold?)`
Get health scores for all assets, optionally filtered by threshold.

```typescript
// Get all assets with health score below 70
const unhealthyAssets = await tracker.getHealthScores(70);

unhealthyAssets.forEach(asset => {
  console.log(`${asset.name}: ${asset.healthScore}/100`);
});
```

**Returns:** 
```typescript
Promise<Array<{
  assetId: string;
  name: string;
  healthScore: number;
  riskScore: number;
}>>
```

### Metrics & Analytics

#### `getMetrics()`
Get comprehensive RWA ecosystem metrics.

```typescript
const metrics = await tracker.getMetrics();

console.log(`Total assets: ${metrics.totalAssets}`);
console.log(`TVL: ${metrics.totalValueLocked}`);
console.log(`Average yield rate: ${metrics.averageYieldRate}%`);
console.log(`Compliance rate: ${metrics.complianceRate}%`);
console.log(`Critical alerts: ${metrics.criticalAlerts}`);
```

**Returns:** `Promise<RWAMetrics>`

#### `getTVL(assetType?)`
Get Total Value Locked, optionally by asset type.

```typescript
const { total, byAssetType } = await tracker.getTVL();

console.log(`Total TVL: ${total}`);
Object.entries(byAssetType).forEach(([type, value]) => {
  console.log(`${type}: ${value}`);
});
```

**Returns:** 
```typescript
Promise<{
  total: string;
  byAssetType: { [key: string]: string };
}>
```

### Export & Integration

#### `exportGraph(format, filters?)`
Export graph data as JSON or CSV.

```typescript
// Export as JSON
const jsonData = await tracker.exportGraph('json', {
  assetTypes: ['real-estate'],
  minHealthScore: 80,
});

// Export as CSV
const csvData = await tracker.exportGraph('csv');
```

**Returns:** `Promise<string>`

#### `exportAssetData(assetId, options)`
Export detailed asset data with history.

```typescript
const data = await tracker.exportAssetData('RWA-12345', {
  format: 'json',
  includeCompliance: true,
  includeYieldHistory: true,
  includeTransactions: false,
});
```

**Returns:** `Promise<any>`

### Real-time Updates

#### `subscribeToAsset(assetId, callback)`
Subscribe to real-time updates for an asset.

```typescript
const unsubscribe = tracker.subscribeToAsset('RWA-12345', (updatedAsset) => {
  console.log('Asset updated:', updatedAsset.name);
  console.log('New value:', updatedAsset.totalValue);
});

// Later, to stop receiving updates:
unsubscribe();
```

**Returns:** `() => void` (unsubscribe function)

### Utility Methods

#### `search(query)`
Search assets by text query.

```typescript
const results = await tracker.search('manhattan');
console.log(`Found ${results.length} matching assets`);
```

**Returns:** `Promise<RWAAsset[]>`

#### `getNetworkInfo()`
Get current network configuration.

```typescript
const info = tracker.getNetworkInfo();
console.log(`Network: ${info.name}`);
console.log(`Chain ID: ${info.chainId}`);
console.log(`RPC: ${info.rpcUrl}`);
console.log(`Explorer: ${info.explorer}`);
```

**Returns:** Network configuration object

#### `clearCache()`
Clear the SDK's internal cache.

```typescript
tracker.clearCache();
```

#### `disconnect()`
Disconnect from WebSocket (cleanup).

```typescript
tracker.disconnect();
```

## Types

### RWAAsset

```typescript
interface RWAAsset {
  id: string;
  address: string;
  name: string;
  symbol: string;
  assetType: RWAAssetType;
  owner: string;
  custodian?: string;
  custodyStatus: CustodyStatus;
  totalSupply: string;
  totalValue: string;
  yieldRate?: number;
  complianceStatus: ComplianceStatus;
  kycRequired: boolean;
  parentAssets?: string[];
  childAssets?: string[];
  healthScore?: number;
  riskScore?: number;
  // ... more fields
}
```

### FilterOptions

```typescript
interface FilterOptions {
  searchQuery?: string;
  assetTypes?: RWAAssetType[];
  complianceStatuses?: ComplianceStatus[];
  custodyStatuses?: CustodyStatus[];
  minValue?: number;
  maxValue?: number;
  minYieldRate?: number;
  maxYieldRate?: number;
  minHealthScore?: number;
  maxRiskScore?: number;
  hasYield?: boolean;
  hasChildren?: boolean;
  dateRange?: {
    start: number;
    end: number;
  };
}
```

## Examples

### Example 1: Portfolio Dashboard

```typescript
const tracker = new MantleAssetTracker({ apiKey: process.env.API_KEY });

// Get user's assets
const myAssets = await tracker.getAssetsByOwner(userAddress);

// Calculate portfolio metrics
const portfolioValue = myAssets.reduce((sum, asset) => 
  sum + parseFloat(asset.totalValue), 0
);

const avgHealth = myAssets.reduce((sum, asset) => 
  sum + (asset.healthScore || 0), 0
) / myAssets.length;

console.log(`Portfolio Value: $${portfolioValue.toLocaleString()}`);
console.log(`Average Health: ${avgHealth.toFixed(1)}/100`);

// Check for alerts
const alerts = await tracker.getAlerts({ resolved: false });
const myAlerts = alerts.filter(a => 
  myAssets.some(asset => asset.id === a.assetId)
);

console.log(`${myAlerts.length} active alerts on your assets`);
```

### Example 2: Compliance Monitoring

```typescript
const tracker = new MantleAssetTracker();

// Get all assets
const assets = await tracker.getAssets();

// Check compliance for each
const complianceReport = await Promise.all(
  assets.map(async (asset) => {
    const compliance = await tracker.getComplianceStatus(asset.id);
    return {
      name: asset.name,
      status: compliance.status,
      isCompliant: compliance.isCompliant,
    };
  })
);

// Filter non-compliant
const issues = complianceReport.filter(r => !r.isCompliant);
console.log(`${issues.length} assets need attention`);
```

### Example 3: Yield Tracking

```typescript
const tracker = new MantleAssetTracker();

// Get yield statistics
const yieldStats = await tracker.getYieldStatistics();
console.log(`Platform avg yield: ${yieldStats.averageYieldRate.toFixed(2)}%`);

// Get top yielding assets
const assets = await tracker.getAssets();
const topYielders = assets
  .filter(a => a.yieldRate && a.yieldRate > 0)
  .sort((a, b) => (b.yieldRate || 0) - (a.yieldRate || 0))
  .slice(0, 10);

console.log('Top 10 yielding assets:');
topYielders.forEach((asset, i) => {
  console.log(`${i + 1}. ${asset.name}: ${asset.yieldRate}% APY`);
});
```

## Error Handling

```typescript
try {
  const asset = await tracker.getAsset('RWA-12345');
  if (!asset) {
    console.log('Asset not found');
  }
} catch (error) {
  console.error('Error fetching asset:', error);
}
```

## Best Practices

1. **Caching**: The SDK caches responses for 60 seconds. Use `clearCache()` if you need fresh data immediately.

2. **WebSocket**: Enable WebSocket for real-time updates, but remember to call `disconnect()` when cleaning up.

3. **Rate Limits**: Use an API key to get higher rate limits.

4. **Batch Requests**: When fetching multiple assets, use `getAssets()` instead of multiple `getAsset()` calls.

5. **Error Handling**: Always wrap SDK calls in try-catch blocks.

## Support

- **Documentation**: https://docs.mantle-atlas.xyz
- **GitHub**: https://github.com/yourusername/mantle-asset-atlas
- **Discord**: https://discord.gg/mantle-atlas

## License

MIT License - see LICENSE file for details.
