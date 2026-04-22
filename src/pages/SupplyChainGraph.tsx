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
      style={{ filter: `drop-shadow(0 0 12px ${color}60)` }}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 backdrop-blur-xl transition-all hover:scale-110 cursor-pointer"
        style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', borderColor: color }}
      >
        <Icon className="w-8 h-8" style={{ color }} />
      </div>
      <div className="mt-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/5 text-[10px] font-bold text-foreground/90 text-center whitespace-nowrap uppercase tracking-widest">
        {data.label as string}
      </div>
      <div className="text-[9px] font-mono font-bold mt-1" style={{ color }}>
        RISK: {data.riskScore as number}%
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

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
    stroke: statusColors[e.status as keyof typeof statusColors],
    strokeWidth: Math.max(2, e.volume / 150),
    opacity: 0.4,
  },
}));

export default function SupplyChainGraphPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node.id);
  }, []);

  const selected = graphNodes.find(n => n.id === selectedNode);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#020617] relative">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      
      <div className="relative z-10 flex flex-col h-full">
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
            <Background color="rgba(59,130,246,0.05)" gap={30} />
            <Controls
              className="!bg-card/40 !backdrop-blur-md !border-white/10 !rounded-xl"
              style={{ button: { backgroundColor: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.05)' } } as any}
            />
            <Panel position="top-left" className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 m-5 shadow-2xl">
              <h2 className="text-sm font-bold text-foreground/90 uppercase tracking-widest mb-4">Network Topology</h2>
              <div className="space-y-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-3 transition-colors hover:text-primary cursor-default"><Anchor className="w-3.5 h-3.5" /> Core Ports</div>
                <div className="flex items-center gap-3 transition-colors hover:text-primary cursor-default"><Warehouse className="w-3.5 h-3.5" /> Regional Hubs</div>
                <div className="flex items-center gap-3 transition-colors hover:text-primary cursor-default"><MapPin className="w-3.5 h-3.5" /> Distribution</div>
              </div>
            </Panel>
          </ReactFlow>

          {/* Node Detail Panel */}
          {selected && (
            <div className="absolute top-4 right-4 bottom-4 w-80 bg-card/40 backdrop-blur-lg border border-white/10 p-6 overflow-y-auto z-10 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-lg text-foreground/90 uppercase tracking-widest">{selected.label}</h3>
                <button onClick={() => setSelectedNode(null)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6 text-sm">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 group hover:bg-white/10 transition-all">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Impact Probability</div>
                  <div className="text-3xl font-mono font-bold" style={{ color: statusColors[selected.status as keyof typeof statusColors] }}>
                    {selected.riskScore}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</div>
                        <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-sm border inline-block"
                        style={{ backgroundColor: statusColors[selected.status as keyof typeof statusColors] + '20', borderColor: statusColors[selected.status as keyof typeof statusColors] + '40', color: statusColors[selected.status as keyof typeof statusColors] }}
                        >
                        {selected.status.toUpperCase()}
                        </span>
                    </div>
                    <div className="space-y-1 text-right">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Entity</div>
                        <div className="text-foreground/90 font-bold capitalize">{selected.type}</div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Fusion Precursors</div>
                  <div className="text-foreground font-medium text-xs leading-relaxed">{selected.activeSignals}</div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Downstream Dependencies</div>
                  <div className="space-y-2">
                    {graphEdges
                      .filter(e => e.source === selected.id || e.target === selected.id)
                      .map(e => {
                        const otherId = e.source === selected.id ? e.target : e.source;
                        const other = graphNodes.find(n => n.id === otherId);
                        return other ? (
                          <div
                            key={e.id}
                            className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/10 hover:border-primary/30 transition-all"
                            onClick={() => setSelectedNode(other.id)}
                          >
                            <span className="text-xs font-bold text-foreground/80">{other.label}</span>
                            <span className="text-[10px] font-mono font-bold" style={{ color: statusColors[other.status as keyof typeof statusColors] }}>
                              {other.riskScore}%
                            </span>
                          </div>
                        ) : null;
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
