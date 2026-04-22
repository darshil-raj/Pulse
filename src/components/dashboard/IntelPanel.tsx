import { useState, useEffect } from 'react';
import { intelReports } from '@/data/mockData';
import { MessageSquare, CheckCircle, Clock, AlertCircle, Send } from 'lucide-react';

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

    // Add initial pending report
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
      // Call backend API to classify intel
      const response = await fetch('http://127.0.0.1:8000/api/intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: tempInput }),
      });
      
      const data = await response.json();
      
      // Try to parse the result
      try {
        const resultJson = JSON.parse(data.result);
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
    <aside className="w-80 border-l border-border bg-card overflow-y-auto shrink-0 flex flex-col">
      <div className="p-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          WhatsApp Intel Reports
        </h2>
      </div>
      
      {/* Input section */}
      <div className="p-3 border-b border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter field report..."
            className="flex-1 px-3 py-2 text-sm border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !inputText.trim()}
            className="px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Reports list */}
      <div className="divide-y divide-border flex-1 overflow-y-auto">
        {reports.map(r => (
          <div key={r.id} className="p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-primary">{r.classification}</span>
              <div className="flex items-center gap-1">
                {validationIcon[r.validationStatus]}
                <span className="text-[10px] text-muted-foreground">{r.validationStatus}</span>
              </div>
            </div>
            <p className="text-sm text-foreground leading-snug mb-1.5">{r.message}</p>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{r.location}</span>
              <span>{new Date(r.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Advisory section */}
      {advisory && (
        <div className="p-3 border-t border-border bg-muted/50">
          <h3 className="text-sm font-semibold text-foreground mb-2">AI Advisory</h3>
          <p className="text-xs text-foreground whitespace-pre-wrap">{advisory}</p>
        </div>
      )}
    </aside>
  );
}
