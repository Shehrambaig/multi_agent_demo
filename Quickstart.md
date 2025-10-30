# 🚀 Quick Start Guide

## Fastest Way to Run

### Step 1: Setup (First Time Only)
```bash
cd multi-agent-demo
chmod +x setup.sh
./setup.sh
```

### Step 2: Run Backend
Open Terminal 1:
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

Wait until you see: `Application startup complete`

### Step 3: Run Frontend
Open Terminal 2:
```bash
cd frontend
npm run dev
```

### Step 4: Use the App
1. Open browser to `http://localhost:3000`
2. Enter your OpenAI API key
3. Click "Load" on a sample problem or type your own
4. Click "Solve Problem"
5. Watch the agents work!

## What You'll See

- **Left Panel**: Single agent (simple, will fail)
- **Right Panel**: Multi-agent system (debate-based, will succeed)
- **Internal Dialogue**: See exactly how each agent reasons

## Sample Problems Provided

1. **Apple Problem** - Tests multi-step arithmetic
2. **Train Problem** - Tests speed/distance/time
3. **Marble Problem** - Tests relationship reasoning

## Troubleshooting

**Port already in use?**
- Backend (8000): Kill the process or change port in `main.py`
- Frontend (3000): Change port in `vite.config.js`

**API Key Not Working?**
- Double-check your OpenAI API key
- Ensure you have API credits
- Try setting it in `backend/.env` file

**Dependencies Error?**
- Backend: `pip install --upgrade pip` then retry
- Frontend: Delete `node_modules`, run `npm install` again

## Need Help?

Check the full README.md for detailed documentation!