from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai

# 🔑 SET YOUR API KEY
client = genai.Client(api_key="AIzaSyBUoz20WPDibQIqthf-XkfOvc93BLXiF2w")

app = FastAPI()

# ✅ Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Gemini response helper function with error handling
def get_response(prompt):
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
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

# ✅ 1. Test API
@app.get("/")
def home():
    return {"message": "Backend running 🚀"}

# ✅ 2. Intel Classification
@app.post("/api/intel")
def classify_intel(req: IntelRequest):
    prompt = f"""
    Classify this logistics field report into one of:
    Road Block, Weather Event, Strike, Police Check, Port Congestion, Other.

    Also extract:
    - Location
    - Severity (Low/Medium/High)
    - One-line summary

    Return in JSON format.

    Report: {req.text}
    """

    result = get_response(prompt)

    return {"result": result}


# ✅ 3. Simulate Disruption
@app.post("/api/simulate-disruption")
def simulate_disruption(req: DisruptionRequest):
    signals_text = ", ".join(req.signals)

    prompt = f"""
    You are a logistics AI advisor.

    A disruption is detected at {req.port_name} with {req.confidence}% confidence.

    Signals:
    {signals_text}

    Generate:
    1. Short disruption summary
    2. Recommended reroute
    3. Estimated cost change (INR)
    4. Delay risk reduction %
    5. Confidence level

    Keep it short and professional.
    """

    result = get_response(prompt)

    return {
        "port": req.port_name,
        "advisory": result
    }


# ✅ 4. Dummy signals (for UI)
@app.get("/api/signals")
def get_signals():
    return [
        {"type": "Weather", "location": "Chennai", "severity": "High"},
        {"type": "AIS", "location": "Mumbai", "severity": "Medium"}
    ]
