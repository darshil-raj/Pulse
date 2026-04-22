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
  const [advisory, setAdvisory] = useState<string | null>(null);

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
    <aside className="w-80 border-l border-white/5 bg-card/40 backdrop-blur-lg overflow-y-auto shrink-0 flex flex-col">
      <div className="p-4 border-b border-white/5">
        <h2 className="text-sm font-semibold text-foreground/90 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          WhatsApp Intel Reports
        </h2>
      </div>
      
      {/* Input section */}
      <div className="p-4 border-b border-white/5 bg-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter field report..."
            className="flex-1 px-3 py-2 text-sm border border-white/10 rounded-md bg-white/5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !inputText.trim()}
            className="px-3 py-2 bg-primary/20 text-primary border border-primary/30 rounded-md hover:bg-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Reports list */}
      <div className="divide-y divide-white/5 flex-1 overflow-y-auto">
        {reports.map(r => (
          <div key={r.id} className="p-4 hover:bg-white/5 transition-colors group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{r.classification}</span>
              <div className="flex items-center gap-1.5 opacity-80">
                {validationIcon[r.validationStatus]}
                <span className="text-[9px] font-medium">{r.validationStatus}</span>
              </div>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed mb-2 group-hover:text-foreground">{r.message}</p>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.location}</span>
              <span>{new Date(r.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Advisory section */}
      {advisory && (
        <div className="p-4 border-t border-white/5 bg-primary/5">
          <h3 className="text-sm font-semibold text-primary mb-2">AI Advisory</h3>
          <p className="text-xs text-foreground/80 whitespace-pre-wrap leading-relaxed">{advisory}</p>
        </div>
      )}
    </aside>
  );
}
