import React from 'react';

const MultiAgent = ({ result, loading }) => {
  if (!result && !loading) {
    return (
      <div style={styles.placeholder}>
        <div style={styles.icon}>🤝</div>
        <p style={styles.placeholderText}>Multi-Agent system awaiting problem...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title}>Multi-Agent System (Debate)</h3>
          <div style={styles.statusBadge}>Debating...</div>
        </div>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Agents are discussing the problem...</p>
        </div>
      </div>
    );
  }

  const isCorrect = result.success && !result.error;
  const headerColor = isCorrect ? '#10b981' : '#f59e0b';

  // Separate steps by agent
  const getAgentColor = (agentName) => {
    if (agentName.includes('Agent 1') || agentName.includes('Proposer')) return '#3b82f6';
    if (agentName.includes('Agent 2') || agentName.includes('Critic')) return '#8b5cf6';
    return '#6b7280';
  };

  return (
    <div style={styles.container}>
      <div style={{...styles.header, borderLeftColor: headerColor}}>
        <h3 style={styles.title}>Multi-Agent System (Debate)</h3>
        <div style={{...styles.statusBadge, backgroundColor: headerColor}}>
          {result.success ? '✓ Completed' : '⚠️ Error'}
        </div>
      </div>

      <div style={styles.content}>
        <div style={{...styles.answerBox, backgroundColor: '#f0fdf4', borderColor: '#bbf7d0'}}>
          <span style={{...styles.answerLabel, color: '#166534'}}>Final Answer:</span>
          <span style={{...styles.answer, color: '#16a34a'}}>{result.final_answer}</span>
        </div>

        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <div style={{...styles.legendDot, backgroundColor: '#3b82f6'}}></div>
            <span>Agent 1 (Proposer)</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendDot, backgroundColor: '#8b5cf6'}}></div>
            <span>Agent 2 (Critic)</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendDot, backgroundColor: '#6b7280'}}></div>
            <span>System</span>
          </div>
        </div>

        <div style={styles.stepsSection}>
          <h4 style={styles.stepsTitle}>Agent Dialogue:</h4>
          <div style={styles.stepsList}>
            {result.reasoning_steps.map((step, idx) => {
              const agentColor = getAgentColor(step.agent);
              return (
                <div key={idx} style={{...styles.step, borderLeftColor: agentColor}}>
                  <div style={styles.stepHeader}>
                    <span style={styles.stepNumber}>Step {step.step_number}</span>
                    <span style={{...styles.agentName, color: agentColor}}>
                      {step.agent}
                    </span>
                  </div>
                  <div style={styles.stepContent}>{step.content}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={styles.summary}>
          <strong>Total Steps:</strong> {result.total_steps} | 
          <strong> Debate Rounds:</strong> {Math.ceil(result.total_steps / 3)}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  placeholder: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '60px 20px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  icon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  placeholderText: {
    color: '#6b7280',
    fontSize: '16px',
  },
  header: {
    padding: '20px',
    borderLeft: '4px solid',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#3b82f6',
  },
  content: {
    padding: '20px',
  },
  answerBox: {
    backgroundColor: '#f0fdf4',
    border: '2px solid #bbf7d0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  answerLabel: {
    fontWeight: '600',
    color: '#166534',
  },
  answer: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#16a34a',
  },
  legend: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#4b5563',
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  stepsSection: {
    marginBottom: '20px',
  },
  stepsTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px',
  },
  stepsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  step: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '12px',
    borderLeft: '3px solid',
  },
  stepHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  stepNumber: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
  },
  agentName: {
    fontSize: '12px',
    fontWeight: '600',
  },
  stepContent: {
    fontSize: '14px',
    color: '#374151',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
  },
  summary: {
    padding: '12px',
    backgroundColor: '#f3f4f6',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#4b5563',
  },
  loading: {
    padding: '60px 20px',
    textAlign: 'center',
  },
  spinner: {
    width: '40px',
    height: '40px',
    margin: '0 auto 20px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #10b981',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

export default MultiAgent;