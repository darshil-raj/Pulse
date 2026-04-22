import os
import json
import logging
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai

# -----------------------------
# 🪵 PROFESSIONAL LOGGING SETUP
# -----------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("PULSE")

# Load environment variables
load_dotenv()

# 🔑 SET YOUR API KEY (via .env)
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    logger.warning("GEMINI_API_KEY not found in environment variables. AI features will fail.")

client = genai.Client(api_key=API_KEY)

app = FastAPI(title="PULSE Backend", version="1.0.0")

# ✅ Middleware for Request Logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = datetime.now()
    response = await call_next(request)
    duration = datetime.now() - start_time
    logger.info(f"REQ: {request.method} {request.url.path} | STATUS: {response.status_code} | DUR: {duration.total_seconds():.3f}s")
    return response

# ✅ Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev, ideally restricted in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Gemini response helper with professional terminal feedback
def get_ai_response(prompt, context_label="General"):
    logger.info(f"🤖 GEMINI CALL [{context_label}] | Sending prompt...")
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        logger.info(f"✅ GEMINI RESPONSE RECEIVED | Length: {len(response.text)} chars")
        return response.text
    except Exception as e:
        logger.error(f"❌ GEMINI ERROR: {str(e)}")
        return f"Error: {str(e)}"

# -----------------------------
# REQUEST MODELS
# -----------------------------
class IntelRequest(BaseModel):
    text: str

class DisruptionRequest(BaseModel):
    port_name: str
    confidence: int
    signals: list

# -----------------------------
# ROUTES
# -----------------------------

@app.get("/")
def home():
    return {"status": "online", "engine": "PULSE 1.0", "timestamp": datetime.now().isoformat()}

@app.post("/api/intel")
def classify_intel(req: IntelRequest):
    logger.info(f"📩 INTEL RECEIVED: \"{req.text[:50]}...\"")
    prompt = f"""
    You are a logistics AI analyst for PULSE.
    Classify this logistics field report:
    Road Block, Weather Event, Strike, Police Check, Port Congestion, Other.

    Extract JSON:
    - classification (the type)
    - location
    - severity (Low/Medium/High)
    - summary (one-line)

    Return ONLY raw JSON. No markdown.
    Report: {req.text}
    """

    result = get_ai_response(prompt, "Intel Classification")
    
    # Cleaning markdown if Gemini returns it
    if "```json" in result:
        result = result.split("```json")[1].split("```")[0].strip()
    elif "```" in result:
        result = result.split("```")[1].split("```")[0].strip()

    logger.info(f"📊 CLASSIFIED AS: {result}")
    return {"result": result}

@app.post("/api/simulate-disruption")
def simulate_disruption(req: DisruptionRequest):
    logger.info(f"⚡ SIMULATING DISRUPTION @ {req.port_name}")
    signals_text = ", ".join(req.signals)

    prompt = f"""
    You are PULSE AI Advisor. Generate a professional reroute advisory for {req.port_name}.
    Precursor Signals: {signals_text}
    Confidence: {req.confidence}%

    Required:
    1. Disruption Summary
    2. Recommended Reroute Corridor
    3. Estimated Cost Delta (INR)
    4. Risk Reduction %
    
    Format: Brief professional brief.
    """

    result = get_ai_response(prompt, "Disruption Advisory")
    logger.info("📄 ADVISORY GENERATED")
    return {"port": req.port_name, "advisory": result}


# -----------------------------
# SIGNAL & GRAPH DATA (In-Memory for Prototype)
# -----------------------------
SIGNAL_STORE = [
    {"id": "1", "type": "Weather", "location": "Chennai", "severity": "High", "lat": 13.08, "lng": 80.27, "timestamp": "2026-04-22T10:00:00Z"},
    {"id": "2", "type": "AIS Vessel", "location": "Mumbai", "severity": "Medium", "lat": 18.94, "lng": 72.84, "timestamp": "2026-04-22T11:30:00Z"}
]

# Simple dependency graph for GNN Cascade simulation
# Port -> Warehouse -> DC
LOGISTICS_GRAPH = {
    "chennai": ["wh-bangalore", "wh-hyderabad"],
    "mumbai": ["wh-pune", "wh-ahmedabad"],
    "tuticorin": ["wh-bangalore"],
    "wh-bangalore": ["dc-coimbatore"],
    "wh-hyderabad": ["dc-lucknow"],
}

# ✅ 4. Get Signals (Live Radar)
@app.get("/api/signals")
def get_signals():
    return SIGNAL_STORE

# ✅ 5. Add Signal (Simulate Radar Ingestion)
class RadarSignal(BaseModel):
    type: str
    location: str
    severity: str
    lat: float
    lng: float

@app.post("/api/radar/ingest")
def ingest_signal(sig: RadarSignal):
    new_sig = sig.model_dump()
    new_sig["id"] = str(len(SIGNAL_STORE) + 1)
    new_sig["timestamp"] = "2026-04-22T12:00:00Z"
    SIGNAL_STORE.append(new_sig)
    return {"status": "ingested", "signal_id": new_sig["id"]}

# ✅ 6. GNN Cascade Simulation
@app.get("/api/cascade/{node_id}")
def simulate_cascade(node_id: str):
    """Simulates the 'Blast Radius' of a disruption at a specific node."""
    impacted = []
    queue = [node_id.lower()]
    visited = set()

    while queue:
        curr = queue.pop(0)
        if curr in visited: continue
        visited.add(curr)
        
        children = LOGISTICS_GRAPH.get(curr, [])
        for child in children:
            impacted.append({
                "id": child,
                "predicted_delay": "4-6 hours",
                "risk_increase": "45%"
            })
            queue.append(child)
            
    return {
        "source": node_id,
        "impacted_nodes": impacted,
        "total_blast_radius": len(impacted)
    }
