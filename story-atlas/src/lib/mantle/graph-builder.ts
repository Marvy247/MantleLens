// Build graph data structure from RWA assets
import { 
  RWAAsset, 
  RWAGraphNode, 
  RWAGraphEdge, 
  RWAGraphData, 
  FilterOptions,
  RWAMetrics,
  AssetHealthMetrics
} from './types';

export function buildRWAGraphData(assets: RWAAsset[]): RWAGraphData {
  const nodes: RWAGraphNode[] = [];
  const edges: RWAGraphEdge[] = [];
  const nodeMap = new Map<string, RWAGraphNode>();

  // Create nodes
  assets.forEach(asset => {
    const node: RWAGraphNode = {
      id: asset.id,
      address: asset.address,
      name: asset.name,
      symbol: asset.symbol,
      assetType: asset.assetType,
      owner: asset.owner,
      totalValue: parseFloat(asset.totalValue),
      yieldRate: asset.yieldRate || 0,
      childCount: asset.childAssets?.length || 0,
      parentCount: asset.parentAssets?.length || 0,
      collateralCount: asset.collateralFor?.length || 0,
      complianceStatus: asset.complianceStatus,
      custodyStatus: asset.custodyStatus,
      custodian: asset.custodian,
      riskScore: asset.riskScore || 50,
      healthScore: calculateHealthScore(asset),
      liquidityScore: asset.liquidityScore,
      collateralFor: asset.collateralFor,
    };

    nodes.push(node);
    nodeMap.set(asset.id, node);
  });

  // Create edges for tokenization/fractionalization relationships
  assets.forEach(asset => {
    if (asset.parentAssets && asset.parentAssets.length > 0) {
      asset.parentAssets.forEach(parentId => {
        if (nodeMap.has(parentId)) {
          const edgeType = asset.assetType === 'synthetic' ? 'tokenization' : 'fractionalization';
          edges.push({
            source: parentId,
            target: asset.id,
            type: edgeType,
            label: edgeType,
          });
        }
      });
    }

    // Create edges for collateral relationships
    if (asset.collateralFor && asset.collateralFor.length > 0) {
      asset.collateralFor.forEach(defiPositionId => {
        if (nodeMap.has(defiPositionId)) {
          edges.push({
            source: asset.id,
            target: defiPositionId,
            type: 'collateral',
            value: parseFloat(asset.totalValue) * 0.8, // Assume 80% collateral ratio
            label: 'collateral',
          });
        }
      });
    }

    // Create yield flow edges (from parent to children showing yield distribution)
    if (asset.childAssets && asset.yieldRate && asset.yieldRate > 0) {
      asset.childAssets.forEach(childId => {
        if (nodeMap.has(childId)) {
          edges.push({
            source: asset.id,
            target: childId,
            type: 'yield-flow',
            value: asset.yieldRate!,
            label: `${asset.yieldRate!.toFixed(2)}% APY`,
          });
        }
      });
    }
  });

  return { nodes, edges };
}

export function filterRWAGraphData(
  graphData: RWAGraphData,
  filters: FilterOptions
): RWAGraphData {
  let filteredNodes = [...graphData.nodes];

  // Search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filteredNodes = filteredNodes.filter(
      node =>
        node.name.toLowerCase().includes(query) ||
        node.symbol.toLowerCase().includes(query) ||
        node.address.toLowerCase().includes(query) ||
        node.assetType.toLowerCase().includes(query)
    );
  }

  // Asset types
  if (filters.assetTypes && filters.assetTypes.length > 0) {
    filteredNodes = filteredNodes.filter(node =>
      filters.assetTypes!.includes(node.assetType)
    );
  }

  // Compliance statuses
  if (filters.complianceStatuses && filters.complianceStatuses.length > 0) {
    filteredNodes = filteredNodes.filter(node =>
      filters.complianceStatuses!.includes(node.complianceStatus)
    );
  }

  // Custody statuses
  if (filters.custodyStatuses && filters.custodyStatuses.length > 0) {
    filteredNodes = filteredNodes.filter(node =>
      filters.custodyStatuses!.includes(node.custodyStatus)
    );
  }

  // Value range
  if (filters.minValue !== undefined) {
    filteredNodes = filteredNodes.filter(node => node.totalValue >= filters.minValue!);
  }
  if (filters.maxValue !== undefined) {
    filteredNodes = filteredNodes.filter(node => node.totalValue <= filters.maxValue!);
  }

  // Yield rate range
  if (filters.minYieldRate !== undefined) {
    filteredNodes = filteredNodes.filter(node => node.yieldRate >= filters.minYieldRate!);
  }
  if (filters.maxYieldRate !== undefined) {
    filteredNodes = filteredNodes.filter(node => node.yieldRate <= filters.maxYieldRate!);
  }

  // Health score
  if (filters.minHealthScore !== undefined) {
    filteredNodes = filteredNodes.filter(node => node.healthScore >= filters.minHealthScore!);
  }

  // Risk score
  if (filters.maxRiskScore !== undefined) {
    filteredNodes = filteredNodes.filter(node => node.riskScore <= filters.maxRiskScore!);
  }

  // Has yield
  if (filters.hasYield) {
    filteredNodes = filteredNodes.filter(node => node.yieldRate > 0);
  }

  // Has children
  if (filters.hasChildren) {
    filteredNodes = filteredNodes.filter(node => node.childCount > 0);
  }

  // Filter edges to only include nodes that passed filters
  const nodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = graphData.edges.filter(
    edge => nodeIds.has(edge.source) && nodeIds.has(edge.target)
  );

  return {
    nodes: filteredNodes,
    edges: filteredEdges,
  };
}

export function calculateRWAMetrics(assets: RWAAsset[]): RWAMetrics {
  const totalValueLocked = assets.reduce((sum, asset) => sum + parseFloat(asset.totalValue), 0);
  const totalYieldGenerated = assets.reduce(
    (sum, asset) => sum + parseFloat(asset.totalYieldGenerated || '0'),
    0
  );

  const assetsWithYield = assets.filter(a => a.yieldRate && a.yieldRate > 0);
  const averageYieldRate = assetsWithYield.length > 0
    ? assetsWithYield.reduce((sum, a) => sum + (a.yieldRate || 0), 0) / assetsWithYield.length
    : 0;

  const compliantAssets = assets.filter(a => a.complianceStatus === 'compliant').length;
  const complianceRate = assets.length > 0 ? (compliantAssets / assets.length) * 100 : 0;

  const avgRiskScore = assets.reduce((sum, a) => sum + (a.riskScore || 0), 0) / assets.length;
  const avgHealthScore = assets.reduce(
    (sum, a) => sum + calculateHealthScore(a),
    0
  ) / assets.length;

  // Mock alert counts - would come from monitoring system
  const totalAlerts = Math.floor(assets.length * 0.15);
  const criticalAlerts = Math.floor(totalAlerts * 0.1);

  return {
    totalAssets: assets.length,
    totalValueLocked: totalValueLocked.toFixed(2),
    totalYieldGenerated: totalYieldGenerated.toFixed(2),
    averageYieldRate: parseFloat(averageYieldRate.toFixed(2)),
    complianceRate: parseFloat(complianceRate.toFixed(2)),
    avgRiskScore: parseFloat(avgRiskScore.toFixed(2)),
    avgHealthScore: parseFloat(avgHealthScore.toFixed(2)),
    totalAlerts,
    criticalAlerts,
  };
}

export function calculateHealthScore(asset: RWAAsset): number {
  let score = 100;

  // Compliance impact (30% weight)
  switch (asset.complianceStatus) {
    case 'compliant':
      score -= 0;
      break;
    case 'pending':
      score -= 15;
      break;
    case 'expired':
      score -= 30;
      break;
    case 'failed':
      score -= 40;
      break;
    case 'not-required':
      score -= 5;
      break;
  }

  // Risk score impact (30% weight)
  score -= (asset.riskScore || 0) * 0.3;

  // Liquidity impact (20% weight)
  const liquidityPenalty = (100 - (asset.liquidityScore || 70)) * 0.2;
  score -= liquidityPenalty;

  // Audit recency (10% weight)
  if (asset.lastAuditDate) {
    const daysSinceAudit = (Date.now() / 1000 - asset.lastAuditDate) / (24 * 60 * 60);
    if (daysSinceAudit > 180) score -= 10;
    else if (daysSinceAudit > 90) score -= 5;
  }

  // Custody status (10% weight)
  switch (asset.custodyStatus) {
    case 'bank-custody':
    case 'qualified-custodian':
      score -= 0;
      break;
    case 'smart-contract':
      score -= 3;
      break;
    case 'multi-sig':
      score -= 5;
      break;
    case 'self-custody':
      score -= 10;
      break;
  }

  return Math.max(0, Math.min(100, score));
}

export function calculateAssetHealth(asset: RWAAsset): AssetHealthMetrics {
  const healthScore = calculateHealthScore(asset);
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Compliance checks
  const complianceScore = asset.complianceStatus === 'compliant' ? 100 :
    asset.complianceStatus === 'pending' ? 70 :
    asset.complianceStatus === 'expired' ? 30 : 20;

  if (asset.complianceStatus !== 'compliant') {
    issues.push(`Compliance status: ${asset.complianceStatus}`);
    recommendations.push('Update compliance documentation and renew certificates');
  }

  // Audit checks
  if (asset.lastAuditDate) {
    const daysSinceAudit = (Date.now() / 1000 - asset.lastAuditDate) / (24 * 60 * 60);
    if (daysSinceAudit > 180) {
      issues.push('Audit report overdue (>180 days)');
      recommendations.push('Schedule independent audit within 30 days');
    }
  }

  // Liquidity checks
  const liquidityScore = asset.liquidityScore || 50;
  if (liquidityScore < 50) {
    issues.push('Low liquidity score');
    recommendations.push('Improve market depth or add to DEX pools');
  }

  // Risk checks
  if (asset.riskScore && asset.riskScore > 70) {
    issues.push('High risk score detected');
    recommendations.push('Review and mitigate identified risk factors');
  }

  // Yield consistency (mock calculation)
  const yieldConsistency = asset.yieldRate ? 85 + Math.random() * 15 : 0;
  if (asset.yieldRate && yieldConsistency < 70) {
    issues.push('Inconsistent yield distributions');
    recommendations.push('Investigate yield generation stability');
  }

  // Collateralization ratio (for collateralized assets)
  let collateralizationRatio: number | undefined;
  if (asset.collateralFor && asset.collateralFor.length > 0) {
    collateralizationRatio = 150 + Math.random() * 50; // Mock: 150-200%
    if (collateralizationRatio < 120) {
      issues.push('Low collateralization ratio');
      recommendations.push('Add collateral or reduce debt to maintain healthy ratio');
    }
  }

  return {
    assetId: asset.id,
    healthScore,
    riskScore: asset.riskScore || 50,
    complianceScore,
    liquidityScore,
    yieldConsistency,
    collateralizationRatio,
    issues,
    recommendations,
  };
}

export function getNodeColor(node: RWAGraphNode): string {
  // Color by asset type
  const colorMap: { [key: string]: string } = {
    'real-estate': '#10b981', // green
    'bond': '#3b82f6', // blue
    'invoice': '#f59e0b', // amber
    'commodity': '#eab308', // yellow
    'equity': '#8b5cf6', // purple
    'fund-share': '#6366f1', // indigo
    'defi-position': '#06b6d4', // cyan
    'synthetic': '#ec4899', // pink
  };

  return colorMap[node.assetType] || '#6b7280';
}

export function getNodeSize(node: RWAGraphNode): number {
  // Size based on total value (logarithmic scale)
  const baseSize = 5;
  const scaleFactor = 3;
  return baseSize + Math.log10(node.totalValue + 1) * scaleFactor;
}

export function getEdgeColor(edge: RWAGraphEdge): string {
  const colorMap: { [key: string]: string } = {
    'tokenization': '#10b981',
    'fractionalization': '#3b82f6',
    'collateral': '#f59e0b',
    'yield-flow': '#8b5cf6',
    'custody-chain': '#6b7280',
  };

  return colorMap[edge.type] || '#6b7280';
}

export function exportGraphAsJSON(graphData: RWAGraphData): string {
  return JSON.stringify(graphData, null, 2);
}

export function exportGraphAsCSV(graphData: RWAGraphData): string {
  // Nodes CSV
  const nodeHeaders = [
    'ID',
    'Address',
    'Name',
    'Symbol',
    'Asset Type',
    'Total Value',
    'Yield Rate',
    'Health Score',
    'Risk Score',
    'Compliance Status',
  ].join(',');

  const nodeRows = graphData.nodes.map(node => [
    node.id,
    node.address,
    `"${node.name}"`,
    node.symbol,
    node.assetType,
    node.totalValue,
    node.yieldRate,
    node.healthScore,
    node.riskScore,
    node.complianceStatus,
  ].join(','));

  // Edges CSV
  const edgeHeaders = ['Source', 'Target', 'Type', 'Value', 'Label'].join(',');
  const edgeRows = graphData.edges.map(edge => [
    edge.source,
    edge.target,
    edge.type,
    edge.value || '',
    `"${edge.label || ''}"`,
  ].join(','));

  return `# Nodes\n${nodeHeaders}\n${nodeRows.join('\n')}\n\n# Edges\n${edgeHeaders}\n${edgeRows.join('\n')}`;
}

export function calculateGraphMetrics(graphData: RWAGraphData) {
  const metrics = {
    totalNodes: graphData.nodes.length,
    totalEdges: graphData.edges.length,
    avgDegree: 0,
    isolatedNodes: 0,
    avgHealthScore: 0,
    totalValue: 0,
  };

  // Calculate average degree
  const degreeMap = new Map<string, number>();
  graphData.edges.forEach(edge => {
    degreeMap.set(edge.source, (degreeMap.get(edge.source) || 0) + 1);
    degreeMap.set(edge.target, (degreeMap.get(edge.target) || 0) + 1);
  });

  if (degreeMap.size > 0) {
    const totalDegree = Array.from(degreeMap.values()).reduce((sum, deg) => sum + deg, 0);
    metrics.avgDegree = totalDegree / degreeMap.size;
  }

  // Count isolated nodes
  metrics.isolatedNodes = graphData.nodes.filter(node => !degreeMap.has(node.id)).length;

  // Calculate averages
  if (graphData.nodes.length > 0) {
    metrics.avgHealthScore = graphData.nodes.reduce((sum, n) => sum + n.healthScore, 0) / graphData.nodes.length;
    metrics.totalValue = graphData.nodes.reduce((sum, n) => sum + n.totalValue, 0);
  }

  return metrics;
}
