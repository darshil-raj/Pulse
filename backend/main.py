import os
import json
import logging
import asyncio
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

# -----------------------------
# 🪵 PROFESSIONAL LOGGING SETUP
# -----------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("PULSE")

# 🚀 MOCK MODE FORCE ENABLED (HARDCODED)
logger.info("******************************************")
logger.info("🛠️  PULSE CORE: HARDCODED MOCK AI MODE ACTIVE")
logger.info("******************************************")

app = FastAPI(title="PULSE Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# ✅ SHORTENED HARDCODED MOCK INTELLIGENCE
# -----------------------------
MOCK_ADVISORY = """PULSE NEURAL ADVISORY:

1. DISRUPTION SUMMARY:
High-intensity congestion at Chennai Port. 12 ships in queue due to terminal strike.

2. RECOMMENDED REROUTE:
Divert Bangalore-bound DC cargo to Ennore Port (Alternative Corridor B).

3. ESTIMATED COST DELTA:
+₹12,450 per shipment unit.

4. RISK REDUCTION:
92% SLA preservation for Chennai-Bangalore corridor."""

MOCK_CLASSIFICATION = {
    "classification": "Port Congestion",
    "location": "Chennai Port",
    "severity": "High",
    "summary": "Terminal strike and AIS vessel backlog detected."
}

# -----------------------------
# AI RESPONSE ENGINE
# -----------------------------
async def get_ai_response(prompt, context_label="General"):
    logger.info(f"⚡ MOCK RESPONSE GENERATING for [{context_label}]...")
    await asyncio.sleep(2) # Realistic thinking time
    
    if "Classify" in prompt:
        return json.dumps(MOCK_CLASSIFICATION), None
    return MOCK_ADVISORY, None

# -----------------------------
# ROUTES
# -----------------------------

@app.get("/")
def home():
    return {"status": "online", "mock_mode": True}

@app.get("/api/test-connection")
async def test_connection():
    return {"status": "success", "response": "MOCK NEURAL LINK: OK", "mode": "mock"}

@app.post("/api/simulate-disruption")
async def simulate_disruption(req: dict):
    port = req.get("port_name", "Chennai Port")
    logger.info(f"📡 Requesting Fusion Analysis for {port}")
    
    result, error = await get_ai_response(f"Generate advisory for {port}", "Disruption Advisory")
    return {"port": port, "advisory": result}

@app.post("/api/intel")
async def classify_intel(req: dict):
    text = req.get("text", "")
    result, error = await get_ai_response(f"Classify: {text}", "Intel Classification")
    return {"result": result, "error": error}

@app.get("/api/signals")
def get_signals():
    return [
        {"id": "1", "type": "Weather", "location": "Chennai", "severity": "High", "lat": 13.08, "lng": 80.27, "timestamp": datetime.now().isoformat()},
        {"id": "2", "type": "AIS Vessel", "location": "Mumbai", "severity": "Medium", "lat": 18.94, "lng": 72.84, "timestamp": datetime.now().isoformat()}
    ]

@app.post("/api/radar/ingest")
def ingest_signal(req: dict):
    return {"status": "ingested", "signal_id": "mock_id"}

@app.get("/api/cascade/{node_id}")
def simulate_cascade(node_id: str):
    LOGISTICS_GRAPH = {
        "chennai": ["wh-bangalore", "wh-hyderabad"],
        "mumbai": ["wh-pune", "wh-ahmedabad"],
        "tuticorin": ["wh-bangalore"],
        "wh-bangalore": ["dc-coimbatore"],
        "wh-hyderabad": ["dc-lucknow"],
    }
    impacted = []
    queue = [node_id.lower()]
    visited = set()
    while queue:
        curr = queue.pop(0)
        if curr in visited: continue
        visited.add(curr)
        children = LOGISTICS_GRAPH.get(curr, [])
        for child in children:
            impacted.append({"id": child, "predicted_delay": "4-6 hours", "risk_increase": "45%"})
            queue.append(child)
    return {"source": node_id, "impacted_nodes": impacted, "total_blast_radius": len(impacted)}
