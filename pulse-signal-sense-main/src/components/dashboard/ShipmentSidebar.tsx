import { shipments, type ShipmentStatus } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';

const statusStyles: Record<ShipmentStatus, string> = {
  'ON-TRACK': 'bg-safe/10 text-safe border-safe',
  'AT-RISK': 'bg-warning/10 text-warning border-warning',
  'CRITICAL': 'bg-critical/10 text-critical border-critical',
};

export default function ShipmentSidebar() {
  return (
    <aside className="w-72 border-r border-border bg-card overflow-y-auto shrink-0">
      <div className="p-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Package className="w-4 h-4" />
          Active Shipments
        </h2>
      </div>
      <div className="divide-y divide-border">
        {shipments.map(s => (
          <Link
            key={s.id}
            to={s.status === 'CRITICAL' ? `/alert/alert-1` : '#'}
            className="block p-3 hover:bg-accent/50 transition-colors group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-muted-foreground">{s.batchId}</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${statusStyles[s.status]}`}>
                {s.status}
              </span>
            </div>
            <div className="text-sm text-foreground flex items-center gap-1">
              {s.origin} <ChevronRight className="w-3 h-3 text-muted-foreground" /> {s.destination}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{s.cargo} • Risk: {s.riskScore}%</div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
