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
  High: 'bg-critical/10 text-critical border-critical/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
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
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/[0.02] rounded-full blur-[120px] animate-pulse" />
      
      <div className="relative z-10 flex flex-col h-full">
        <Navbar />
        <div className="flex-1 overflow-hidden flex flex-col p-6 gap-6 pt-0">
          {/* Header */}
          <div className="p-8 border border-white/10 border-t-white/40 bg-white/[0.05] backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-xl">
                <Radio className="w-8 h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-widest uppercase">Signal Radar Feed</h1>
                <div className="flex items-center gap-3 text-xs text-white/50 font-black uppercase tracking-[0.2em] mt-1">
                  <div className="w-2 h-2 rounded-full bg-safe animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
                  Live Ingestion Active • 5s Cycle
                </div>
              </div>
            </div>
            <button
              onClick={handleSimulate}
              disabled={simulating}
              className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-white/5 text-white border border-white/20 text-xs font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 shadow-xl"
            >
              <AlertTriangle className="w-5 h-5 text-white/70" />
              {simulating ? 'Injecting Disruption...' : 'Inject Demo Disruption'}
            </button>
          </div>

          {/* Filter bar */}
          <div className="px-8 py-4 border border-white/10 border-t-white/40 bg-white/[0.02] backdrop-blur-2xl rounded-2xl flex items-center gap-4 shadow-xl">
            <div className="flex items-center gap-3 pr-6 border-r border-white/10 shrink-0">
                <Filter className="w-5 h-5 text-white/40" />
                <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Data Stream</span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                <button
                onClick={() => setFilter('All')}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${filter === 'All' ? 'bg-white/10 text-white border-white/30 shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5 border-transparent hover:border-white/10'}`}
                >
                All Sources
                </button>
                {signalTypes.map(t => {
                const Icon = typeIcons[t];
                return (
                    <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shrink-0 whitespace-nowrap border ${filter === t ? 'bg-white/10 text-white border-white/30 shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5 border-transparent hover:border-white/10'}`}
                    >
                    <Icon className="w-3.5 h-3.5" />
                    {t}
                    </button>
                );
                })}
            </div>
          </div>

          {/* Signal list */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 gap-4 max-w-6xl mx-auto pb-6">
              {filtered.map(sig => {
                const Icon = typeIcons[sig.type];
                return (
                  <div key={sig.id} className="bg-white/[0.04] backdrop-blur-3xl border border-white/10 border-t-white/40 rounded-3xl p-6 flex items-start gap-6 hover:bg-white/[0.08] transition-all group hover:scale-[1.01] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer relative overflow-hidden">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/40 transition-all shadow-inner">
                      <Icon className="w-8 h-8 text-white/40 group-hover:text-white transition-colors drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="font-black text-sm text-white uppercase tracking-[0.2em]">{sig.type}</span>
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-sm border ${severityBadge[sig.severity]}`}>
                          {sig.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-base text-white/70 mb-4 leading-relaxed group-hover:text-white transition-colors font-medium italic">"{sig.description}"</p>
                      <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
                        <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 transition-all group-hover:border-white/20"><MapPin className="w-4 h-4 text-white/40" /> {sig.location}</span>
                        <span className="opacity-60">{sig.source}</span>
                        <span className="opacity-60 font-mono">{new Date(sig.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 mb-2">Confidence</div>
                      <div className="text-3xl font-mono font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{(sig.fusionScore * 100).toFixed(0)}%</div>
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
