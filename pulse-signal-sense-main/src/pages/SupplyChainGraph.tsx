import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  Panel,
  Handle,
  Position,
  type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Navbar from '@/components/layout/Navbar';
import { graphNodes, graphEdges } from '@/data/mockData';
import { Anchor, Warehouse, MapPin, X } from 'lucide-react';

const statusColors = { safe: '#10b981', watch: '#f59e0b', critical: '#ef4444' };

function CustomNode({ data }: NodeProps) {
  const color = statusColors[data.status as keyof typeof statusColors] || '#10b981';
  const Icon = data.nodeType === 'port' ? Anchor : data.nodeType === 'warehouse' ? Warehouse : MapPin;

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center border-2"
        style={{ backgroundColor: color + '20', borderColor: color }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div className="mt-1 text-[10px] font-medium text-foreground text-center whitespace-nowrap">
        {data.label as string}
      </div>
      <div className="text-[9px] font-mono" style={{ color }}>
        Risk: {data.riskScore as number}%
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

// Layout nodes in a tree-like structure
const positions: Record<string, { x: number; y: number }> = {
  'chennai': { x: 200, y: 0 },
  'mumbai': { x: 500, y: 0 },
  'tuticorin': { x: 0, y: 0 },
  'jnpt': { x: 700, y: 0 },
  'kolkata': { x: 900, y: 0 },
  'wh-bangalore': { x: 100, y: 200 },
  'wh-delhi': { x: 700, y: 200 },
  'wh-pune': { x: 500, y: 200 },
  'wh-hyderabad': { x: 300, y: 200 },
  'dc-coimbatore': { x: 0, y: 400 },
  'dc-lucknow': { x: 800, y: 400 },
  'dc-ahmedabad': { x: 550, y: 400 },
};

const initialNodes: Node[] = graphNodes.map(n => ({
  id: n.id,
  type: 'custom',
  position: positions[n.id] || { x: 0, y: 0 },
  data: { label: n.label, status: n.status, riskScore: n.riskScore, nodeType: n.type, activeSignals: n.activeSignals },
}));

const initialEdges: Edge[] = graphEdges.map(e => ({
  id: e.id,
  source: e.source,
  target: e.target,
  animated: e.status === 'critical',
  style: {
    stroke: statusColors[e.status],
    strokeWidth: Math.max(1.5, e.volume / 200),
  },
}));

export default function SupplyChainGraphPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node.id);
  }, []);

  const selected = graphNodes.find(n => n.id === selectedNode);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 relative">
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="hsl(220,14%,18%)" gap={30} />
          <Controls
            className="!bg-card !border-border !rounded-lg"
            style={{ button: { backgroundColor: 'hsl(220,18%,10%)', color: 'white', borderColor: 'hsl(220,14%,18%)' } } as any}
          />
          <Panel position="top-left" className="bg-card/90 backdrop-blur border border-border rounded-lg p-3 m-3">
            <h2 className="text-sm font-semibold text-foreground mb-2">Supply Chain Graph</h2>
            <div className="space-y-1 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-2"><Anchor className="w-3 h-3" /> Ports</div>
              <div className="flex items-center gap-2"><Warehouse className="w-3 h-3" /> Warehouses</div>
              <div className="flex items-center gap-2"><MapPin className="w-3 h-3" /> Distribution Centers</div>
            </div>
          </Panel>
        </ReactFlow>

        {/* Node Detail Panel */}
        {selected && (
          <div className="absolute top-0 right-0 w-80 h-full bg-card border-l border-border p-4 overflow-y-auto z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{selected.label}</h3>
              <button onClick={() => setSelectedNode(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="bg-accent/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Risk Score</div>
                <div className="text-2xl font-bold" style={{ color: statusColors[selected.status] }}>
                  {selected.riskScore}%
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">Status</div>
                <span
                  className="text-xs font-semibold px-2 py-1 rounded"
                  style={{ backgroundColor: statusColors[selected.status] + '20', color: statusColors[selected.status] }}
                >
                  {selected.status.toUpperCase()}
                </span>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">Type</div>
                <div className="text-foreground capitalize">{selected.type}</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">Active Signals</div>
                <div className="text-foreground">{selected.activeSignals}</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-2">Connected Nodes</div>
                <div className="space-y-1">
                  {graphEdges
                    .filter(e => e.source === selected.id || e.target === selected.id)
                    .map(e => {
                      const otherId = e.source === selected.id ? e.target : e.source;
                      const other = graphNodes.find(n => n.id === otherId);
                      return other ? (
                        <div
                          key={e.id}
                          className="flex items-center justify-between bg-accent/30 rounded px-2 py-1.5 cursor-pointer hover:bg-accent"
                          onClick={() => setSelectedNode(other.id)}
                        >
                          <span className="text-xs text-foreground">{other.label}</span>
                          <span className="text-[10px]" style={{ color: statusColors[other.status] }}>
                            {other.riskScore}%
                          </span>
                        </div>
                      ) : null;
                    })}
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">Coordinates</div>
                <div className="text-xs font-mono text-muted-foreground">{selected.lat}°N, {selected.lng}°E</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
