import Navbar from '@/components/layout/Navbar';
import ShipmentSidebar from '@/components/dashboard/ShipmentSidebar';
import IntelPanel from '@/components/dashboard/IntelPanel';
import StatCards from '@/components/dashboard/StatCards';
import MapVisualization from '@/components/dashboard/MapVisualization';

export default function Dashboard() {
  return (
    <div className="h-screen flex flex-col overflow-hidden site-bg relative">
      {/* Ambient Background Glows - Subdued */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/[0.02] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 flex flex-col h-full gap-4 pb-4">
        <Navbar />
        <div className="flex flex-1 overflow-hidden px-4 gap-4">
          <ShipmentSidebar />
          <div className="flex-1 flex flex-col overflow-hidden relative border border-white/10 rounded-[2.5rem] bg-black/40 shadow-2xl">
            <MapVisualization />
            <StatCards />
          </div>
          <IntelPanel />
        </div>
      </div>
    </div>
  );
}
