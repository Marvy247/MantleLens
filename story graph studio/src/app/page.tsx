'use client';

import { useGraphData } from '@/lib/hooks/useGraphData';
import { useGraphStore } from '@/stores/graphStore';
import { useFilterStore } from '@/stores/filterStore';
import ForceGraph from '@/components/graph/ForceGraph';
import NodeDetails from '@/components/graph/NodeDetails';
import GraphControls from '@/components/graph/GraphControls';
import LegendPanel from '@/components/graph/LegendPanel';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const filters = useFilterStore();
  const { graphData, metrics, isLoading, isError } = useGraphData(filters);
  const { selectedNode } = useGraphStore();

  // Update dimensions on mount and window resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 100,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Story Graph Studio
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                Interactive IP Relationship Explorer
              </p>
            </div>
            <div className="flex items-center gap-6">
              {!isLoading && (
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-zinc-500">IPs: </span>
                    <span className="font-semibold">{metrics.totalNodes}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Connections: </span>
                    <span className="font-semibold">{metrics.totalEdges}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Isolated: </span>
                    <span className="font-semibold">{metrics.isolatedNodes}</span>
                  </div>
                </div>
              )}
              <appkit-button />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-zinc-400">Loading IP assets from Story Protocol...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center max-w-md">
              <p className="text-red-400 text-lg mb-2">Failed to load data</p>
              <p className="text-zinc-500 text-sm">
                Please check your connection or try again later
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <ForceGraph 
              data={graphData} 
              width={dimensions.width}
              height={dimensions.height}
            />
            <LegendPanel />
            <GraphControls graphData={graphData} />
            {selectedNode && <NodeDetails node={selectedNode} />}
          </div>
        )}
      </main>
    </div>
  );
}
