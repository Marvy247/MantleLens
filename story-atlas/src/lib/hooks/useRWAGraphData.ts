// React hook for RWA graph data
import { useMemo } from 'react';
import { useRWAAssets } from './useRWAAssets';
import { buildRWAGraphData, filterRWAGraphData, calculateGraphMetrics } from '../mantle/graph-builder';
import { FilterOptions, RWAGraphData } from '../mantle/types';

export function useRWAGraphData(filters: FilterOptions) {
  const { assets, isLoading, isError } = useRWAAssets({ limit: 1000 });

  const graphData: RWAGraphData = useMemo(() => {
    if (!assets || assets.length === 0) {
      return { nodes: [], edges: [] };
    }

    const fullGraph = buildRWAGraphData(assets);
    return filterRWAGraphData(fullGraph, filters);
  }, [assets, filters]);

  const metrics = useMemo(() => {
    return calculateGraphMetrics(graphData);
  }, [graphData]);

  return {
    graphData,
    metrics,
    isLoading,
    isError,
  };
}
