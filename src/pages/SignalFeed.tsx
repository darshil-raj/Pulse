import { useState, useEffect } from 'react';
import { signals as allSignals, type Signal } from '@/data/mockData';
import Navbar from '@/components/layout/Navbar';
import { Radio, Zap, CloudRain, Ship, MessageSquare, Newspaper, Car, AlertTriangle, Filter, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const typeIcons: Record<Signal['type'], React.ElementType> = {
  'Weather': CloudRain,
  'AIS Vessel': Ship,
  'News Sentiment': Newspaper,
  'Human Intel': MessageSquare,
  'Port Energy': Zap,
  'Traffic': Car,
};

const severityBadge: Record<string, string> = {
  Low: 'bg-safe/10 text-safe border-safe/30',
  Medium: 'bg-warning/10 text-warning border-warning/30',
  High: 'bg-critical/10 text-critical border-critical/30',
};

const signalTypes: Signal['type'][] = ['Weather', 'AIS Vessel', 'News Sentiment', 'Human Intel', 'Port Energy', 'Traffic'];

export default function SignalFeedPage() {
  const [filter, setFilter] = useState<Signal['type'] | 'All'>('All');
  const [liveSignals, setLiveSignals] = useState<Signal[]>(allSignals);
  const [simulating, setSimulating] = useState(false);
  const navigate = useNavigate();

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
    <div className="h-screen flex flex-col overflow-hidden site-bg relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 flex flex-col h-full">
        <Navbar />
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5 bg-card/40 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Radio className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground/90 tracking-tight uppercase tracking-widest">Signal Feed Radar</h1>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-safe pulse-live" />
                  Fusion Core Active • 5s Refresh
                </div>
              </div>
            </div>
            <button
              onClick={handleSimulate}
              disabled={simulating}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-critical/20 text-critical border border-critical/30 text-xs font-bold uppercase tracking-widest hover:bg-critical/30 transition-all active:scale-95 disabled:opacity-50"
            >
              <AlertTriangle className="w-4 h-4" />
              {simulating ? 'Simulating...' : 'Inject Disruption'}
            </button>
          </div>

          <div className="px-6 py-3 border-b border-white/5 bg-white/5 backdrop-blur-sm flex items-center gap-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 pr-4 border-r border-white/10 shrink-0">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Filters</span>
            </div>
            <button
              onClick={() => setFilter('All')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${filter === 'All' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent'}`}
            >
              All Signals
            </button>
            {signalTypes.map(t => {
              const Icon = typeIcons[t];
              return (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 ${filter === t ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent'}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            <div className="max-w-5xl mx-auto space-y-3">
              {filtered.map(sig => {
                const Icon = typeIcons[sig.type];
                return (
                  <div key={sig.id} className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex items-start gap-5 hover:bg-white/5 transition-all group hover:scale-[1.01] cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-all">
                      <Icon className="w-6 h-6 text-foreground/70 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-sm text-foreground/90 uppercase tracking-widest">{sig.type}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm border ${severityBadge[sig.severity]}`}>
                          {sig.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/70 mb-3 leading-relaxed group-hover:text-foreground/90 transition-colors font-medium italic">"{sig.description}"</p>
                      <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {sig.location}</span>
                        <span className="opacity-60">{sig.source}</span>
                        <span className="opacity-60">{new Date(sig.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Fusion Score</div>
                      <div className="text-lg font-mono font-bold text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">{(sig.fusionScore * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
