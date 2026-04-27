export type ShipmentStatus = 'ON-TRACK' | 'AT-RISK' | 'CRITICAL';

export interface Shipment {
  id: string;
  batchId: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  eta: string;
  cargo: string;
  riskScore: number;
}

export interface Signal {
  id: string;
  type: 'Weather' | 'AIS Vessel' | 'News Sentiment' | 'Human Intel' | 'Port Energy' | 'Traffic';
  location: string;
  severity: 'Low' | 'Medium' | 'High';
  source: string;
  timestamp: string;
  fusionScore: number;
  description: string;
  lat: number;
  lng: number;
}

export interface IntelReport {
  id: string;
  timestamp: string;
  location: string;
  classification: string;
  validationStatus: 'Verified' | 'Pending' | 'Unverified';
  message: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'port' | 'warehouse' | 'destination';
  lat: number;
  lng: number;
  riskScore: number;
  status: 'safe' | 'watch' | 'critical';
  activeSignals: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  status: 'safe' | 'watch' | 'critical';
  volume: number;
}

export interface Alert {
  id: string;
  severity: 'amber' | 'red';
  portName: string;
  confidence: number;
  timestamp: string;
  summary: string;
  affectedNodes: string[];
  signals: Signal[];
}

export const shipments: Shipment[] = [
  { id: 's1', batchId: 'BATCH-2024-001', origin: 'Chennai Port', destination: 'Bangalore DC', status: 'CRITICAL', eta: '2024-03-15', cargo: 'Electronics', riskScore: 87 },
  { id: 's2', batchId: 'BATCH-2024-002', origin: 'Mumbai JNPT', destination: 'Delhi Warehouse', status: 'AT-RISK', eta: '2024-03-16', cargo: 'Textiles', riskScore: 62 },
  { id: 's3', batchId: 'BATCH-2024-003', origin: 'Tuticorin Port', destination: 'Coimbatore DC', status: 'ON-TRACK', eta: '2024-03-14', cargo: 'Raw Materials', riskScore: 15 },
  { id: 's4', batchId: 'BATCH-2024-004', origin: 'JNPT', destination: 'Pune Warehouse', status: 'ON-TRACK', eta: '2024-03-17', cargo: 'Auto Parts', riskScore: 22 },
  { id: 's5', batchId: 'BATCH-2024-005', origin: 'Chennai Port', destination: 'Hyderabad DC', status: 'AT-RISK', eta: '2024-03-15', cargo: 'Pharma', riskScore: 55 },
  { id: 's6', batchId: 'BATCH-2024-006', origin: 'Kolkata Port', destination: 'Lucknow DC', status: 'ON-TRACK', eta: '2024-03-18', cargo: 'FMCG', riskScore: 8 },
  { id: 's7', batchId: 'BATCH-2024-007', origin: 'Mumbai JNPT', destination: 'Ahmedabad WH', status: 'ON-TRACK', eta: '2024-03-16', cargo: 'Chemicals', riskScore: 18 },
  { id: 's8', batchId: 'BATCH-2024-008', origin: 'Chennai Port', destination: 'Mumbai DC', status: 'CRITICAL', eta: '2024-03-15', cargo: 'Semiconductors', riskScore: 91 },
];

export const signals: Signal[] = [
  { id: 'sig1', type: 'Port Energy', location: 'Chennai Port', severity: 'High', source: 'Grid Monitor', timestamp: '2024-03-14T10:23:00Z', fusionScore: 0.89, description: 'Anomalous power consumption spike at container terminal 3', lat: 13.0827, lng: 80.2707 },
  { id: 'sig2', type: 'AIS Vessel', location: 'Bay of Bengal', severity: 'High', source: 'AIS Tracker', timestamp: '2024-03-14T09:45:00Z', fusionScore: 0.82, description: '12 vessels holding position outside Chennai anchorage', lat: 12.9, lng: 80.5 },
  { id: 'sig3', type: 'Weather', location: 'Tamil Nadu Coast', severity: 'Medium', source: 'IMD', timestamp: '2024-03-14T08:30:00Z', fusionScore: 0.71, description: 'Cyclonic depression forming, wind speeds 45-55 km/h expected', lat: 12.5, lng: 81.0 },
  { id: 'sig4', type: 'Human Intel', location: 'NH48 Chennai', severity: 'High', source: 'WhatsApp Intel', timestamp: '2024-03-14T10:05:00Z', fusionScore: 0.76, description: 'Trucker reports police checkpost causing 3hr delays on NH48', lat: 13.0, lng: 80.1 },
  { id: 'sig5', type: 'News Sentiment', location: 'Chennai', severity: 'Medium', source: 'News API', timestamp: '2024-03-14T07:15:00Z', fusionScore: 0.65, description: 'Port workers union announces potential strike action next week', lat: 13.1, lng: 80.3 },
  { id: 'sig6', type: 'Traffic', location: 'Sriperumbudur', severity: 'Low', source: 'Traffic API', timestamp: '2024-03-14T09:00:00Z', fusionScore: 0.42, description: 'Moderate congestion on industrial corridor', lat: 12.97, lng: 79.94 },
  { id: 'sig7', type: 'Port Energy', location: 'Mumbai JNPT', severity: 'Low', source: 'Grid Monitor', timestamp: '2024-03-14T10:30:00Z', fusionScore: 0.31, description: 'Normal power consumption patterns', lat: 18.95, lng: 72.95 },
  { id: 'sig8', type: 'AIS Vessel', location: 'Arabian Sea', severity: 'Medium', source: 'AIS Tracker', timestamp: '2024-03-14T08:20:00Z', fusionScore: 0.58, description: '3 container ships deviating from standard route', lat: 18.5, lng: 71.0 },
  { id: 'sig9', type: 'Human Intel', location: 'Pune-Mumbai Exp', severity: 'Medium', source: 'WhatsApp Intel', timestamp: '2024-03-14T09:40:00Z', fusionScore: 0.54, description: 'Driver reports landslide debris partially blocking expressway', lat: 18.7, lng: 73.3 },
  { id: 'sig10', type: 'Weather', location: 'Gujarat Coast', severity: 'Low', source: 'IMD', timestamp: '2024-03-14T06:00:00Z', fusionScore: 0.28, description: 'Clear skies expected for next 72 hours', lat: 21.2, lng: 72.8 },
  { id: 'sig11', type: 'News Sentiment', location: 'Delhi NCR', severity: 'Low', source: 'News API', timestamp: '2024-03-14T08:45:00Z', fusionScore: 0.22, description: 'New logistics park inauguration boosting capacity', lat: 28.6, lng: 77.2 },
  { id: 'sig12', type: 'Traffic', location: 'NH44 Hyderabad', severity: 'Medium', source: 'Traffic API', timestamp: '2024-03-14T10:10:00Z', fusionScore: 0.48, description: 'Road construction causing single-lane traffic for 5km', lat: 17.4, lng: 78.5 },
  { id: 'sig13', type: 'Port Energy', location: 'Tuticorin Port', severity: 'Low', source: 'Grid Monitor', timestamp: '2024-03-14T09:15:00Z', fusionScore: 0.35, description: 'Slight dip in crane operations energy usage', lat: 8.76, lng: 78.13 },
  { id: 'sig14', type: 'Human Intel', location: 'Kolkata Port', severity: 'Low', source: 'WhatsApp Intel', timestamp: '2024-03-14T07:50:00Z', fusionScore: 0.19, description: 'All clear at dock gates, normal processing times', lat: 22.55, lng: 88.35 },
  { id: 'sig15', type: 'AIS Vessel', location: 'Tuticorin Approach', severity: 'Low', source: 'AIS Tracker', timestamp: '2024-03-14T10:00:00Z', fusionScore: 0.25, description: 'Normal vessel queue at anchorage point', lat: 8.5, lng: 78.3 },
];

export const intelReports: IntelReport[] = [
  { id: 'i1', timestamp: '2024-03-14T10:05:00Z', location: 'NH48 Chennai', classification: 'Police Check', validationStatus: 'Verified', message: 'Heavy police checking at Sriperumbudur toll. All trucks being stopped. 3 hour delay minimum.' },
  { id: 'i2', timestamp: '2024-03-14T09:30:00Z', location: 'Chennai Port Gate 4', classification: 'Port Congestion', validationStatus: 'Verified', message: 'Gate 4 is completely jammed. Container stackers not working since morning. Use Gate 2.' },
  { id: 'i3', timestamp: '2024-03-14T08:45:00Z', location: 'Pune-Mumbai Expressway', classification: 'Road Block', validationStatus: 'Pending', message: 'Landslide near Lonavala. Only one lane open. Moving very slow.' },
  { id: 'i4', timestamp: '2024-03-14T07:20:00Z', location: 'Bangalore Ring Road', classification: 'Traffic', validationStatus: 'Verified', message: 'Metro construction blocking two lanes on outer ring road near Marathahalli.' },
  { id: 'i5', timestamp: '2024-03-14T06:55:00Z', location: 'Tuticorin NH', classification: 'Weather Event', validationStatus: 'Unverified', message: 'Heavy rain started. Road visibility poor. Some trucks pulling over.' },
];

export const graphNodes: GraphNode[] = [
  { id: 'chennai', label: 'Chennai Port', type: 'port', lat: 13.08, lng: 80.27, riskScore: 85, status: 'critical', activeSignals: 5 },
  { id: 'mumbai', label: 'Mumbai JNPT', type: 'port', lat: 18.95, lng: 72.95, riskScore: 42, status: 'watch', activeSignals: 3 },
  { id: 'tuticorin', label: 'Tuticorin Port', type: 'port', lat: 8.76, lng: 78.13, riskScore: 18, status: 'safe', activeSignals: 2 },
  { id: 'jnpt', label: 'JNPT Nhava Sheva', type: 'port', lat: 18.93, lng: 72.94, riskScore: 25, status: 'safe', activeSignals: 1 },
  { id: 'kolkata', label: 'Kolkata Port', type: 'port', lat: 22.55, lng: 88.35, riskScore: 10, status: 'safe', activeSignals: 1 },
  { id: 'wh-bangalore', label: 'Bangalore Warehouse', type: 'warehouse', lat: 12.97, lng: 77.59, riskScore: 68, status: 'watch', activeSignals: 1 },
  { id: 'wh-delhi', label: 'Delhi Warehouse', type: 'warehouse', lat: 28.61, lng: 77.21, riskScore: 15, status: 'safe', activeSignals: 0 },
  { id: 'wh-pune', label: 'Pune Warehouse', type: 'warehouse', lat: 18.52, lng: 73.86, riskScore: 35, status: 'watch', activeSignals: 1 },
  { id: 'wh-hyderabad', label: 'Hyderabad Warehouse', type: 'warehouse', lat: 17.38, lng: 78.49, riskScore: 45, status: 'watch', activeSignals: 1 },
  { id: 'dc-coimbatore', label: 'Coimbatore DC', type: 'destination', lat: 11.02, lng: 76.96, riskScore: 12, status: 'safe', activeSignals: 0 },
  { id: 'dc-lucknow', label: 'Lucknow DC', type: 'destination', lat: 26.85, lng: 80.95, riskScore: 5, status: 'safe', activeSignals: 0 },
  { id: 'dc-ahmedabad', label: 'Ahmedabad DC', type: 'destination', lat: 23.02, lng: 72.57, riskScore: 8, status: 'safe', activeSignals: 0 },
];

export const graphEdges: GraphEdge[] = [
  { id: 'e1', source: 'chennai', target: 'wh-bangalore', status: 'critical', volume: 450 },
  { id: 'e2', source: 'chennai', target: 'wh-hyderabad', status: 'watch', volume: 320 },
  { id: 'e3', source: 'chennai', target: 'wh-pune', status: 'watch', volume: 180 },
  { id: 'e4', source: 'mumbai', target: 'wh-delhi', status: 'watch', volume: 600 },
  { id: 'e5', source: 'mumbai', target: 'wh-pune', status: 'safe', volume: 380 },
  { id: 'e6', source: 'jnpt', target: 'wh-pune', status: 'safe', volume: 290 },
  { id: 'e7', source: 'jnpt', target: 'dc-ahmedabad', status: 'safe', volume: 210 },
  { id: 'e8', source: 'tuticorin', target: 'dc-coimbatore', status: 'safe', volume: 250 },
  { id: 'e9', source: 'tuticorin', target: 'wh-bangalore', status: 'safe', volume: 150 },
  { id: 'e10', source: 'kolkata', target: 'dc-lucknow', status: 'safe', volume: 170 },
  { id: 'e11', source: 'kolkata', target: 'wh-delhi', status: 'safe', volume: 200 },
  { id: 'e12', source: 'wh-bangalore', target: 'dc-coimbatore', status: 'watch', volume: 180 },
  { id: 'e13', source: 'wh-delhi', target: 'dc-lucknow', status: 'safe', volume: 280 },
  { id: 'e14', source: 'wh-pune', target: 'dc-ahmedabad', status: 'safe', volume: 160 },
  { id: 'e15', source: 'wh-hyderabad', target: 'wh-bangalore', status: 'watch', volume: 120 },
];

export const alerts: Alert[] = [
  {
    id: 'alert-1',
    severity: 'red',
    portName: 'Chennai Port',
    confidence: 87,
    timestamp: '2024-03-14T10:30:00Z',
    summary: 'Multiple precursor signals indicate imminent disruption at Chennai Port. Port energy consumption anomaly combined with vessel queuing and human intel reports suggest significant delays within 48 hours.',
    affectedNodes: ['chennai', 'wh-bangalore', 'wh-hyderabad', 'dc-coimbatore'],
    signals: signals.filter(s => ['sig1', 'sig2', 'sig3', 'sig4', 'sig5'].includes(s.id)),
  },
  {
    id: 'alert-2',
    severity: 'amber',
    portName: 'Mumbai JNPT',
    confidence: 58,
    timestamp: '2024-03-14T09:00:00Z',
    summary: 'Moderate risk signals detected around Mumbai JNPT corridor. Vessel route deviations and road obstruction reports warrant monitoring.',
    affectedNodes: ['mumbai', 'wh-delhi'],
    signals: signals.filter(s => ['sig8', 'sig9'].includes(s.id)),
  },
];

export const geminiAdvisory = {
  summary: "A convergence of 5 precursor signals indicates a high-probability disruption at Chennai Port within the next 48-72 hours. Port energy anomalies suggest equipment failures or unplanned maintenance at Container Terminal 3. Coupled with vessel queuing anomalies (12 vessels holding) and approaching cyclonic weather, this creates a compound risk scenario.",
  confidence: 87,
  recommendedRoute: "Divert Chennai-bound cargo via Tuticorin Port → NH44 corridor → Bangalore Warehouse. Estimated additional transit: 6-8 hours. Tuticorin currently operating at 62% capacity with clear approach channels.",
  costDelta: "₹18,500 per TEU additional logistics cost (₹12,200 port handling differential + ₹6,300 extended road transport)",
  delayReduction: 72,
  riskReduction: "From 87% disruption probability to 24% via Tuticorin reroute",
};
