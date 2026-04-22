import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { alerts, geminiAdvisory } from '@/data/mockData';
import { AlertTriangle, ArrowLeft, CheckCircle, Sparkles, ShieldAlert, TrendingDown, MapPin } from 'lucide-react';

const severityBadge: Record<string, string> = {
  Low: 'bg-safe/10 text-safe border-safe/30',
  Medium: 'bg-warning/10 text-warning border-warning/30',
  High: 'bg-critical/10 text-critical border-critical/30',
};

// Simple cascade visualization
function CascadeGraph({ affectedNodes }: { affectedNodes: string[] }) {
  const nodes = [
    { id: 'chennai', label: 'Chennai Port', x: 250, y: 50, status: 'critical' as const },
    { id: 'wh-bangalore', label: 'Bangalore WH', x: 150, y: 160, status: 'affected' as const },
    { id: 'wh-hyderabad', label: 'Hyderabad WH', x: 350, y: 160, status: 'affected' as const },
    { id: 'wh-pune', label: 'Pune WH', x: 450, y: 120, status: 'safe' as const },
    { id: 'dc-coimbatore', label: 'Coimbatore DC', x: 150, y: 270, status: 'affected' as const },
    { id: 'dc-lucknow', label: 'Lucknow DC', x: 400, y: 270, status: 'safe' as const },
  ];

  const edges = [
    { from: 'chennai', to: 'wh-bangalore' },
    { from: 'chennai', to: 'wh-hyderabad' },
    { from: 'chennai', to: 'wh-pune' },
    { from: 'wh-bangalore', to: 'dc-coimbatore' },
    { from: 'wh-hyderabad', to: 'dc-lucknow' },
  ];

  const statusColors = {
    critical: '#ef4444',
    affected: '#f59e0b',
    safe: '#10b981',
  };

  const getNode = (id: string) => nodes.find(n => n.id === id)!;

  return (
    <svg viewBox="0 0 500 320" className="w-full h-full drop-shadow-2xl">
      {edges.map((e, i) => {
        const from = getNode(e.from);
        const to = getNode(e.to);
        const isAffected = affectedNodes.includes(e.from) && affectedNodes.includes(e.to);
        return (
          <line
            key={i}
            x1={from.x} y1={from.y} x2={to.x} y2={to.y}
            stroke={isAffected ? '#f59e0b' : '#10b981'}
            strokeWidth={3}
            strokeDasharray={isAffected ? '8,4' : 'none'}
            opacity={0.4}
          />
        );
      })}
      {nodes.map(n => (
        <g key={n.id} className="cursor-pointer group">
          <circle cx={n.x} cy={n.y} r={n.status === 'critical' ? 24 : 20}
            fill={statusColors[n.status] + '15'}
            stroke={statusColors[n.status]}
            strokeWidth={2.5}
            className="transition-all group-hover:stroke-white"
          />
          <circle cx={n.x} cy={n.y} r={7} fill={statusColors[n.status]} className="shadow-lg" />
          <text x={n.x} y={n.y + 40} textAnchor="middle" fill="white" fontSize="10" fontWeight="900" fontFamily="Inter" className="uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function AlertDetail() {
  const { id } = useParams();
  const alert = alerts.find(a => a.id === id) || alerts[0];
  const [accepted, setAccepted] = useState(false);

  if (!alert) {
    return (
      <div className="h-screen flex flex-col site-bg relative">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-white/50 font-black uppercase tracking-widest">Alert Profile Null</div>
      </div>
    );
  }

  const bannerColor = alert.severity === 'red'
    ? 'bg-critical/20 border-critical/40 text-critical shadow-[0_0_25px_rgba(239,68,68,0.2)]'
    : 'bg-warning/20 border-warning/40 text-warning shadow-[0_0_25px_rgba(245,158,11,0.2)]';

  return (
    <div className="h-screen flex flex-col overflow-hidden site-bg relative font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      
      <div className="relative z-10 flex flex-col h-full">
        <Navbar />

        {/* Alert Banner */}
        <div className={`border-b border-white/20 backdrop-blur-3xl ${bannerColor} px-8 py-5 flex items-center gap-4`}>
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shadow-lg border border-white/20">
            <AlertTriangle className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <span className="font-black text-lg tracking-[0.2em] uppercase">
                {alert.severity === 'red' ? 'Critical' : 'Elevated'} Threat — {alert.portName}
            </span>
            <div className="flex gap-4 mt-1 text-[10px] font-black uppercase tracking-widest opacity-70">
                <span>Confidence: {alert.confidence}%</span>
                <span>Detected: {new Date(alert.timestamp).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
            <Link to="/" className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white/50 hover:text-primary transition-all group">
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" /> Back to Intelligence Core
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Cascade Graph */}
              <div className="lg:col-span-7 bg-white/[0.08] backdrop-blur-3xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-critical to-transparent opacity-50" />
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-white uppercase tracking-[0.25em] flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-critical drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                    Network Blast Radius
                  </h3>
                  <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-white/40 uppercase tracking-widest">
                    GNN Simulation: LIVE
                  </div>
                </div>
                <div className="h-96 bg-black/20 rounded-2xl border border-white/10 flex items-center justify-center shadow-inner">
                  <CascadeGraph affectedNodes={alert.affectedNodes} />
                </div>
              </div>

              {/* Gemini Advisory */}
              <div className="lg:col-span-5 bg-white/[0.08] backdrop-blur-3xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-white uppercase tracking-[0.25em] flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-primary drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                    Gemini Insight
                  </h3>
                </div>

                {accepted ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-safe bg-white/5 rounded-2xl border border-safe/30 animate-in zoom-in duration-500 shadow-inner">
                    <div className="w-24 h-24 rounded-full bg-safe/20 border-2 border-safe flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                        <CheckCircle className="w-12 h-12" />
                    </div>
                    <p className="font-black text-2xl uppercase tracking-widest">Reroute Active</p>
                    <p className="text-xs text-white/50 mt-3 font-bold uppercase tracking-[0.1em] text-center max-w-[280px]">Node synchronization complete. Cargo re-manifested via Tuticorin Corridor.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-inner">
                      <h4 className="font-black text-primary text-[10px] uppercase tracking-[0.25em] mb-3">Intelligence Summary</h4>
                      <p className="text-base text-white/80 leading-relaxed font-medium italic">"{geminiAdvisory.summary}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all shadow-inner">
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Confidence</div>
                        <div className="text-3xl font-mono font-black text-critical drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">{geminiAdvisory.confidence}%</div>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all shadow-inner">
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-safe" /> Lead-Time Sav.</div>
                        <div className="text-3xl font-mono font-black text-safe drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">-{geminiAdvisory.delayReduction}%</div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="flex justify-between items-center text-xs border-b border-white/10 pb-4">
                        <span className="text-white/40 font-black uppercase tracking-widest">Target Path</span>
                        <span className="text-white font-black uppercase tracking-wider">{geminiAdvisory.recommendedRoute}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-b border-white/10 pb-4">
                        <span className="text-white/40 font-black uppercase tracking-widest">Cost Impact</span>
                        <span className="text-warning font-black uppercase tracking-wider">{geminiAdvisory.costDelta}</span>
                      </div>
                    </div>

                    <div className="flex gap-6 pt-4">
                      <button
                        onClick={() => setAccepted(true)}
                        className="flex-1 px-8 py-4 rounded-2xl bg-white text-black border border-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white/90 hover:scale-[1.02] transition-all active:scale-95 shadow-[0_10px_25px_rgba(255,255,255,0.2)]"
                      >
                        Accept Logic
                      </button>
                      <Link
                        to="/"
                        className="flex-1 px-8 py-4 rounded-2xl bg-white/5 border border-white/20 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all text-center flex items-center justify-center shadow-xl"
                      >
                        Ignore
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Signal Evidence Table */}
            <div className="bg-white/[0.08] backdrop-blur-3xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.25em]">Multi-Source Signal Evidence</h3>
                <div className="flex gap-4">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_rgba(59,130,246,1)]" /> Fusion Score Calculated</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] border-b border-white/10">
                      <th className="text-left py-4 px-6">Signal Type</th>
                      <th className="text-left py-4 px-6">Source</th>
                      <th className="text-left py-4 px-6">Impact Node</th>
                      <th className="text-left py-4 px-6">Threat</th>
                      <th className="text-left py-4 px-6">Fusion Score</th>
                      <th className="text-left py-4 px-6 text-right">Detected</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {alert.signals.map(sig => (
                      <tr key={sig.id} className="hover:bg-white/[0.04] transition-all group">
                        <td className="py-5 px-6 font-black text-white uppercase tracking-widest group-hover:text-primary transition-colors">{sig.type}</td>
                        <td className="py-5 px-6 text-white/60 text-xs font-bold uppercase tracking-tighter">{sig.source}</td>
                        <td className="py-5 px-6 text-white/60 text-xs font-bold uppercase tracking-tighter">{sig.location}</td>
                        <td className="py-5 px-6">
                          <span className={`text-[10px] font-black px-3 py-1 rounded-sm border ${severityBadge[sig.severity]}`}>
                            {sig.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-5 px-6 font-mono font-black text-primary drop-shadow-[0_0_5px_rgba(59,130,246,0.4)]">{(sig.fusionScore * 100).toFixed(0)}%</td>
                        <td className="py-5 px-6 text-white/40 text-[10px] font-bold uppercase tracking-widest text-right">
                          {new Date(sig.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
