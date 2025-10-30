cat > /mnt/user-data/outputs/multi-agent-demo/RUN_COMMANDS.txt << 'EOF'
🚀 MULTI-AGENT SYSTEM DEMO - RUN COMMANDS
==========================================

OPTION 1: AUTOMATED SETUP (RECOMMENDED)
---------------------------------------
cd multi-agent-demo
chmod +x setup.sh
./setup.sh


OPTION 2: MANUAL SETUP
-----------------------

TERMINAL 1 - Backend:
--------------------
cd multi-agent-demo/backend
python3 -m venv venv
source venv/bin/activate              # Mac/Linux
# OR
venv\Scripts\activate                 # Windows

pip install -r requirements.txt
python main.py

✅ Backend running at: http://localhost:8000


TERMINAL 2 - Frontend:
---------------------
cd multi-agent-demo/frontend
npm install
npm run dev

✅ Frontend running at: http://localhost:3000


BROWSER:
--------
Open: http://localhost:3000
Enter your OpenAI API key
Try a sample problem!


TESTING THE API DIRECTLY:
--------------------------

Test Single Agent:
curl -X POST http://localhost:8000/api/solve/single \
  -H "Content-Type: application/json" \
  -d '{"problem": "John has 5 apples and buys 3 more. How many does he have?"}'

Test Multi-Agent:
curl -X POST http://localhost:8000/api/solve/multi \
  -H "Content-Type: application/json" \
  -d '{"problem": "Sarah has 15 apples. She gives 3 to her friend and buys 8 more. Then she uses half to make a pie. How many apples does Sarah have left?", "openai_api_key": "sk-your-key-here"}'

Get Sample Problems:
curl http://localhost:8000/api/sample-problems


TROUBLESHOOTING:
----------------

Port Already in Use:
  Backend (8000): lsof -ti:8000 | xargs kill -9
  Frontend (3000): lsof -ti:3000 | xargs kill -9

Python Virtual Environment Not Working:
  python3 -m pip install --upgrade pip
  deactivate
  rm -rf venv
  python3 -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt

Node Modules Issues:
  rm -rf node_modules package-lock.json
  npm install

API Key Error:
  - Double check your OpenAI API key
  - Ensure you have API credits
  - Try setting in backend/.env file


STOPPING THE SERVERS:
---------------------
Ctrl + C in each terminal window


ENVIRONMENT VARIABLES (OPTIONAL):
----------------------------------
Create backend/.env file:
echo "OPENAI_API_KEY=sk-your-key-here" > backend/.env


PROJECT STRUCTURE:
------------------
multi-agent-demo/
├── backend/              # Python FastAPI
│   ├── main.py          # Server
│   ├── agents/          # Agent implementations
│   └── models/          # Data schemas
├── frontend/            # React app
│   ├── src/
│   │   ├── App.jsx     # Main component
│   │   └── components/ # UI components
│   └── package.json
├── README.md           # Full documentation
├── QUICKSTART.md       # Quick guide
├── PROJECT_OVERVIEW.md # Complete overview
├── ARCHITECTURE.md     # System diagrams
└── RUN_COMMANDS.txt   # This file!


WHAT TO EXPECT:
---------------
1. Single Agent (LEFT) - Will give WRONG answers
   - Uses simple pattern matching
   - Fast but inaccurate
   - Shows flawed reasoning

2. Multi-Agent (RIGHT) - Will give CORRECT answers
   - Two agents debate the solution
   - Slower but accurate
   - Shows collaborative reasoning


SAMPLE PROBLEMS TO TRY:
------------------------
1. Sarah has 15 apples. She gives 3 to her friend and buys 8 more.
   Then she uses half to make a pie. How many apples does Sarah have left?
   ✅ Correct Answer: 10

2. A train travels from City A to City B at 60 mph. The return journey
   from City B to City A takes 3 hours at 80 mph. What is the total
   distance of the round trip?
   ✅ Correct Answer: 480 miles

3. Tom has twice as many marbles as Jerry. Jerry has 5 more marbles
   than Bobby. If Bobby has 8 marbles, how many marbles do Tom, Jerry,
   and Bobby have in total?
   ✅ Correct Answer: 47


NEED MORE HELP?
---------------
- Check README.md for detailed documentation
- Check QUICKSTART.md for step-by-step guide
- Check ARCHITECTURE.md for system design
- Check PROJECT_OVERVIEW.md for file explanations


Happy Coding! 🎉
EOF
cat /mnt/user-data/outputs/multi-agent-demo/RUN_COMMANDS.txt
Output

🚀 MULTI-AGENT SYSTEM DEMO - RUN COMMANDS
==========================================

OPTION 1: AUTOMATED SETUP (RECOMMENDED)
---------------------------------------
cd multi-agent-demo
chmod +x setup.sh
./setup.sh


OPTION 2: MANUAL SETUP
-----------------------

TERMINAL 1 - Backend:
--------------------
cd multi-agent-demo/backend
python3 -m venv venv
source venv/bin/activate              # Mac/Linux
# OR
venv\Scripts\activate                 # Windows

pip install -r requirements.txt
python main.py

✅ Backend running at: http://localhost:8000


TERMINAL 2 - Frontend:
---------------------
cd multi-agent-demo/frontend
npm install
npm run dev

✅ Frontend running at: http://localhost:3000


BROWSER:
--------
Open: http://localhost:3000
Enter your OpenAI API key
Try a sample problem!


TESTING THE API DIRECTLY:
--------------------------

Test Single Agent:
curl -X POST http://localhost:8000/api/solve/single \
  -H "Content-Type: application/json" \
  -d '{"problem": "John has 5 apples and buys 3 more. How many does he have?"}'

Test Multi-Agent:
curl -X POST http://localhost:8000/api/solve/multi \
  -H "Content-Type: application/json" \
  -d '{"problem": "Sarah has 15 apples. She gives 3 to her friend and buys 8 more. Then she uses half to make a pie. How many apples does Sarah have left?", "openai_api_key": "sk-your-key-here"}'

Get Sample Problems:
curl http://localhost:8000/api/sample-problems


TROUBLESHOOTING:
----------------

Port Already in Use:
  Backend (8000): lsof -ti:8000 | xargs kill -9
  Frontend (3000): lsof -ti:3000 | xargs kill -9

Python Virtual Environment Not Working:
  python3 -m pip install --upgrade pip
  deactivate
  rm -rf venv
  python3 -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt

Node Modules Issues:
  rm -rf node_modules package-lock.json
  npm install

API Key Error:
  - Double check your OpenAI API key
  - Ensure you have API credits
  - Try setting in backend/.env file


STOPPING THE SERVERS:
---------------------
Ctrl + C in each terminal window


ENVIRONMENT VARIABLES (OPTIONAL):
----------------------------------
Create backend/.env file:
echo "OPENAI_API_KEY=sk-your-key-here" > backend/.env


PROJECT STRUCTURE:
------------------
multi-agent-demo/
├── backend/              # Python FastAPI
│   ├── main.py          # Server
│   ├── agents/          # Agent implementations
│   └── models/          # Data schemas
├── frontend/            # React app
│   ├── src/
│   │   ├── App.jsx     # Main component
│   │   └── components/ # UI components
│   └── package.json
├── README.md           # Full documentation
├── QUICKSTART.md       # Quick guide
├── PROJECT_OVERVIEW.md # Complete overview
├── ARCHITECTURE.md     # System diagrams
└── RUN_COMMANDS.txt   # This file!


WHAT TO EXPECT:
---------------
1. Single Agent (LEFT) - Will give WRONG answers
   - Uses simple pattern matching
   - Fast but inaccurate
   - Shows flawed reasoning

2. Multi-Agent (RIGHT) - Will give CORRECT answers
   - Two agents debate the solution
   - Slower but accurate
   - Shows collaborative reasoning


SAMPLE PROBLEMS TO TRY:
------------------------
1. Sarah has 15 apples. She gives 3 to her friend and buys 8 more.
   Then she uses half to make a pie. How many apples does Sarah have left?
   ✅ Correct Answer: 10

2. A train travels from City A to City B at 60 mph. The return journey
   from City B to City A takes 3 hours at 80 mph. What is the total
   distance of the round trip?
   ✅ Correct Answer: 480 miles

3. Tom has twice as many marbles as Jerry. Jerry has 5 more marbles
   than Bobby. If Bobby has 8 marbles, how many marbles do Tom, Jerry,
   and Bobby have in total?
   ✅ Correct Answer: 47


NEED MORE HELP?
---------------
- Check README.md for detailed documentation
- Check QUICKSTART.md for step-by-step guide
- Check ARCHITECTURE.md for system design
- Check PROJECT_OVERVIEW.md for file explanations


Happy Coding! 🎉