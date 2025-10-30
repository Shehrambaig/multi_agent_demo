import React from 'react';

const SingleAgent = ({ result, loading }) => {
  if (!result && !loading) {
    return (
      <div style={styles.placeholder}>
        <div style={styles.icon}>🤖</div>
        <p style={styles.placeholderText}>Gemini Agent awaiting problem...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title}>Single Agent </h3>
          <div style={styles.statusBadge}>Processing...</div>
        </div>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Thinking with Gemini...</p>
        </div>
      </div>
    );
  }

  const isCorrect = result.success && !result.error;
  const headerColor = isCorrect ? '#34d399' : '#ef4444';

  return (
    <div style={styles.container}>
      <div style={{...styles.header, borderLeftColor: headerColor}}>
        <h3 style={styles.title}>Single Agent </h3>
        <div style={{...styles.statusBadge, backgroundColor: headerColor}}>
          {result.success ? '✓ Completed' : '❌ Failed'}
        </div>
      </div>

      <div style={styles.content}>
        <div style={{
          ...styles.answerBox,
          backgroundColor: isCorrect ? '#d1fae5' : '#fef2f2',
          borderColor: isCorrect ? '#6ee7b7' : '#fecaca'
        }}>
          <span style={{
            ...styles.answerLabel,
            color: isCorrect ? '#065f46' : '#991b1b'
          }}>Final Answer:</span>
          <span style={{
            ...styles.answer,
            color: isCorrect ? '#059669' : '#dc2626'
          }}>{result.final_answer}</span>
        </div>

        <div style={styles.stepsSection}>
          <h4 style={styles.stepsTitle}>Gemini Reasoning:</h4>
          <div style={styles.stepsList}>
            {result.reasoning_steps.map((step, idx) => (
              <div key={idx} style={styles.step}>
                <div style={styles.stepHeader}>
                  <span style={styles.stepNumber}>Step {step.step_number}</span>
                  <span style={styles.agentName}>{step.agent}</span>
                </div>
                <div style={styles.stepContent}>{step.content}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.summary}>
          <strong>Total Steps:</strong> {result.total_steps}
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
    border: '2px solid',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  answerLabel: {
    fontWeight: '600',
  },
  answer: {
    fontSize: '24px',
    fontWeight: '700',
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
    borderLeft: '3px solid #d1d5db',
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
    fontWeight: '500',
    color: '#9ca3af',
  },
  stepContent: {
    fontSize: '14px',
    color: '#374151',
    lineHeight: '1.5',
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
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// Add keyframe animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default SingleAgent;