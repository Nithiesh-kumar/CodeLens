import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CodeLens Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#02020A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#E0E0FF',
          fontFamily: 'Space Grotesk, sans-serif',
          textAlign: 'center',
          padding: '24px'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', textShadow: '0 0 20px rgba(255, 77, 109, 0.4)' }}>⚠️</div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: 'bold' }}>
            Something went wrong
          </h1>
          <p style={{ color: 'rgba(180,180,220,0.6)', marginBottom: '24px', fontSize: '14px' }}>
            CodeLens encountered an unexpected error.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-premium"
            style={{
              background: 'linear-gradient(135deg, #9D4EDD, #48CAE4)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontWeight: 700,
              padding: '12px 24px',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              cursor: 'pointer'
            }}
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
