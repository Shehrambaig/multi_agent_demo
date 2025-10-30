import React, { useState } from 'react';
import axios from 'axios';
import ComparisonView from './components/ComparisonView';

const App = () => {
  const [problem, setProblem] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [singleResult, setSingleResult] = useState(null);
  const [multiResult, setMultiResult] = useState(null);
  const [singleLoading, setSingleLoading] = useState(false);
  const [multiLoading, setMultiLoading] = useState(false);
  const [error, setError] = useState('');

  const sampleProblems = [
    {
      text: "Sarah has 15 apples. She gives 3 apples to her friend and then buys 8 more apples from the store. After that, she uses half of her apples to make a pie. How many apples does Sarah have left?",
      answer: "10 apples"
    },
    {
      text: "A train travels from City A to City B at 60 mph. The return journey from City B to City A takes 3 hours at 80 mph. What is the total distance of the round trip?",
      answer: "480 miles"
    },
    {
      text: "Tom has twice as many marbles as Jerry. Jerry has 5 more marbles than Bobby. If Bobby has 8 marbles, how many marbles do Tom, Jerry, and Bobby have in total?",
      answer: "47 marbles"
    }
  ];

  const handleSolve = async () => {
    if (!problem.trim()) {
      setError('Please enter a problem to solve');
      return;
    }

    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key');
      return;
    }

    setError('');
    setSingleResult(null);
    setMultiResult(null);

    // Solve with both agents simultaneously
    solveSingleAgent();
    solveMultiAgent();
  };

  const solveSingleAgent = async () => {
    setSingleLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/solve/single', {
        problem: problem
      });
      setSingleResult(response.data);
    } catch (err) {
      console.error('Single agent error:', err);
      setSingleResult({
        success: false,
        final_answer: 'Error',
        reasoning_steps: [{
          agent: 'System',
          content: `Error: ${err.message}`,
          step_number: 1
        }],
        total_steps: 1,
        error: err.message
      });
    } finally {
      setSingleLoading(false);
    }
  };

  const solveMultiAgent = async () => {
    setMultiLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/solve/multi', {
        problem: problem,
        openai_api_key: apiKey
      });
      setMultiResult(response.data);
    } catch (err) {
      console.error('Multi agent error:', err);
      setMultiResult({
        success: false,
        final_answer: 'Error',
        reasoning_steps: [{
          agent: 'System',
          content: `Error: ${err.response?.data?.detail || err.message}`,
          step_number: 1
        }],
        total_steps: 1,
        error: err.response?.data?.detail || err.message
      });
    } finally {
      setMultiLoading(false);
    }
  };

  const loadSampleProblem = (sample) => {
    setProblem(sample.text);
  };

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>🤖 Multi-Agent System Demo</h1>
          <p style={styles.subtitle}>
            Compare single-agent vs multi-agent reasoning on complex problems
          </p>
        </header>

        <div style={styles.inputSection}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Enter a Problem</h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Problem Statement:</label>
              <textarea
                style={styles.textarea}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Enter a complex math word problem..."
                rows={4}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>OpenAI API Key:</label>
              <input
                type="password"
                style={styles.input}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
              <p style={styles.hint}>
                Your API key is only used for this session and not stored
              </p>
            </div>

            <button
              style={styles.solveButton}
              onClick={handleSolve}
              disabled={singleLoading || multiLoading}
            >
              {(singleLoading || multiLoading) ? 'Solving...' : '🚀 Solve Problem'}
            </button>

            {error && (
              <div style={styles.error}>
                ⚠️ {error}
              </div>
            )}
          </div>

          <div style={styles.samplesCard}>
            <h3 style={styles.samplesTitle}>Sample Problems:</h3>
            <div style={styles.samplesList}>
              {sampleProblems.map((sample, idx) => (
                <div key={idx} style={styles.sampleItem}>
                  <p style={styles.sampleText}>{sample.text}</p>
                  <button
                    style={styles.loadButton}
                    onClick={() => loadSampleProblem(sample)}
                  >
                    Load
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {(singleResult || multiResult || singleLoading || multiLoading) && (
          <div style={styles.resultsSection}>
            <h2 style={styles.resultsTitle}>Results Comparison</h2>
            <ComparisonView
              singleResult={singleResult}
              multiResult={multiResult}
              singleLoading={singleLoading}
              multiLoading={multiLoading}
            />
          </div>
        )}

        <footer style={styles.footer}>
          <p>
            <strong>How it works:</strong> The single agent uses simple rule-based reasoning
            and will likely fail. The multi-agent system uses two GPT-4 agents that debate
            to reach the correct answer.
          </p>
        </footer>
      </div>
    </div>
  );
};

const styles = {
  app: {
    minHeight: '100vh',
    padding: '40px 20px',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    color: 'white',
  },
  title: {
    fontSize: '42px',
    fontWeight: '700',
    marginBottom: '10px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  },
  subtitle: {
    fontSize: '18px',
    opacity: 0.9,
  },
  inputSection: {
    marginBottom: '40px',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#1f2937',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontFamily: 'inherit',
    outline: 'none',
  },
  hint: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '6px',
  },
  solveButton: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#667eea',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  error: {
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    color: '#dc2626',
    fontSize: '14px',
  },
  samplesCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  samplesTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#1f2937',
  },
  samplesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sampleItem: {
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    fontSize: '13px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sampleText: {
    color: '#4b5563',
    lineHeight: '1.5',
  },
  loadButton: {
    alignSelf: 'flex-start',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#667eea',
    backgroundColor: 'white',
    border: '1px solid #667eea',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  resultsSection: {
    marginBottom: '40px',
  },
  resultsTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '20px',
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    color: 'white',
    fontSize: '14px',
    opacity: 0.9,
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
  },
};

export default App;