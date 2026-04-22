import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { alerts, geminiAdvisory, type Signal } from '@/data/mockData';
import { AlertTriangle, ArrowLeft, CheckCircle, X, Sparkles, ShieldAlert, TrendingDown } from 'lucide-react';

const severityBadge = {
  Low: 'bg-safe/10 text-safe',
  Medium: 'bg-warning/10 text-warning',
  High: 'bg-critical/10 text-critical',
};

// Simple cascade visualization
function CascadeGraph({ affectedNodes }: { affectedNodes: string[] }) {
  const nodes = [
    { id: 'chennai', label: 'Chennai Port', x: 200, y: 50, status: 'critical' as const },
    { id: 'wh-bangalore', label: 'Bangalore WH', x: 100, y: 160, status: 'affected' as const },
    { id: 'wh-hyderabad', label: 'Hyderabad WH', x: 300, y: 160, status: 'affected' as const },
    { id: 'wh-pune', label: 'Pune WH', x: 400, y: 120, status: 'safe' as const },
    { id: 'dc-coimbatore', label: 'Coimbatore DC', x: 100, y: 270, status: 'affected' as const },
    { id: 'dc-lucknow', label: 'Lucknow DC', x: 350, y: 270, status: 'safe' as const },
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
    <svg viewBox="0 0 500 320" className="w-full h-full">
      {edges.map((e, i) => {
        const from = getNode(e.from);
        const to = getNode(e.to);
        const isAffected = affectedNodes.includes(e.from) && affectedNodes.includes(e.to);
        return (
          <line
            key={i}
            x1={from.x} y1={from.y} x2={to.x} y2={to.y}
            stroke={isAffected ? '#f59e0b' : '#10b981'}
            strokeWidth={2}
            strokeDasharray={isAffected ? '6,3' : 'none'}
            opacity={0.6}
          />
        );
      })}
      {nodes.map(n => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={n.status === 'critical' ? 22 : 18}
            fill={statusColors[n.status] + '20'}
            stroke={statusColors[n.status]}
            strokeWidth={2}
          />
          <circle cx={n.x} cy={n.y} r={6} fill={statusColors[n.status]} />
          <text x={n.x} y={n.y + 32} textAnchor="middle" fill="hsl(210,20%,85%)" fontSize="10" fontFamily="Inter">
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
      <div className="h-screen flex flex-col bg-[#020617] relative">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">Alert not found</div>
      </div>
    );
  }

  const bannerColor = alert.severity === 'red'
    ? 'bg-critical/20 border-critical/30 text-critical shadow-[0_0_15px_rgba(239,68,68,0.1)]'
    : 'bg-warning/20 border-warning/30 text-warning shadow-[0_0_15px_rgba(245,158,11,0.1)]';

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#020617] relative font-sans">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      
      <div className="relative z-10 flex flex-col h-full">
        <Navbar />

        {/* Alert Banner */}
        <div className={`border-b border-white/5 backdrop-blur-md ${bannerColor} px-6 py-3 flex items-center gap-3`}>
          <AlertTriangle className="w-5 h-5 animate-bounce" />
          <span className="font-bold text-sm tracking-wide">
            {alert.severity === 'red' ? 'CRITICAL' : 'WARNING'} DISRUPTION ALERT — {alert.portName}
          </span>
          <span className="ml-auto text-xs font-medium opacity-80">
            Confidence: {alert.confidence}% • Detected: {new Date(alert.timestamp).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 max-w-7xl mx-auto w-full">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Dashboard
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
              {/* Cascade Graph */}
              <div className="lg:col-span-7 bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-foreground/90 flex items-center gap-2 uppercase tracking-widest">
                    <ShieldAlert className="w-4 h-4 text-critical" />
                    Cascade Blast Radius
                  </h3>
                  <div className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-muted-foreground uppercase tracking-wider">
                    GNN Simulation Active
                  </div>
                </div>
                <div className="h-80 bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                  <CascadeGraph affectedNodes={alert.affectedNodes} />
                </div>
              </div>

              {/* Gemini Advisory */}
              <div className="lg:col-span-5 bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-foreground/90 flex items-center gap-2 uppercase tracking-widest">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Gemini AI Advisory
                  </h3>
                </div>

                {accepted ? (
                  <div className="flex flex-col items-center justify-center h-[320px] text-safe bg-safe/5 rounded-xl border border-safe/20 animate-in fade-in zoom-in duration-300">
                    <CheckCircle className="w-16 h-16 mb-4 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    <p className="font-bold text-lg">Reroute Accepted</p>
                    <p className="text-sm text-muted-foreground mt-2 max-w-[240px] text-center">Batch #7823 redirected via Tuticorin. Tracking updated.</p>
                  </div>
                ) : (
                  <div className="space-y-6 text-sm">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <h4 className="font-bold text-primary text-[10px] uppercase tracking-widest mb-2">Disruption Summary</h4>
                      <p className="text-foreground/80 leading-relaxed italic">"{geminiAdvisory.summary}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Confidence</div>
                        <div className="text-2xl font-bold text-critical">{geminiAdvisory.confidence}%</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Delay Reduc.</div>
                        <div className="text-2xl font-bold text-safe">-{geminiAdvisory.delayReduction}%</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[11px] border-b border-white/5 pb-2">
                        <span className="text-muted-foreground font-bold uppercase tracking-widest">Recommended Route</span>
                        <span className="text-foreground font-semibold">{geminiAdvisory.recommendedRoute}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] border-b border-white/5 pb-2">
                        <span className="text-muted-foreground font-bold uppercase tracking-widest">Cost Delta</span>
                        <span className="text-warning font-semibold">{geminiAdvisory.costDelta}</span>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => setAccepted(true)}
                        className="flex-1 px-6 py-3 rounded-xl bg-primary/20 text-primary border border-primary/30 font-bold text-xs uppercase tracking-widest hover:bg-primary/30 transition-all active:scale-95 shadow-lg shadow-primary/10"
                      >
                        Accept Reroute
                      </button>
                      <Link
                        to="/"
                        className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-muted-foreground font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all text-center flex items-center justify-center"
                      >
                        Dismiss
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Signal Evidence Table */}
            <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-foreground/90 uppercase tracking-widest">Signal Evidence Fusion</h3>
                <div className="flex gap-3">
                    <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Multi-Source Fusion</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-white/10">
                      <th className="text-left py-3 px-4">Signal Type</th>
                      <th className="text-left py-3 px-4">Source</th>
                      <th className="text-left py-3 px-4">Location</th>
                      <th className="text-left py-3 px-4">Severity</th>
                      <th className="text-left py-3 px-4">Fusion Score</th>
                      <th className="text-left py-3 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {alert.signals.map(sig => (
                      <tr key={sig.id} className="hover:bg-white/5 transition-colors group">
                        <td className="py-4 px-4 font-bold text-foreground/90 group-hover:text-primary transition-colors">{sig.type}</td>
                        <td className="py-4 px-4 text-muted-foreground text-xs font-medium">{sig.source}</td>
                        <td className="py-4 px-4 text-muted-foreground text-xs font-medium">{sig.location}</td>
                        <td className="py-4 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm border ${severityBadge[sig.severity]}`}>
                            {sig.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-primary">{(sig.fusionScore * 100).toFixed(0)}%</td>
                        <td className="py-4 px-4 text-muted-foreground text-[10px] font-medium">
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
