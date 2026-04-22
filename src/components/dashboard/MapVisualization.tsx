import { useEffect, useRef } from 'react';
import { signals, graphNodes } from '@/data/mockData';

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
  }, []);

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(59,130,246,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for (let i = 0; i < h; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

    // India outline hint (simplified polygon)
    ctx.strokeStyle = 'rgba(59,130,246,0.12)';
    ctx.lineWidth = 1.5;
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

    // Heatmap blobs for signals
    signals.forEach(sig => {
      const {x, y} = latLngToXY(sig.lat, sig.lng, w, h);
      const radius = sig.severity === 'High' ? 50 : sig.severity === 'Medium' ? 35 : 20;
      const color = severityColor[sig.severity];
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, color + '40');
      gradient.addColorStop(1, color + '00');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Signal dots
    signals.forEach(sig => {
      const {x, y} = latLngToXY(sig.lat, sig.lng, w, h);
      ctx.fillStyle = severityColor[sig.severity];
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Port/node markers
    graphNodes.forEach(node => {
      const {x, y} = latLngToXY(node.lat, node.lng, w, h);
      const color = statusColor[node.status];
      
      // Outer ring
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, node.type === 'port' ? 10 : 7, 0, Math.PI * 2);
      ctx.stroke();
      
      // Inner dot
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = 'rgba(210,220,240,0.8)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, x, y - 14);
    });
  }

  return (
    <div className="flex-1 relative bg-background overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute top-3 right-3 bg-card/90 backdrop-blur border border-border rounded-lg p-2 text-[10px] text-muted-foreground space-y-1">
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-safe" /> Safe</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-warning" /> Watch</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-critical" /> Critical</div>
      </div>
    </div>
  );
}
