import React from 'react';
import SingleAgent from './SingleAgent';
import MultiAgent from './MultiAgent';

const ComparisonView = ({ singleResult, multiResult, singleLoading, multiLoading }) => {
  return (
    <div style={styles.container}>
      <div style={styles.column}>
        <SingleAgent result={singleResult} loading={singleLoading} />
      </div>
      <div style={styles.divider}>
        <div style={styles.vsCircle}>VS</div>
      </div>
      <div style={styles.column}>
        <MultiAgent result={multiResult} loading={multiLoading} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    gap: '20px',
    alignItems: 'start',
  },
  column: {
    minWidth: 0, // Allows text wrapping in grid items
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '40px',
  },
  vsCircle: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '700',
    color: '#667eea',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  '@media (max-width: 1024px)': {
    container: {
      gridTemplateColumns: '1fr',
      gap: '30px',
    },
    divider: {
      display: 'none',
    },
  },
};

export default ComparisonView;