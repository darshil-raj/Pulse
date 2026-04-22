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
    <header className="mx-4 mt-4 px-8 h-20 border border-white/10 border-t-white/40 bg-white/[0.05] backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-between shrink-0 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-12">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:bg-white/10 group-hover:scale-110 shadow-xl group-hover:border-white/40">
            <Activity className="w-7 h-7 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white transition-colors">PULSE</span>
        </Link>

        <nav className="flex items-center gap-4">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all border ${
                  active ? 'bg-white/10 text-white border-white/30 shadow-[0_8px_20px_rgba(255,255,255,0.1)]' : 'text-white/40 hover:text-white hover:bg-white/5 border-transparent hover:border-white/10'
                }`}
              >
                <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-white/40'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40">
          <div className="w-2 h-2 rounded-full bg-safe pulse-live shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span>Network Live</span>
        </div>

        <Link to={`/alert/${alerts[0]?.id || 'alert-1'}`} className="relative group">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all">
            <Bell className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-critical text-white text-[10px] font-black flex items-center justify-center border-2 border-black">
                {alertCount}
              </span>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
