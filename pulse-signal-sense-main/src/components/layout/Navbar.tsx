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
    <header className="h-14 border-b border-border bg-card flex items-center px-4 justify-between shrink-0 z-50">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-foreground">PULSE</span>
        </Link>

        <nav className="flex items-center gap-1 ml-4">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
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
