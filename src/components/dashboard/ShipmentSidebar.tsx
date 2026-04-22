import { shipments, type ShipmentStatus } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';

const statusStyles: Record<ShipmentStatus, string> = {
  'ON-TRACK': 'bg-safe/10 text-safe border-safe/40 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
  'AT-RISK': 'bg-warning/10 text-warning border-warning/40 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
  'CRITICAL': 'bg-critical/10 text-critical border-critical/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
};

export default function ShipmentSidebar() {
  return (
    <aside className="w-72 border-r border-white/10 bg-white/[0.08] backdrop-blur-3xl overflow-y-auto shrink-0 flex flex-col shadow-2xl">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-sm font-black text-white/90 flex items-center gap-3 uppercase tracking-[0.2em]">
          <Package className="w-4 h-4 text-primary drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
          Live Cargo
        </h2>
      </div>
      <div className="divide-y divide-white/5 flex-1">
        {shipments.map(s => (
          <Link
            key={s.id}
            to={s.status === 'CRITICAL' ? `/alert/alert-1` : '#'}
            className="block p-6 hover:bg-white/[0.06] transition-all group border-l-4 border-transparent hover:border-primary/50 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-black text-white/30 uppercase tracking-widest">{s.batchId}</span>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-sm border ${statusStyles[s.status]}`}>
                {s.status}
              </span>
            </div>
            <div className="text-sm font-black text-white/90 flex items-center gap-2 group-hover:text-white transition-colors">
              {s.origin} <ChevronRight className="w-3.5 h-3.5 text-primary/40 group-hover:text-primary transition-all" /> {s.destination}
            </div>
            <div className="flex items-center justify-between mt-4 text-[10px] font-black uppercase tracking-widest">
               <span className="text-white/40">{s.cargo}</span>
               <span className={s.riskScore > 50 ? 'text-critical drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]' : 'text-safe'}>
                 RISK: {s.riskScore}%
               </span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
