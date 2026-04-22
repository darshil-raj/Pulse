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
    <aside className="w-72 border-r border-white/5 bg-card/40 backdrop-blur-md overflow-y-auto shrink-0">
      <div className="p-4 border-b border-white/5">
        <h2 className="text-sm font-semibold text-foreground/90 flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" />
          Active Shipments
        </h2>
      </div>
      <div className="divide-y divide-white/5">
        {shipments.map(s => (
          <Link
            key={s.id}
            to={s.status === 'CRITICAL' ? `/alert/alert-1` : '#'}
            className="block p-4 hover:bg-white/5 transition-all group border-l-2 border-transparent hover:border-primary/50"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{s.batchId}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm border ${statusStyles[s.status]}`}>
                {s.status}
              </span>
            </div>
            <div className="text-sm font-medium text-foreground/90 flex items-center gap-1 group-hover:text-foreground">
              {s.origin} <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary" /> {s.destination}
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] font-medium">
               <span className="text-muted-foreground">{s.cargo}</span>
               <span className={s.riskScore > 50 ? 'text-critical' : 'text-safe'}>Risk: {s.riskScore}%</span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
