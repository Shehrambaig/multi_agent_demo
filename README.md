# Multi-Agent System Demo

A demonstration project comparing single-agent vs multi-agent reasoning systems. This project shows how a simple rule-based agent fails on complex problems while a multi-agent debate system succeeds.

## 🎯 Project Overview

This demo implements two types of agents:

1. **Single Agent (Simple Rule-Based)**: Uses basic pattern matching and will typically fail on multi-step reasoning problems
2. **Multi-Agent System (Debate)**: Two GPT-4 agents (Proposer and Critic) that debate to reach the correct solution

## 📁 Project Structure

```
multi-agent-demo/
├── backend/                    # FastAPI Python backend
│   ├── main.py                # Main FastAPI server
│   ├── agents/
│   │   ├── single_agent.py    # Simple rule-based agent
│   │   └── multi_agent.py     # Multi-agent debate system
│   ├── models/
│   │   └── schemas.py         # Pydantic schemas
│   └── requirements.txt
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── App.jsx            # Main app component
│   │   ├── index.jsx          # Entry point
│   │   └── components/
│   │       ├── SingleAgent.jsx
│   │       ├── MultiAgent.jsx
│   │       └── ComparisonView.jsx
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. (Optional) Create a `.env` file for your API key:
```bash
echo "OPENAI_API_KEY=your-api-key-here" > .env
```

5. Run the backend server:
```bash
python main.py
```

The backend will start at `http://localhost:8000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start at `http://localhost:3000`

## 📝 Usage

1. Open your browser to `http://localhost:3000`
2. Enter your OpenAI API key (required for multi-agent system)
3. Either:
   - Type a complex math word problem, or
   - Click "Load" on one of the sample problems
4. Click "Solve Problem"
5. Watch as both agents attempt to solve the problem side-by-side

## 🎓 How It Works

### Single Agent (Fails)
The single agent uses simple keyword matching:
- Looks for words like "total", "sum" → adds all numbers
- Looks for "difference", "less" → subtracts numbers
- Doesn't understand context or multi-step reasoning
- **Result**: Usually gives wrong answers on complex problems

### Multi-Agent System (Succeeds)
Two specialized agents debate:
1. **Agent 1 (Proposer)**: Analyzes problem and proposes solution
2. **Agent 2 (Critic)**: Reviews reasoning, identifies errors
3. They go back and forth for up to 3 rounds
4. **Result**: Collaborative reasoning leads to correct answers

## 🔧 API Endpoints

### `POST /api/solve/single`
Solve with single agent
```json
{
  "problem": "Your math problem here"
}
```

### `POST /api/solve/multi`
Solve with multi-agent system
```json
{
  "problem": "Your math problem here",
  "openai_api_key": "sk-..."
}
```

### `GET /api/sample-problems`
Get sample problems with answers

## 🎨 Features

- ✅ Side-by-side comparison of agent reasoning
- ✅ Real-time display of internal dialogue
- ✅ Step-by-step reasoning visualization
- ✅ Sample problems to test
- ✅ Modern, responsive UI
- ✅ Color-coded agent responses

## 🔒 Security Notes

- API keys are not stored on the server
- Keys are only used for the current session
- Consider using environment variables for production

## 📊 Sample Problems Included

1. **Apple Problem** - Multi-step arithmetic
2. **Train Problem** - Speed, distance, time calculations
3. **Marble Problem** - Transitive relationships

## 🛠️ Technologies Used

**Backend:**
- FastAPI
- Python 3.8+
- OpenAI API
- Pydantic

**Frontend:**
- React 18
- Vite
- Axios

## 📖 Learning Outcomes

This demo illustrates:
- Limitations of simple rule-based AI
- Power of multi-agent collaboration
- Importance of debate/critique in reasoning
- LLM orchestration patterns

## 🤝 Contributing

This is a demo project for educational purposes. Feel free to:
- Add more agent types
- Implement different debate strategies
- Add more problem types
- Improve the UI

## 📄 License

MIT License - Feel free to use for educational purposes

## 🐛 Troubleshooting

**Backend won't start:**
- Ensure Python 3.8+ is installed
- Check that port 8000 is not in use
- Verify all dependencies are installed

**Frontend won't start:**
- Ensure Node.js 16+ is installed
- Try deleting `node_modules` and running `npm install` again
- Check that port 3000 is not in use

**Multi-agent not working:**
- Verify your OpenAI API key is correct
- Check you have API credits available
- Look at browser console and backend logs for errors

## 📚 Further Reading

- [Anthropic's Multi-Agent Research](https://www.anthropic.com/engineering/multi-agent-research-system)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)

---

Built for demonstrating multi-agent systems in AI 🤖