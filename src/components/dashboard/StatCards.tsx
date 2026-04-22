import { Ship, Radio, ShieldCheck, Clock } from 'lucide-react';

const stats = [
  { label: 'Active Shipments', value: '8', icon: Ship, color: 'text-primary' },
  { label: 'Signals Today', value: '15', icon: Radio, color: 'text-warning' },
  { label: 'Disruptions Prevented', value: '3', icon: ShieldCheck, color: 'text-safe' },
  { label: 'Avg Lead Time', value: '52h', icon: Clock, color: 'text-primary' },
];

export default function StatCards() {
  return (
    <div className="flex gap-3 p-4 border-t border-white/5 bg-card/40 backdrop-blur-md shrink-0">
      {stats.map(s => (
        <div key={s.label} className="flex-1 bg-white/5 border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-all hover:scale-[1.02] cursor-default group">
          <div className={`w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center border border-white/5 group-hover:border-primary/50 transition-all ${s.color}`}>
            <s.icon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-foreground/90 leading-none mb-1 group-hover:text-primary transition-colors">{s.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
