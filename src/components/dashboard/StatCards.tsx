import { Ship, Radio, ShieldCheck, Clock } from 'lucide-react';

const stats = [
  { label: 'Active Shipments', value: '8', icon: Ship, color: 'text-primary' },
  { label: 'Signals Today', value: '15', icon: Radio, color: 'text-warning' },
  { label: 'Disruptions Prevented', value: '3', icon: ShieldCheck, color: 'text-safe' },
  { label: 'Avg Lead Time', value: '52h', icon: Clock, color: 'text-primary' },
];

export default function StatCards() {
  return (
    <div className="flex gap-3 p-3 border-t border-border bg-card shrink-0">
      {stats.map(s => (
        <div key={s.label} className="flex-1 bg-accent/50 rounded-lg p-3 flex items-center gap-3">
          <div className={`${s.color}`}>
            <s.icon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">{s.value}</div>
            <div className="text-[11px] text-muted-foreground">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
