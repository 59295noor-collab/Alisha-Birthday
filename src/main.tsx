import { StrictMode, Component, ReactNode, ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class SafeErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', background: '#FFFDFB', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: '#be123c', fontSize: '24px', marginBottom: '16px' }}>Forever Yours · Birthday App</h1>
          <p style={{ color: '#44403c', marginBottom: '24px', maxWidth: '400px' }}>
            We encountered a small display issue. Click below to reload your celebration with fresh settings:
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.hash = '';
                window.location.reload();
              }}
              style={{ padding: '10px 20px', borderRadius: '9999px', background: '#e11d48', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Reset & Reload
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '10px 20px', borderRadius: '9999px', background: '#f5f5f4', color: '#1c1917', border: '1px solid #d6d3d1', cursor: 'pointer' }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <SafeErrorBoundary>
        <App />
      </SafeErrorBoundary>
    </StrictMode>
  );
}
