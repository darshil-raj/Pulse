import { Link, useLocation } from 'react-router-dom';
import { Activity, Radio, AlertTriangle, GitBranch, Bell } from 'lucide-react';
import { alerts } from '@/data/mockData';

const navItems = [
  { path: '/', label: 'Dashboard', icon: Activity },
  { path: '/signals', label: 'Signal Feed', icon: Radio },
  { path: '/graph', label: 'Supply Chain', icon: GitBranch },
];

export default function Navbar() {
  const location = useLocation();
  const alertCount = alerts.length;

  return (
    <header className="h-16 border-b border-white/10 bg-white/[0.06] backdrop-blur-xl flex items-center px-6 justify-between shrink-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center transition-all group-hover:bg-white/20 group-hover:scale-110 shadow-xl">
            <Activity className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white transition-colors group-hover:text-primary">PULSE</span>
        </Link>

        <nav className="flex items-center gap-3 ml-8">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all ${
                  active ? 'bg-white/20 text-white border border-white/30 shadow-[0_4px_15px_rgba(255,255,255,0.1)]' : 'text-white/50 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-safe pulse-live" />
          <span>Live</span>
        </div>

        <Link to={`/alert/${alerts[0]?.id || 'alert-1'}`} className="relative">
          <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-critical text-critical-foreground text-[10px] font-bold flex items-center justify-center">
              {alertCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
