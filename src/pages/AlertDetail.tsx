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
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">Alert not found</div>
      </div>
    );
  }

  const bannerColor = alert.severity === 'red'
    ? 'bg-critical/10 border-critical text-critical'
    : 'bg-warning/10 border-warning text-warning';

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />

      {/* Alert Banner */}
      <div className={`border-b-2 ${bannerColor} px-6 py-3 flex items-center gap-3`}>
        <AlertTriangle className="w-5 h-5" />
        <span className="font-semibold text-sm">
          {alert.severity === 'red' ? 'CRITICAL' : 'WARNING'} DISRUPTION ALERT — {alert.portName}
        </span>
        <span className="ml-auto text-xs opacity-80">
          Confidence: {alert.confidence}% • Detected: {new Date(alert.timestamp).toLocaleString('en-IN')}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Cascade Graph */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-critical" />
                Cascade Blast Radius
              </h3>
              <div className="h-80">
                <CascadeGraph affectedNodes={alert.affectedNodes} />
              </div>
            </div>

            {/* Gemini Advisory */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Gemini Advisory Panel
              </h3>

              {accepted ? (
                <div className="flex flex-col items-center justify-center h-64 text-safe">
                  <CheckCircle className="w-12 h-12 mb-3" />
                  <p className="font-semibold">Reroute Accepted</p>
                  <p className="text-sm text-muted-foreground mt-1">Cargo being redirected via Tuticorin corridor</p>
                </div>
              ) : (
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Disruption Summary</h4>
                    <p className="text-muted-foreground leading-relaxed">{geminiAdvisory.summary}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-accent/50 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground">Confidence</div>
                      <div className="text-lg font-semibold text-critical">{geminiAdvisory.confidence}%</div>
                    </div>
                    <div className="bg-accent/50 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Delay Reduction</div>
                      <div className="text-lg font-semibold text-safe">{geminiAdvisory.delayReduction}%</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-1">Recommended Route</h4>
                    <p className="text-muted-foreground">{geminiAdvisory.recommendedRoute}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-1">Cost Delta</h4>
                    <p className="text-warning">{geminiAdvisory.costDelta}</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setAccepted(true)}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-safe text-safe-foreground font-medium text-sm hover:bg-safe/90 transition-colors"
                    >
                      Accept Reroute
                    </button>
                    <Link
                      to="/"
                      className="flex-1 px-4 py-2.5 rounded-lg border border-border text-muted-foreground font-medium text-sm hover:bg-accent transition-colors text-center"
                    >
                      Dismiss
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Signal Evidence Table */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Signal Evidence</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-left py-2 px-3">Signal Type</th>
                  <th className="text-left py-2 px-3">Source</th>
                  <th className="text-left py-2 px-3">Location</th>
                  <th className="text-left py-2 px-3">Severity</th>
                  <th className="text-left py-2 px-3">Fusion Score</th>
                  <th className="text-left py-2 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {alert.signals.map(sig => (
                  <tr key={sig.id} className="border-b border-border/50 hover:bg-accent/30">
                    <td className="py-2.5 px-3 font-medium text-foreground">{sig.type}</td>
                    <td className="py-2.5 px-3 text-muted-foreground">{sig.source}</td>
                    <td className="py-2.5 px-3 text-muted-foreground">{sig.location}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${severityBadge[sig.severity]}`}>
                        {sig.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-primary">{(sig.fusionScore * 100).toFixed(0)}%</td>
                    <td className="py-2.5 px-3 text-muted-foreground text-xs">
                      {new Date(sig.timestamp).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
