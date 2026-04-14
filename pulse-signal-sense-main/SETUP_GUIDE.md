# Pulse Signal Sense - Setup Guide

## 🚀 Quick Start

### Backend Setup (Python FastAPI + Gemini AI)

1. **Install Python** (if not already installed)
   - Download from: https://www.python.org/downloads/
   - Make sure to check "Add Python to PATH" during installation

2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```
   OR
   ```bash
   python -m pip install -r requirements.txt
   ```

4. **Start the backend server**
   ```bash
   uvicorn main:app --reload
   ```
   
   The backend will run at: http://127.0.0.1:8000

5. **Test the backend**
   - Open http://127.0.0.1:8000 in your browser
   - You should see: `{"message": "Backend running 🚀"}`
   - API Docs available at: http://127.0.0.1:8000/docs

### Frontend Setup (React + Vite)

1. **Navigate to project root**
   ```bash
   cd pulse-signal-sense-main
   ```

2. **Install Node dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   
   The frontend will run at: http://localhost:8080

## 📡 API Endpoints

### Backend APIs (Port 8000)

1. **Test Endpoint**
   - `GET /`
   - Returns: Backend status message

2. **Intel Classification**
   - `POST /api/intel`
   - Body: `{ "text": "Your field report here" }`
   - Returns: AI-classified intel with location, severity, and summary

3. **Simulate Disruption**
   - `POST /api/simulate-disruption`
   - Body: `{ "port_name": "Chennai", "confidence": 85, "signals": ["Weather alert", "Port delay"] }`
   - Returns: AI-generated disruption advisory with reroute recommendations

4. **Get Signals**
   - `GET /api/signals`
   - Returns: List of current disruption signals

## 🔧 Features Integrated

✅ **Intel Classification** - Submit field reports via the Intel Panel input
✅ **AI-Powered Analysis** - Uses Gemini 1.5 Pro for intelligent classification
✅ **Real-time Signals** - Fetches disruption signals from backend
✅ **Disruption Advisory** - AI generates reroute recommendations and cost estimates

## 🎨 Lovable AI Footprints Removed

✅ Removed all "Lovable" branding from index.html
✅ Removed lovable-tagger from vite.config.ts
✅ Removed lovable-tagger from package.json
✅ Updated meta tags to "Pulse Signal Sense"
✅ Updated social media tags

## 📝 Using the Intel Panel

1. Type a logistics field report in the input box
2. Press Enter or click the Send button
3. The report will be sent to the backend for AI classification
4. Results will appear in the intel feed with:
   - Classification type (Road Block, Weather Event, etc.)
   - Location
   - Severity level
   - Timestamp

## 🔑 API Key

The Gemini API key is already configured in `backend/main.py`:
```python
genai.configure(api_key="AIzaSyBUoz20WPDibQIqthf-XkfOvc93BLXiF2w")
```

⚠️ **Security Note**: For production, use environment variables instead of hardcoding API keys.

## 🐛 Troubleshooting

**Backend won't start:**
- Ensure Python is installed and in PATH
- Run `pip --version` to verify
- Try `python -m pip install -r requirements.txt`

**Frontend can't connect to backend:**
- Ensure backend is running on port 8000
- Check CORS settings if deploying to different domains
- Verify the fetch URL in IntelPanel.tsx

**Module not found errors:**
- Run `npm install` in the project root
- Run `pip install -r requirements.txt` in backend folder

## 📦 Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components

**Backend:**
- Python FastAPI
- Google Gemini AI (gemini-1.5-pro)
- Uvicorn ASGI server
