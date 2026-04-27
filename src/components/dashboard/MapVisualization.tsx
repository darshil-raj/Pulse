import { useEffect, useRef, useState } from 'react';
import { graphNodes } from '@/data/mockData';
import { Radio } from 'lucide-react';

const MAP_BOUNDS = { minLat: 6, maxLat: 30, minLng: 68, maxLng: 92 };

function latLngToXY(lat: number, lng: number, w: number, h: number) {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * w;
  const y = h - ((lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * h;
  return { x, y };
}

const severityColor = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444' };
const statusColor = { safe: '#10b981', watch: '#f59e0b', critical: '#ef4444' };

export default function MapVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [liveSignals, setLiveSignals] = useState<any[]>([]);

  const fetchSignals = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/signals');
      const data = await response.json();
      setLiveSignals(data);
    } catch (err) {
      console.error('Failed to fetch live signals:', err);
    }
  };

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      draw(ctx, rect.width, rect.height);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [liveSignals]);

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for (let i = 0; i < h; i += 50) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

    // India outline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    const outline = [
      [68.7,23.6],[72.8,19.1],[73,15.6],[74.8,12.7],[77.5,8.1],[79.8,9.1],[80.2,13.1],[82,16.2],[86,21.5],[88.5,22],
      [89,26],[88,27.5],[84,26.5],[80,28.6],[77.5,28.7],[76,30],[74,30.5],[72,27],[69,24]
    ];
    ctx.beginPath();
    outline.forEach(([lng, lat], i) => {
      const {x, y} = latLngToXY(lat, lng, w, h);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();

    // Live Signal Blobs
    liveSignals.forEach(sig => {
      const {x, y} = latLngToXY(sig.lat || 13.08, sig.lng || 80.27, w, h);
      const radius = sig.severity === 'High' ? 60 : sig.severity === 'Medium' ? 40 : 25;
      const color = severityColor[sig.severity as keyof typeof severityColor] || '#a1a1aa';
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, color + '50');
      gradient.addColorStop(1, color + '00');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Node markers
    graphNodes.forEach(node => {
      const {x, y} = latLngToXY(node.lat, node.lng, w, h);
      const color = statusColor[node.status as keyof typeof statusColor];
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, node.type === 'port' ? 12 : 8, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'white';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'black';
      ctx.fillText(node.label.toUpperCase(), x, y - 18);
      ctx.shadowBlur = 0;
    });
  }

  return (
    <div className="flex-1 relative bg-white/[0.02] overflow-hidden group cursor-crosshair">
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      {/* Premium Floating Legend */}
      <div className="absolute top-8 right-8 bg-white/[0.08] backdrop-blur-3xl border border-white/20 rounded-3xl p-6 text-[10px] text-white/70 space-y-4 z-10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] border-t-white/40">
        <div className="font-black uppercase tracking-[0.25em] text-primary flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
            Signal Radar
        </div>
        <div className="space-y-3 font-black tracking-widest">
            <div className="flex items-center gap-4 group/item cursor-default">
                <div className="w-3 h-3 rounded-full bg-safe shadow-[0_0_12px_rgba(16,185,129,0.8)] transition-transform group-hover/item:scale-125" /> 
                <span className="group-hover/item:text-white transition-colors">Nominal</span>
            </div>
            <div className="flex items-center gap-4 group/item cursor-default">
                <div className="w-3 h-3 rounded-full bg-warning shadow-[0_0_12px_rgba(245,158,11,0.8)] transition-transform group-hover/item:scale-125" /> 
                <span className="group-hover/item:text-white transition-colors">Alert</span>
            </div>
            <div className="flex items-center gap-4 group/item cursor-default">
                <div className="w-3 h-3 rounded-full bg-critical shadow-[0_0_15px_rgba(239,68,68,1)] transition-transform group-hover/item:scale-125" /> 
                <span className="group-hover/item:text-white transition-colors">Disrupted</span>
            </div>
        </div>
        <div className="h-px bg-white/5 my-2" />
        <div className="text-[9px] font-bold italic text-white/30 uppercase tracking-tighter">Live Fusion Engine 1.0</div>
      </div>
    </div>
  );
}
