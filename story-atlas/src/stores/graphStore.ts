// Zustand store for graph state management
import { create } from 'zustand';
import { RWAGraphNode } from '../lib/mantle/types';
import { GraphNode as LegacyGraphNode } from '../lib/story-protocol/types';

// Support both RWA and legacy types for backward compatibility
type GraphNodeType = RWAGraphNode | LegacyGraphNode;

interface GraphState {
  selectedNode: GraphNodeType | null;
  hoveredNode: GraphNodeType | null;
  highlightedNodes: Set<string>;
  zoomLevel: number;
  isPanMode: boolean;
  
  setSelectedNode: (node: GraphNodeType | null) => void;
  setHoveredNode: (node: GraphNodeType | null) => void;
  setHighlightedNodes: (nodeIds: Set<string>) => void;
  setZoomLevel: (level: number) => void;
  togglePanMode: () => void;
  reset: () => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  selectedNode: null,
  hoveredNode: null,
  highlightedNodes: new Set(),
  zoomLevel: 1,
  isPanMode: false,

  setSelectedNode: (node) => set({ selectedNode: node }),
  setHoveredNode: (node) => set({ hoveredNode: node }),
  setHighlightedNodes: (nodeIds) => set({ highlightedNodes: nodeIds }),
  setZoomLevel: (level) => set({ zoomLevel: level }),
  togglePanMode: () => set((state) => ({ isPanMode: !state.isPanMode })),
  reset: () => set({
    selectedNode: null,
    hoveredNode: null,
    highlightedNodes: new Set(),
    zoomLevel: 1,
    isPanMode: false,
  }),
}));
