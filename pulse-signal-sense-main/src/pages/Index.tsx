import Navbar from '@/components/layout/Navbar';
import ShipmentSidebar from '@/components/dashboard/ShipmentSidebar';
import IntelPanel from '@/components/dashboard/IntelPanel';
import StatCards from '@/components/dashboard/StatCards';
import MapVisualization from '@/components/dashboard/MapVisualization';

export default function Dashboard() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <ShipmentSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <MapVisualization />
          <StatCards />
        </div>
        <IntelPanel />
      </div>
    </div>
  );
}
