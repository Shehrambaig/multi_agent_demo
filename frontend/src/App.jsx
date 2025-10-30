import React, { useState } from 'react';
import axios from 'axios';
import ComparisonView from './components/ComparisonView';

const App = () => {
  const [problem, setProblem] = useState('');
  const [singleResult, setSingleResult] = useState(null);
  const [multiResult, setMultiResult] = useState(null);
  const [singleLoading, setSingleLoading] = useState(false);
  const [multiLoading, setMultiLoading] = useState(false);
  const [error, setError] = useState('');



  const sampleProblems = [
    {
      text: "Alice, Ben, and Chloe are counting their stamps.Alice has 3/5 the number of stamps that Ben has.Chloe has 12 fewer stamps than Alice.If Ben were to give Alice 5 stamps, Ben would then have exactly twice as many stamps as Chloe.How many stamps does Chloe have?",
      answer: "45 stamps"
    },
    {
      text: "A shipment of books is distributed among three libraries: Central, East, and West.The West library received 40% more books than the East library.The Central library received 15% fewer books than the West library.If the East library received 180 fewer books than the Central library, how many books did the West library receive? (Round your final answer to the nearest whole number, as books must be integers).",
      answer: "1326 Books"
    },
    {
      text: "A warehouse contains three crates: Alpha, Beta, and Gamma.The sum of the weights of the Alpha and Beta crates is 90% of the weight of the Gamma crate.The Alpha crate is 25% heavier than the Beta crate.If the Gamma crate is 880 kg, what is the weight of the Beta crate?",
      answer: "352 kg"
    }
  ];

  const handleSolve = async () => {
    if (!problem.trim()) {
      setError('Please enter a problem to solve');
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
          content: `Error: ${err.response?.data?.detail || err.message}`,
          step_number: 1
        }],
        total_steps: 1,
        error: err.response?.data?.detail || err.message
      });
    } finally {
      setSingleLoading(false);
    }
  };

  const solveMultiAgent = async () => {
    setMultiLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/solve/multi', {
        problem: problem
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
          <h1 style={styles.title}>Single VS Multi-Agent System Demo</h1>
          <p style={styles.subtitle}>
            Comparing single agent vs  Multi-Agent reasoning
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

            <button
              style={styles.solveButton}
              onClick={handleSolve}
              disabled={singleLoading || multiLoading}
            >
              {(singleLoading || multiLoading) ? 'Solving...' : ' Solve Problem'}
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
            <strong>How it works:</strong> The single agent uses no reasoning
            which may struggle with complex reasoning. The multi-agent system uses two agents that debate
            to reach the correct answer.
          </p>
          <p style={{marginTop: '10px', fontSize: '12px'}}>
            💡 <strong>Note:</strong> All API keys are configured on the server (.env file).
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