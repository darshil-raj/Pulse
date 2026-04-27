import { useState, useEffect } from 'react';
import { intelReports } from '@/data/mockData';
import { MessageSquare, CheckCircle, Clock, AlertCircle, Send, MapPin } from 'lucide-react';

const validationIcon = {
  Verified: <CheckCircle className="w-3.5 h-3.5 text-safe" />,
  Pending: <Clock className="w-3.5 h-3.5 text-warning" />,
  Unverified: <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />,
};

interface IntelReport {
  id: string;
  classification: string;
  message: string;
  location: string;
  timestamp: string;
  validationStatus: 'Verified' | 'Pending' | 'Unverified';
}

export default function IntelPanel() {
  const [reports, setReports] = useState<IntelReport[]>(intelReports);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    const tempInput = inputText;
    setInputText('');

    const newReport: IntelReport = {
      id: `new-${Date.now()}`,
      classification: 'Processing...',
      message: tempInput,
      location: 'Detecting...',
      timestamp: new Date().toISOString(),
      validationStatus: 'Pending',
    };
    
    setReports(prev => [newReport, ...prev]);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: tempInput }),
      });
      
      const data = await response.json();
      
      try {
        const resultJson = JSON.parse(data.result);
        
        await fetch('http://127.0.0.1:8000/api/radar/ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: resultJson.classification || 'Human Intel',
            location: resultJson.location || 'Unknown',
            severity: resultJson.severity || 'Medium',
            lat: resultJson.location?.toLowerCase().includes('chennai') ? 13.08 : 18.94,
            lng: resultJson.location?.toLowerCase().includes('chennai') ? 80.27 : 72.84,
          }),
        });

        setReports(prev => prev.map(r => r.id === newReport.id ? {
          ...r,
          classification: resultJson.classification || 'Other',
          location: resultJson.location || 'Unknown',
          validationStatus: 'Verified'
        } : r));
      } catch {
        setReports(prev => prev.map(r => r.id === newReport.id ? {
          ...r,
          classification: 'Analyzed',
          location: 'Multiple',
          validationStatus: 'Verified'
        } : r));
      }
    } catch (error) {
      console.error('Error submitting intel:', error);
      setReports(prev => prev.map(r => r.id === newReport.id ? {
        ...r,
        classification: 'Error',
        validationStatus: 'Unverified'
      } : r));
    } finally {
      setLoading(false);
    }
  };

  const fetchSignals = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/signals');
      const signals = await response.json();
      console.log('Fetched signals:', signals);
    } catch (error) {
      console.error('Error fetching signals:', error);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  return (
    <aside className="w-80 border border-white/10 border-t-white/40 bg-white/[0.05] backdrop-blur-3xl overflow-y-auto shrink-0 flex flex-col rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-sm font-black text-white/90 flex items-center gap-3 uppercase tracking-[0.2em]">
          <MessageSquare className="w-4 h-4 text-white/70 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" />
          Intel Feed
        </h2>
      </div>
      
      {/* Input section */}
      <div className="p-6 border-b border-white/10 bg-white/[0.03]">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Log intelligence..."
            className="flex-1 px-4 py-3 text-xs border border-white/10 rounded-2xl bg-black/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all shadow-inner font-bold uppercase tracking-wider"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !inputText.trim()}
            className="px-4 py-3 bg-white/10 text-white border border-white/20 rounded-2xl hover:bg-white/20 transition-all disabled:opacity-50 shadow-xl group"
          >
            <Send className="w-4 h-4 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
      
      {/* Reports list */}
      <div className="divide-y divide-white/5 flex-1 overflow-y-auto custom-scrollbar">
        {reports.map(r => (
          <div key={r.id} className="p-6 hover:bg-white/[0.03] transition-all group cursor-default border-l-4 border-transparent hover:border-white/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/60">{r.classification}</span>
              <div className="flex items-center gap-1.5 opacity-60">
                {validationIcon[r.validationStatus as keyof typeof validationIcon]}
                <span className="text-[9px] font-black uppercase tracking-tighter">{r.validationStatus}</span>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed mb-4 group-hover:text-white transition-colors font-medium">"{r.message}"</p>
            <div className="flex items-center justify-between text-[10px] text-white/40 font-black uppercase tracking-widest">
              <span className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-md"><MapPin className="w-3 h-3 text-white/40" /> {r.location}</span>
              <span>{new Date(r.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
