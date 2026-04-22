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
import { Anchor, Warehouse, MapPin, X, Activity } from 'lucide-react';

const statusColors = { safe: '#10b981', watch: '#f59e0b', critical: '#ef4444' };

function CustomNode({ data }: NodeProps) {
  const color = statusColors[data.status as keyof typeof statusColors] || '#10b981';
  const Icon = data.nodeType === 'port' ? Anchor : data.nodeType === 'warehouse' ? Warehouse : MapPin;

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ filter: `drop-shadow(0 0 15px ${color}60)` }}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <div
        className="w-20 h-20 rounded-[2rem] flex items-center justify-center border-2 backdrop-blur-3xl transition-all hover:scale-110 cursor-pointer shadow-2xl relative overflow-hidden group"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: color }}
      >
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Icon className="w-10 h-10 relative z-10" style={{ color }} />
      </div>
      <div className="mt-3 px-4 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-black text-white text-center whitespace-nowrap uppercase tracking-[0.2em] shadow-xl">
        {data.label as string}
      </div>
      <div className="mt-1 px-2 py-0.5 rounded bg-black/40 text-[9px] font-black tracking-widest border border-white/5" style={{ color }}>
        RISK: {data.riskScore as number}%
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

const positions: Record<string, { x: number; y: number }> = {
  'chennai': { x: 650, y: 0 },
  'mumbai': { x: 950, y: 0 },
  'tuticorin': { x: 400, y: 0 },
  'jnpt': { x: 1200, y: 0 },
  'kolkata': { x: 1450, y: 0 },
  'wh-bangalore': { x: 525, y: 250 },
  'wh-delhi': { x: 1200, y: 250 },
  'wh-pune': { x: 950, y: 250 },
  'wh-hyderabad': { x: 750, y: 250 },
  'dc-coimbatore': { x: 400, y: 500 },
  'dc-lucknow': { x: 1300, y: 500 },
  'dc-ahmedabad': { x: 1000, y: 500 },
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
    strokeWidth: Math.max(3, e.volume / 100),
    opacity: 0.3,
  },
}));

export default function SupplyChainGraphPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node.id);
  }, []);

  const selected = graphNodes.find(n => n.id === selectedNode);

  return (
    <div className="h-screen flex flex-col overflow-hidden site-bg relative">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/[0.03] rounded-full blur-[120px] animate-pulse" />
      
      <div className="relative z-10 flex flex-col h-full gap-4 pb-4">
        <Navbar />
        <div className="flex-1 relative mx-4 mb-4 border border-white/10 rounded-[2.5rem] bg-white/[0.02] overflow-hidden shadow-2xl">
          <ReactFlow
            nodes={initialNodes}
            edges={initialEdges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
            fitViewOptions={{ padding: 0.4 }}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="rgba(255,255,255,0.03)" gap={40} />
            <Controls
              className="!bg-white/5 !backdrop-blur-3xl !border-white/10 !rounded-2xl !p-2 shadow-2xl"
              style={{ button: { backgroundColor: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.1)' } } as any}
            />
            <Panel position="bottom-left" className="bg-white/[0.08] backdrop-blur-3xl border border-white/20 border-t-white/40 rounded-3xl p-6 m-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-[240px]">
              <h2 className="text-xs font-black text-white uppercase tracking-[0.25em] mb-4 flex items-center gap-3">
                <Activity className="w-4 h-4 text-white/70" />
                Network Topology
              </h2>
              <div className="space-y-3 text-[10px] font-black text-white/50 uppercase tracking-widest">
                <div className="flex items-center gap-3 hover:text-white transition-colors cursor-default pl-1 border-l-2 border-white/20 hover:border-white/60"><Anchor className="w-3.5 h-3.5 text-white/60" /> Core Ports</div>
                <div className="flex items-center gap-3 hover:text-white transition-colors cursor-default pl-1 border-l-2 border-white/20 hover:border-white/60"><Warehouse className="w-3.5 h-3.5 text-white/60" /> Hubs</div>
                <div className="flex items-center gap-3 hover:text-white transition-colors cursor-default pl-1 border-l-2 border-white/20 hover:border-white/60"><MapPin className="w-3.5 h-3.5 text-white/60" /> Last-Mile</div>
              </div>
            </Panel>
          </ReactFlow>

          {/* Node Detail Panel */}
          {selected && (
            <div className="absolute top-8 right-8 bottom-8 w-96 bg-white/[0.05] backdrop-blur-3xl border border-white/10 border-t-white/40 p-8 overflow-y-auto z-10 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.6)] animate-in slide-in-from-right duration-500">
              <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="font-black text-2xl text-white uppercase tracking-tighter">{selected.label}</h3>
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mt-1">Intelligence Profile</div>
                </div>
                <button onClick={() => setSelectedNode(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white/40 hover:text-white border border-white/10 shadow-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="bg-white/5 border border-white/10 border-t-white/20 rounded-3xl p-8 group hover:bg-white/10 transition-all shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity blur-3xl" />
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 relative z-10">Cascade Probability</div>
                  <div className="text-5xl font-mono font-black relative z-10" style={{ color: statusColors[selected.status as keyof typeof statusColors] }}>
                    {selected.riskScore}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Status</div>
                        <span
                        className="text-[10px] font-black px-3 py-1 rounded-md border inline-block shadow-lg backdrop-blur-md"
                        style={{ backgroundColor: statusColors[selected.status as keyof typeof statusColors] + '20', borderColor: statusColors[selected.status as keyof typeof statusColors] + '40', color: statusColors[selected.status as keyof typeof statusColors] }}
                        >
                        {selected.status.toUpperCase()}
                        </span>
                    </div>
                    <div className="space-y-2 text-right">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Entity</div>
                        <div className="text-white font-black uppercase tracking-wider">{selected.type}</div>
                    </div>
                </div>

                <div className="bg-white/[0.03] border border-white/10 border-t-white/20 rounded-2xl p-6 shadow-inner">
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-4">Fusion Precursors</div>
                  <div className="text-white/80 font-bold text-xs leading-relaxed italic">"{selected.activeSignals}"</div>
                </div>

                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-6 flex items-center gap-3">
                      <div className="h-px bg-white/10 flex-1" />
                      Dependencies
                      <div className="h-px bg-white/10 flex-1" />
                  </div>
                  <div className="space-y-3">
                    {graphEdges
                      .filter(e => e.source === selected.id || e.target === selected.id)
                      .map(e => {
                        const otherId = e.source === selected.id ? e.target : e.source;
                        const other = graphNodes.find(n => n.id === otherId);
                        return other ? (
                          <div
                            key={e.id}
                            className="flex items-center justify-between bg-white/[0.03] border border-white/10 border-t-white/20 rounded-2xl px-6 py-4 cursor-pointer hover:bg-white/[0.08] hover:border-white/40 transition-all shadow-xl group/node"
                            onClick={() => setSelectedNode(other.id)}
                          >
                            <span className="text-xs font-black text-white/70 group-hover/node:text-white uppercase tracking-widest">{other.label}</span>
                            <span className="text-[11px] font-mono font-black" style={{ color: statusColors[other.status as keyof typeof statusColors] }}>
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
