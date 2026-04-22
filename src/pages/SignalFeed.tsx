import { useState, useEffect } from 'react';
import { signals as allSignals, type Signal } from '@/data/mockData';
import Navbar from '@/components/layout/Navbar';
import { Radio, Zap, CloudRain, Ship, MessageSquare, Newspaper, Car, AlertTriangle, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const typeIcons: Record<Signal['type'], React.ElementType> = {
  'Weather': CloudRain,
  'AIS Vessel': Ship,
  'News Sentiment': Newspaper,
  'Human Intel': MessageSquare,
  'Port Energy': Zap,
  'Traffic': Car,
};

const severityBadge = {
  Low: 'bg-safe/10 text-safe border-safe',
  Medium: 'bg-warning/10 text-warning border-warning',
  High: 'bg-critical/10 text-critical border-critical',
};

const signalTypes: Signal['type'][] = ['Weather', 'AIS Vessel', 'News Sentiment', 'Human Intel', 'Port Energy', 'Traffic'];

export default function SignalFeedPage() {
  const [filter, setFilter] = useState<Signal['type'] | 'All'>('All');
  const [liveSignals, setLiveSignals] = useState<Signal[]>(allSignals);
  const [simulating, setSimulating] = useState(false);
  const navigate = useNavigate();

  // Simulated live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSignals(prev => {
        const updated = [...prev];
        const idx = Math.floor(Math.random() * updated.length);
        updated[idx] = { ...updated[idx], timestamp: new Date().toISOString() };
        return updated;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulate = () => {
    setSimulating(true);
    const disruptionSignals: Signal[] = [
      { id: 'sim1', type: 'Port Energy', location: 'Chennai Port', severity: 'High', source: 'Grid Monitor', timestamp: new Date().toISOString(), fusionScore: 0.95, description: '⚠️ CRITICAL: Complete power failure at Container Terminal 3', lat: 13.08, lng: 80.27 },
      { id: 'sim2', type: 'AIS Vessel', location: 'Chennai Anchorage', severity: 'High', source: 'AIS Tracker', timestamp: new Date().toISOString(), fusionScore: 0.91, description: '⚠️ 18 vessels now holding — all berthing suspended', lat: 12.9, lng: 80.5 },
      { id: 'sim3', type: 'Human Intel', location: 'Chennai Port Gate', severity: 'High', source: 'WhatsApp Intel', timestamp: new Date().toISOString(), fusionScore: 0.88, description: '⚠️ Port authority announcing 48hr closure for all operations', lat: 13.08, lng: 80.28 },
    ];
    setLiveSignals(prev => [...disruptionSignals, ...prev]);
    setTimeout(() => {
      navigate('/alert/alert-1');
    }, 2000);
  };

  const filtered = filter === 'All' ? liveSignals : liveSignals.filter(s => s.type === filter);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">Signal Feed</h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-safe pulse-live" />
              Auto-refresh 5s
            </div>
          </div>
          <button
            onClick={handleSimulate}
            disabled={simulating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-critical text-critical-foreground text-sm font-medium hover:bg-critical/90 transition-colors disabled:opacity-50"
          >
            <AlertTriangle className="w-4 h-4" />
            {simulating ? 'Simulating...' : 'Inject Demo Disruption'}
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-4 py-2 border-b border-border bg-card/50 flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <button
            onClick={() => setFilter('All')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${filter === 'All' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
          >
            All
          </button>
          {signalTypes.map(t => {
            const Icon = typeIcons[t];
            return (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${filter === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
              >
                <Icon className="w-3 h-3" />
                {t}
              </button>
            );
          })}
        </div>

        {/* Signal list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.map(sig => {
            const Icon = typeIcons[sig.type];
            return (
              <div key={sig.id} className="bg-card border border-border rounded-lg p-4 flex items-start gap-4 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-foreground">{sig.type}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${severityBadge[sig.severity]}`}>
                      {sig.severity}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 mb-1.5">{sig.description}</p>
                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                    <span>{sig.location}</span>
                    <span>{sig.source}</span>
                    <span>{new Date(sig.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-muted-foreground mb-0.5">Fusion</div>
                  <div className="text-sm font-mono font-semibold text-primary">{(sig.fusionScore * 100).toFixed(0)}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
