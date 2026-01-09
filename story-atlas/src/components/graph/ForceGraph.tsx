'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { RWAGraphData, RWAGraphNode, RWAGraphEdge } from '@/lib/mantle/types';
import { useGraphStore } from '@/stores/graphStore';
import { getNodeColor as getRWANodeColor, getNodeSize as getRWANodeSize } from '@/lib/mantle/graph-builder';

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <div className="text-zinc-400">Loading graph...</div>
    </div>
  ),
});

interface ForceGraphProps {
  data: RWAGraphData;
  width?: number;
  height?: number;
}

export default function ForceGraph({ data, width = 800, height = 600 }: ForceGraphProps) {
  const fgRef = useRef<any>(null);
  const { selectedNode, setSelectedNode, hoveredNode, setHoveredNode, highlightedNodes } = useGraphStore();
  const [graphData, setGraphData] = useState<any>({
    nodes: data.nodes,
    links: data.edges,
  });

  useEffect(() => {
    // Transform edges to links for react-force-graph
    setGraphData({
      nodes: data.nodes,
      links: data.edges,
    });
  }, [data]);

  // Handle node click - PREVENT ZOOM, SHOW DETAILS
  const handleNodeClick = (node: any, event?: MouseEvent) => {
    if (!node) return;
    
    console.log('✅ Node clicked:', node.name);
    
    // Set selected node to show details panel
    setSelectedNode(node as RWAGraphNode);
    
    // Highlight connected nodes
    const connectedNodeIds = new Set<string>();
    connectedNodeIds.add(node.id);
    
    // Add parent and child nodes
    data.edges.forEach(edge => {
      const sourceId = typeof edge.source === 'string' ? edge.source : (edge.source as any).id;
      const targetId = typeof edge.target === 'string' ? edge.target : (edge.target as any).id;
      
      if (sourceId === node.id) {
        connectedNodeIds.add(targetId);
      }
      if (targetId === node.id) {
        connectedNodeIds.add(sourceId);
      }
    });
    
    useGraphStore.setState({ highlightedNodes: connectedNodeIds });
  };

  // Handle node hover
  const handleNodeHover = (node: any) => {
    setHoveredNode(node as RWAGraphNode | null);
  };

  // Node canvas rendering
  const nodeCanvasObject = (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name;
    const fontSize = 12 / globalScale;
    const nodeSize = getRWANodeSize(node);
    const isHighlighted = highlightedNodes.has(node.id);
    const isSelected = selectedNode?.id === node.id;

    // Draw node circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
    ctx.fillStyle = getRWANodeColor(node);
    ctx.fill();

    // Add border for selected/highlighted nodes
    if (isSelected || isHighlighted) {
      ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = (isSelected ? 3 : 2) / globalScale;
      ctx.stroke();
    }

    // Draw label
    if (globalScale > 0.5) {
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, node.x, node.y + nodeSize + fontSize);
    }
  };

  // Link rendering
  const linkCanvasObject = (link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
    const isHighlighted = highlightedNodes.has(sourceId) && highlightedNodes.has(targetId);

    // Determine link style
    ctx.strokeStyle = isHighlighted ? 'rgba(255, 255, 255, 0.8)' : 'rgba(156, 163, 175, 0.3)';
    ctx.lineWidth = (isHighlighted ? 2 : 1) / globalScale;

    // Draw link
    const sourceNode = typeof link.source === 'string' ? null : link.source;
    const targetNode = typeof link.target === 'string' ? null : link.target;

    if (sourceNode && targetNode) {
      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      ctx.stroke();

      // Draw arrow
      if (globalScale > 0.7) {
        const arrowLength = 10 / globalScale;
        const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x);
        const arrowX = targetNode.x - Math.cos(angle) * (getRWANodeSize(targetNode) + 2);
        const arrowY = targetNode.y - Math.sin(angle) * (getRWANodeSize(targetNode) + 2);

        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
          arrowX - arrowLength * Math.cos(angle - Math.PI / 6),
          arrowY - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          arrowX - arrowLength * Math.cos(angle + Math.PI / 6),
          arrowY - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800" style={{ cursor: hoveredNode ? 'pointer' : 'default' }}>
      {data.nodes.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-zinc-400 text-lg mb-2">No assets to display</p>
            <p className="text-zinc-600 text-sm">Try adjusting your filters or check your connection</p>
          </div>
        </div>
      ) : (
        <>
          <ForceGraph2D
            ref={fgRef}
            graphData={graphData}
            width={width}
            height={height}
            backgroundColor="#09090b"
            nodeCanvasObject={nodeCanvasObject}
            linkCanvasObject={linkCanvasObject}
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            onBackgroundClick={() => {
              console.log('Background clicked - clearing selection');
              setSelectedNode(null);
              useGraphStore.setState({ highlightedNodes: new Set() });
            }}
            // Physics settings for smooth movement
            cooldownTicks={100}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
            warmupTicks={100}
            // Interaction settings - Enable mouse wheel zoom, disable node drag
            enableNodeDrag={false}
            enableZoomInteraction={true}
            enablePanInteraction={true}
            // Make nodes easier to click
            nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
              const nodeSize = getRWANodeSize(node);
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(node.x, node.y, nodeSize * 3, 0, 2 * Math.PI);
              ctx.fill();
            }}
          />
          
          {/* Hover Tooltip - Beautiful floating tooltip */}
          {hoveredNode && (
            <div 
              className="absolute pointer-events-none z-50 animate-in fade-in duration-200"
              style={{
                left: '50%',
                top: '20px',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 backdrop-blur-md border-2 border-blue-500/30 rounded-xl px-4 py-3 shadow-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ 
                      backgroundColor: getRWANodeColor(hoveredNode as any)
                    }}
                  />
                  <div className="text-sm font-bold text-white">{hoveredNode.name}</div>
                </div>
                <div className="text-xs text-zinc-400 flex items-center gap-2">
                  <span className="capitalize">
                    {((hoveredNode as any).assetType || (hoveredNode as any).licenseType || 'Asset').replace('-', ' ')}
                  </span>
                  {(hoveredNode as any).totalValue && (
                    <>
                      <span className="text-zinc-600">•</span>
                      <span className="text-blue-400 font-semibold">
                        ${parseFloat((hoveredNode as any).totalValue).toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
                <div className="text-xs text-zinc-500 mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  Click to view details
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
