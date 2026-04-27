# Pulse Signal Sense

Pulse Signal Sense is an AI-powered logistics disruption monitoring and intelligence platform. It leverages Google Gemini AI to analyze field reports and predict supply chain disruptions in real-time.

## ✨ Features

- **Intel Classification:** Real-time AI classification of field reports (Weather, Port Congestion, Strikes, etc.).
- **Disruption Advisory:** AI-generated rerouting recommendations and cost-benefit analysis.
- **Global Map Visualization:** Interactive tracking of port status and signal hotspots.
- **Signal Feed:** Live feed of incoming logistics intelligence.

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui.
- **Backend:** Python, FastAPI, Google Gemini AI (Gemini 2.0 Flash).

---

## 🚀 Installation & Setup

### 1. Backend Setup (Python FastAPI + Gemini AI)

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Set up a Virtual Environment**
   ```bash
   # Create the virtual environment
   python -m venv venv

   # Activate the virtual environment
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Gemini API Key**
   - Create a file named `.env` in the `backend/` folder:
     ```env
     GEMINI_API_KEY=your_actual_key_here
     ```
   - *Note: You can get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).*

5. **Start the backend server**
   ```bash
   uvicorn main:app --reload
   ```
   The backend will run at: `http://127.0.0.1:8000`

### 2. Frontend Setup (React + Vite)

1. **Navigate to project root**
   ```bash
   # Go back to root from backend (if you are there)
   cd ..
   ```

2. **Install Node dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   The frontend will run at: `http://localhost:8080`

---

## 📡 API Endpoints (Port 8000)

1. **Test Endpoint:** `GET /` - Returns backend status.
2. **Intel Classification:** `POST /api/intel` - Body: `{ "text": "Report text" }` (Gemini-powered).
3. **Radar Signal Ingest:** `POST /api/radar/ingest` - Body: `{ "type": "...", "location": "...", "severity": "...", "lat": 0.0, "lng": 0.0 }`
4. **Live Signals:** `GET /api/signals` - Fetches all current radar and human intel signals.
5. **GNN Cascade Simulation:** `GET /api/cascade/{node_id}` - Simulates downstream impact of a disruption at a specific port or warehouse.
6. **Simulate Disruption:** `POST /api/simulate-disruption` - Generates a Gemini reroute advisory brief.

---

## 🔑 AI Integration

The project uses the latest **Gemini 2.0 Flash** model for high-speed, intelligent logistics analysis.

- **Intel Panel:** Type a logistics field report (e.g., "Heavy rain in Chennai causing 2-hour delay") and press Send. The AI will classify it and update the feed.

---

## 🐛 Troubleshooting

- **Backend won't start:** Ensure Python is in your PATH. Try `python -m pip install -r requirements.txt`.
- **CORS Errors:** The backend is configured to allow requests from `http://localhost:8080`. Ensure your frontend is running on that port.
- **API Key Issues:** Check your `.env` file in the `backend/` directory.

Built for the future of resilient supply chains.
