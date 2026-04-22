import { Ship, Radio, ShieldCheck, Clock } from 'lucide-react';

const stats = [
  { label: 'Active Shipments', value: '8', icon: Ship, color: 'text-primary' },
  { label: 'Signals Today', value: '15', icon: Radio, color: 'text-warning' },
  { label: 'Disruptions Prevented', value: '3', icon: ShieldCheck, color: 'text-safe' },
  { label: 'Avg Lead Time', value: '52h', icon: Clock, color: 'text-primary' },
];

export default function StatCards() {
  return (
    <div className="flex gap-4 p-6 border-t border-white/20 bg-white/[0.04] backdrop-blur-3xl shrink-0">
      {stats.map(s => (
        <div key={s.label} className="flex-1 bg-white/[0.08] border border-white/20 rounded-2xl p-6 flex items-center gap-6 hover:bg-white/[0.12] transition-all hover:scale-[1.03] hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] cursor-default group overflow-hidden relative">
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl" />
          
          <div className={`w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 group-hover:border-primary/50 transition-all shadow-inner relative z-10 ${s.color}`}>
            <s.icon className="w-7 h-7 drop-shadow-[0_0_8px_currentColor]" />
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-black text-white leading-none mb-1 group-hover:text-primary transition-colors">{s.value}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
